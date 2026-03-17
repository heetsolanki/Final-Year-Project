const Consultation = require("../models/Consultation");
const Expert = require("../models/Expert");
const sendEmail = require("../utils/sendEmail");
const newConsultationEmail = require("../template/newConsultationEmail");
const { createNotification, NOTIFICATION_TYPES } = require("../services/notificationService");
const {
  formatAvailabilityWindow,
  isWithinAvailability,
} = require("../utils/availability");

exports.createConsultation = async (req, res) => {
  try {
    const { expertUserId } = req.body;

    const expert = await Expert.findOne({ userId: expertUserId });

    if (
      !expert ||
      !expert.isActive ||
      expert.verificationStatus !== "active"
    ) {
      return res.status(400).json({ message: "Expert unavailable" });
    }

    if (!isWithinAvailability(expert.availability)) {
      return res.status(400).json({
        message: `Expert is currently offline. Available between ${formatAvailabilityWindow(expert.availability)}.`,
      });
    }

    const consultationId =
      "CONS_" + Math.floor(100000 + Math.random() * 900000);

    const consultation = await Consultation.create({
      consultationId,
      userId: req.user.userId,
      expertId: expertUserId,
      consultationFee: expert.consultationCharges,
      paymentStatus: "paid",
    });

    await createNotification({
      receiverId: req.user.userId,
      receiverRole: "user",
      senderId: expertUserId,
      senderRole: "expert",
      message: "Your consultation booking has been confirmed.",
      type: NOTIFICATION_TYPES.CONSULTATION_BOOKED,
      relatedId: consultationId,
    });

    await createNotification({
      receiverId: expertUserId,
      receiverRole: "expert",
      senderId: req.user.userId,
      senderRole: "user",
      message: "A consumer has booked a consultation with you.",
      type: NOTIFICATION_TYPES.CONSULTATION_BOOKED,
      relatedId: consultationId,
    });

    await createNotification({
      receiverId: req.user.userId,
      receiverRole: "user",
      senderId: expertUserId,
      senderRole: "expert",
      message: `Consultation ${consultationId} is now active. You can start chatting with your expert.`,
      type: NOTIFICATION_TYPES.CONSULTATION_STARTED,
      relatedId: consultationId,
    });

    // Send email notification to expert
    await sendEmail(
      expert.email,
      "New Consultation on LawAssist",
      newConsultationEmail(expert.name, consultationId, req.user.userId),
      { category: "new_consultation", targetId: consultationId },
    );

    res.status(201).json(consultation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.closeConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;

    const consultation = await Consultation.findOne({ consultationId });

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    const isUser = consultation.userId === req.user.userId;
    const isExpert = consultation.expertId === req.user.userId;
    if (!isUser && !isExpert) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (consultation.status === "closed") {
      return res.status(400).json({ message: "Consultation already resolved" });
    }

    if (isUser) consultation.resolvedByUser = true;
    if (isExpert) consultation.resolvedByExpert = true;

    consultation.status = "closed";
    consultation.closedAt = new Date();
    await consultation.save();

    const senderRole = isUser ? "user" : "expert";
    const senderId = req.user.userId;
    const receiverId = isUser ? consultation.expertId : consultation.userId;
    const receiverRole = isUser ? "expert" : "user";

    await createNotification({
      receiverId,
      receiverRole,
      senderId,
      senderRole,
      message: `Consultation ${consultation.consultationId} has been ended by the ${isUser ? "consumer" : "expert"}.`,
      type: NOTIFICATION_TYPES.CONSULTATION_ENDED,
      relatedId: consultation.consultationId,
    });

    await createNotification({
      receiverId: req.user.userId,
      receiverRole: isUser ? "user" : "expert",
      senderId,
      senderRole,
      message: `Consultation ${consultation.consultationId} has been closed successfully.`,
      type: NOTIFICATION_TYPES.CONSULTATION_ENDED,
      relatedId: consultation.consultationId,
    });

    return res.json({ message: "Consultation closed", consultation });
  } catch (error) {
    return res.status(500).json({ message: "Failed to close consultation" });
  }
};

exports.getUserConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching consultations" });
  }
};

exports.getExpertConsultations = async (req, res) => {
  const consultations = await Consultation.find({
    expertId: req.user.userId,
  }).sort({ createdAt: -1 });

  res.json(consultations);
};

exports.getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findOne({
      consultationId: req.params.consultationId,
    });

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    res.json(consultation);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
