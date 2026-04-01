const Consultation = require("../models/Consultation");
const Expert = require("../models/Expert");
const User = require("../models/User");
const Payment = require("../models/Payment");
const sendEmail = require("../utils/sendEmail");
const newConsultationEmail = require("../template/newConsultationEmail");
const { createNotification, NOTIFICATION_TYPES } = require("../services/notificationService");
const { generateConsultationTitle } = require("../services/geminiService");
const {
  formatAvailabilityWindow,
  isWithinAvailability,
} = require("../utils/availability");

const generateConsultationId = () =>
  "CONS_" + Math.floor(100000 + Math.random() * 900000);

const getFallbackTitle = (specialization) => {
  const prefix = specialization ? `${specialization} Case` : "Legal Consultation";
  return String(prefix).slice(0, 120);
};

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

    const consultationId = generateConsultationId();
    let chatTitle = getFallbackTitle(expert.specialization);

    try {
      const aiTitle = await generateConsultationTitle({
        specialization: expert.specialization,
        city: expert.city,
        state: expert.state,
      });

      if (aiTitle) chatTitle = aiTitle;
    } catch (error) {
      // Keep fallback title if AI generation fails
    }

    const consultation = await Consultation.create({
      consultationId,
      userId: req.user.userId,
      consumerId: req.user.userId,
      expertId: expertUserId,
      consultationFee: expert.consultationFee ?? expert.consultationCharges,
      chatTitle,
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
    consultation.isActive = false;
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
      isFollowUp: { $ne: true },
    }).sort({ createdAt: -1 });

    const expertIds = [...new Set(consultations.map((item) => item.expertId))];
    const experts = await Expert.find(
      { userId: { $in: expertIds } },
      { userId: 1, name: 1, consultationFee: 1, followUpFee: 1, consultationCharges: 1 },
    ).lean();

    const feeMap = experts.reduce((acc, item) => {
      acc[item.userId] = {
        name: item.name,
        consultationFee: item.consultationFee ?? item.consultationCharges ?? 0,
        followUpFee: item.followUpFee,
      };
      return acc;
    }, {});

    const pendingPayments = await Payment.find(
      {
        userId: req.user.userId,
        consultationId: { $in: consultations.map((item) => item.consultationId) },
        paymentStatus: "Pending",
        paymentPurpose: "followup",
      },
      { consultationId: 1 },
    ).lean();

    const pendingByConsultation = new Set(
      pendingPayments.map((item) => item.consultationId),
    );

    res.json(
      consultations.map((item) => {
        const fees = feeMap[item.expertId] || {};
        return {
          ...item.toObject(),
          consumerId: item.consumerId || item.userId,
          expertName: fees.name || "",
          availableConsultationFee: fees.consultationFee,
          availableFollowUpFee: fees.followUpFee,
          hasPendingFollowUpPayment: pendingByConsultation.has(item.consultationId),
        };
      }),
    );
  } catch (error) {
    res.status(500).json({ message: "Error fetching consultations" });
  }
};

exports.getExpertConsultations = async (req, res) => {
  const consultations = await Consultation.find({
    expertId: req.user.userId,
    isFollowUp: { $ne: true },
  }).sort({ createdAt: -1 });

  const consumerIds = [...new Set(consultations.map((item) => item.consumerId || item.userId))];
  const consumers = await User.find(
    { userId: { $in: consumerIds } },
    { userId: 1, name: 1 },
  ).lean();

  const consumerMap = consumers.reduce((acc, item) => {
    acc[item.userId] = item.name;
    return acc;
  }, {});

  res.json(
    consultations.map((item) => ({
      ...item.toObject(),
      consumerId: item.consumerId || item.userId,
      consumerName: consumerMap[item.consumerId || item.userId] || "",
    })),
  );
};

exports.getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findOne({
      consultationId: req.params.consultationId,
    });

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    const consumerId = consultation.consumerId || consultation.userId;
    const [expert, consumer] = await Promise.all([
      Expert.findOne({ userId: consultation.expertId }, { name: 1, userId: 1 }).lean(),
      User.findOne({ userId: consumerId }, { name: 1, userId: 1 }).lean(),
    ]);

    res.json({
      ...consultation.toObject(),
      consumerId,
      expertName: expert?.name || "",
      consumerName: consumer?.name || "",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.initiateFollowUp = async (req, res) => {
  try {
    const { consultationId } = req.body;

    const original = await Consultation.findOne({ consultationId });

    if (!original) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    if (original.userId !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (original.isFollowUp) {
      return res.status(400).json({ message: "Use the original consultation to initiate a follow-up" });
    }

    if (original.status !== "closed" || original.isActive) {
      return res.status(400).json({ message: "Follow-up is available only after consultation ends" });
    }

    const expert = await Expert.findOne({ userId: original.expertId });
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    const currentConsultationFee = expert.consultationFee ?? expert.consultationCharges;
    const currentFollowUpFee = expert.followUpFee;

    if (currentFollowUpFee === null || currentFollowUpFee === undefined) {
      return res.status(400).json({ message: "Follow-up fee is not set by the expert yet" });
    }

    if (currentFollowUpFee > currentConsultationFee) {
      return res.status(400).json({ message: "Follow-up fee cannot exceed consultation fee" });
    }

    const existingPending = await Payment.findOne({
      userId: req.user.userId,
      consultationId: original.consultationId,
      paymentPurpose: "followup",
      paymentStatus: "Pending",
    });

    if (existingPending) {
      return res.status(400).json({
        message: "You already have an unpaid follow-up payment for this consultation",
        followUpConsultationId: original.consultationId,
      });
    }

    return res.status(201).json({
      message: "Proceed to follow-up payment to reactivate this consultation chat.",
      followUpConsultationId: original.consultationId,
      followUpFee: currentFollowUpFee,
      parentConsultationId: original.consultationId,
      expertId: original.expertId,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to initiate follow-up consultation" });
  }
};

exports.updateConsultationTitle = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { chatTitle } = req.body;

    if (!chatTitle || !String(chatTitle).trim()) {
      return res.status(400).json({ message: "Chat title is required" });
    }

    const trimmedTitle = String(chatTitle).trim().slice(0, 120);

    const consultation = await Consultation.findOne({ consultationId });
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    if (consultation.userId !== req.user.userId) {
      return res.status(403).json({ message: "Only the consultation owner can rename this chat" });
    }

    const rootConsultationId = consultation.isFollowUp && consultation.parentConsultationId
      ? consultation.parentConsultationId
      : consultation.consultationId;

    await Consultation.updateMany(
      {
        $or: [
          { consultationId: rootConsultationId },
          { parentConsultationId: rootConsultationId },
        ],
      },
      { $set: { chatTitle: trimmedTitle } },
    );

    return res.json({
      message: "Chat title updated successfully",
      consultationId,
      chatTitle: trimmedTitle,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update chat title" });
  }
};
