const mongoose = require("mongoose");
const Query = require("../models/Query");
const sendEmail = require("../utils/sendEmail");
const querySubmittedEmail = require("../template/querySubmittedEmail");
const User = require("../models/User");
const Expert = require("../models/Expert");
const {
  createNotification,
  notifyExpertsBulk,
  NOTIFICATION_TYPES,
} = require("../services/notificationService");

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

    const experts = await Expert.find(
      { verificationStatus: "active", isActive: true },
      { userId: 1 },
    ).lean();

    await notifyExpertsBulk({
      expertIds: experts.map((expert) => expert.userId),
      title: "New Consumer Query Posted",
      message: "A new consumer query has been posted on the platform.",
      relatedId: newQuery._id.toString(),
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
        { category: "new_query", targetId: newQuery._id.toString() },
      ).catch((err) => console.error("Email sending error:", err));
    }

    res.status(201).json(newQuery);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RE-APPEAL REJECTED QUERY ================= */
exports.reAppealQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Query ID" });
    }

    const query = await Query.findById(id);

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    // Verify ownership
    if (query.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Only allow re-appeal for rejected queries
    if (query.status !== "Rejected") {
      return res.status(400).json({ message: "Only rejected queries can be re-appealed" });
    }

    // Update query with new data and reset status to Pending
    query.title = title || query.title;
    query.description = description || query.description;
    query.status = "Pending";
    query.rejectionReason = null;
    query.rejectionCount = (query.rejectionCount || 0); // Keep rejection count for tracking
    await query.save();

    await createNotification({
      userId: req.user.userId,
      title: "Query Re-Submitted",
      message: "Your query has been re-submitted and is waiting for review.",
      type: NOTIFICATION_TYPES.SYSTEM,
      relatedId: query._id.toString(),
    });

    // Send confirmation email
    const user = await User.findOne({ userId: req.user.userId });
    if (user) {
      sendEmail(
        user.email,
        "Query Re-Submitted for Review - LawAssist",
        querySubmittedEmail(
          user.name,
          query.title,
          query.category,
          query.subcategory,
        ),
        { category: "query_reappeal", targetId: query._id.toString() },
      ).catch((err) => console.error("Email sending error:", err));
    }

    res.status(200).json({ message: "Query re-submitted for review", query });
  } catch (error) {
    console.error("Re-Appeal Query Error:", error);
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
