const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    consultationId: {
      type: String,
      required: true,
    },

    senderId: {
      type: String,
      required: true,
    },

    receiverId: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      default: null,
    },

    messageType: {
      type: String,
      enum: ["user", "system"],
      default: "user",
    },

    fileUrl: {
      type: String,
      default: null,
    },

    fileName: {
      type: String,
      default: null,
    },

    fileType: {
      type: String,
      default: null,
    },

    fileSize: {
      type: Number,
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Message", messageSchema);
