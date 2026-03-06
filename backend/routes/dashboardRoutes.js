const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Query = require("../models/Query");

router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user.userId;

    const queries = await Query.find({ userId });

    const total = queries.length;
    const pending = queries.filter((q) => q.status === "Pending").length;
    const resolved = queries.filter((q) => q.status === "Resolved").length;

    res.json({
      name: req.user.name,
      email: req.user.email,
      totalQueries: total,
      pendingQueries: pending,
      resolvedQueries: resolved,
      recentQueries: queries.slice(-5),
      queries: queries
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
