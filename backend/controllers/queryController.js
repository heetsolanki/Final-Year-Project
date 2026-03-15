const mongoose = require("mongoose");
const Query = require("../models/Query");
const sendEmail = require("../utils/sendEmail");
const querySubmittedEmail = require("../template/querySubmittedEmail");
const User = require("../models/User");

exports.createQuery = async (req, res) => {
  try {
    const { title, category, subcategory, description } = req.body;

    const newQuery = await Query.create({
      userId: req.user.userId,
      title,
      category,
      subcategory,
      description,
    });

    // Send confirmation email to the consumer (query starts as "Pending" — admin must approve)
    const user = await User.findOne({ userId: req.user.userId });
    if (user) {
      sendEmail(
        user.email,
        "Query Submitted Successfully - LawAssist",
        querySubmittedEmail(
          user.name,
          newQuery.title,
          newQuery.category,
          newQuery.subcategory,
        ),
      ).catch((err) => console.error("Email sending error:", err));
    }

    res.status(201).json(newQuery);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
/* ================= GET ALL PUBLIC QUERIES ================= */
exports.getPublicQueries = async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.status(200).json(queries);
  } catch (error) {
    console.error("Fetch Queries Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET SINGLE QUERY ================= */
exports.getSingleQuery = async (req, res) => {
  try {
    const { id } = req.params;

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
};

/* ================= DELETE QUERY ================= */
exports.deleteQuery = async (req, res) => {
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
};
