const jwt = require("jsonwebtoken");
const Consultation = require("../models/Consultation");
const Message = require("../models/Message");

const chatSocket = (io) => {
  io.on("connection", async (socket) => {
    console.log("Socket connected:", socket.id);

    /* ================= AUTHENTICATE USER ================= */

    const token = socket.handshake.auth?.token;

    if (!token) {
      console.log("Socket rejected: No token");
      return socket.disconnect();
    }

    let user;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = decoded;
      socket.user = decoded;
    } catch (err) {
      console.log("Socket rejected: Invalid token");
      return socket.disconnect();
    }

    /* ================= JOIN CONSULTATION ROOM ================= */

    socket.on("joinConsultation", (consultationId) => {
      socket.join(consultationId);
    });

    /* ================= SEND MESSAGE ================= */

    socket.on("sendMessage", async (data) => {
      try {
        const {
          consultationId,
          message,
          fileUrl,
          fileName,
          fileType,
          fileSize,
        } = data;

        const hasText = message && message.trim() !== "";
        const hasFile = !!fileUrl;

        if (!hasText && !hasFile) {
          return socket.emit("error", "Message cannot be empty");
        }

        const consultation = await Consultation.findOne({ consultationId });

        if (!consultation) {
          return socket.emit("error", "Consultation not found");
        }

        if (consultation.status === "closed") {
          return socket.emit("error", "Consultation closed");
        }

        if (
          consultation.userId !== user.userId &&
          consultation.expertId !== user.userId
        ) {
          return socket.emit("error", "Unauthorized");
        }

        const receiverId =
          consultation.userId === user.userId
            ? consultation.expertId
            : consultation.userId;

        const newMessage = await Message.create({
          consultationId,
          senderId: user.userId,
          receiverId,
          message: hasText ? message.trim() : null,
          fileUrl: fileUrl || null,
          fileName: fileName || null,
          fileType: fileType || null,
          fileSize: fileSize || null,
        });

        io.to(consultationId).emit("receiveMessage", newMessage);
      } catch (error) {
        console.log(error);
      }
    });

    /* ================= TYPING INDICATOR ================= */

    socket.on("typing", (consultationId) => {
      socket.to(consultationId).emit("typing", {
        userId: socket.user.userId,
      });
    });

    socket.on("stopTyping", (consultationId) => {
      socket.to(consultationId).emit("stopTyping");
    });

    /* ================= DISCONNECT ================= */

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });

    socket.on("consultationClosed", (consultationId) => {
      io.to(consultationId).emit("chatClosed", consultationId);
    });
  });
};

module.exports = chatSocket;
