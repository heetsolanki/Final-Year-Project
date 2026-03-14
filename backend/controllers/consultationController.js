const Consultation = require("../models/Consultation");
const Expert = require("../models/Expert");

exports.createConsultation = async (req, res) => {
  try {
    const { expertUserId } = req.body;

    const expert = await Expert.findOne({ userId: expertUserId });

    if (
      !expert ||
      !expert.isActive ||
      expert.verificationStatus !== "verified"
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
