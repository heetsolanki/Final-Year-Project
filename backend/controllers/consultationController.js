const Consultation = require("../models/Consultation");
const Expert = require("../models/Expert");
const sendEmail = require("../utils/sendEmail");
const newConsultationEmail = require("../template/newConsultationEmail");
const { createNotification, NOTIFICATION_TYPES } = require("../services/notificationService");

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
      userId: req.user.userId,
      title: "Consultation Booked",
      message: "Your consultation booking has been confirmed.",
      type: NOTIFICATION_TYPES.CONSULTATION_BOOKED,
      relatedId: consultationId,
    });

    await createNotification({
      expertId: expertUserId,
      title: "Consultation Booked",
      message: "A consumer has booked a consultation with you.",
      type: NOTIFICATION_TYPES.CONSULTATION_BOOKED,
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
  const { consultationId } = req.params;

  const consultation = await Consultation.findOne({ consultationId });

  if (!consultation) {
    return res.status(404).json({ message: "Consultation not found" });
  }

  if (consultation.userId !== req.user.userId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  consultation.status = "closed";
  consultation.closedAt = new Date();

  await consultation.save();

  res.json({ message: "Consultation closed" });
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
