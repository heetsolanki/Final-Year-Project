const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Message = require("../models/Message");

router.get("/:consultationId", verifyToken, async (req, res) => {
  try {
    const { consultationId } = req.params;

    const messages = await Message.find({ consultationId }).sort({
      createdAt: 1,
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

module.exports = router;
