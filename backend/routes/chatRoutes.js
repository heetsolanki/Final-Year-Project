const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Message = require("../models/Message");
const Consultation = require("../models/Consultation");

router.get("/:consultationId", verifyToken, async (req, res) => {
  try {
    const { consultationId } = req.params;

    const consultation = await Consultation.findOne({ consultationId });
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    if (
      consultation.userId !== req.user.userId &&
      consultation.expertId !== req.user.userId
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const threadConsultationId =
      consultation.isFollowUp && consultation.parentConsultationId
        ? consultation.parentConsultationId
        : consultation.consultationId;

    const messages = await Message.find({ consultationId: threadConsultationId }).sort({
      createdAt: 1,
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

module.exports = router;
