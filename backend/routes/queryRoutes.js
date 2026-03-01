const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const Query = require("../models/Query");

router.post("/", protect, async (req, res) => {
  try {
    const { title, category, description } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newQuery = await Query.create({
      userId: req.user.userId,
      title,
      category,
      description,
    });

    res.status(201).json(newQuery);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET ALL PUBLIC QUERIES =================
router.get("/public", async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;