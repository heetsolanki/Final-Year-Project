const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const protect = require("../middleware/authMiddleware");
const Query = require("../models/Query");

/* ================= CREATE QUERY ================= */
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
    console.error("Create Query Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET ALL PUBLIC QUERIES ================= */
router.get("/public", async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.status(200).json(queries);
  } catch (error) {
    console.error("Fetch Queries Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET SINGLE QUERY ================= */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 🔥 Prevent ObjectId crash
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Query ID" });
    }

    const query = await Query.findById(id);

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    res.status(200).json(query);
  } catch (error) {
    console.error("Get Query Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= DELETE QUERY ================= */
router.delete("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Query ID" });
    }

    const query = await Query.findById(id);

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    if (query.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await query.deleteOne();

    res.status(200).json({ message: "Query deleted successfully" });
  } catch (error) {
    console.error("Delete Query Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;