const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");
const Query = require("../models/Query");

router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const stats = await Query.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    let total = 0;
    let pending = 0;
    let resolved = 0;

    stats.forEach((item) => {
      total += item.count;

      if (item._id === "Pending") pending = item.count;
      if (item._id === "Resolved") resolved = item.count;
    });

    const recentQueries = await Query.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const queries = await Query.find({ userId });

    res.json({
      name: req.user.name,
      email: req.user.email,
      totalQueries: total,
      pendingQueries: pending,
      resolvedQueries: resolved,
      recentQueries,
      queries
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
