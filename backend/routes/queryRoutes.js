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

router.get("/public", async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    // Ensure user can only delete their own query
    if (query.userId !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await query.deleteOne();

    res.status(200).json({ message: "Query deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;