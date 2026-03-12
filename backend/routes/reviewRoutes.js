const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const User = require("../models/User");
const { verifyToken } = require("../middleware/authMiddleware");

/* ================= SUBMIT REVIEW ================= */

router.post("/add", verifyToken, async (req, res) => {
  try {
    const { expertId, queryId, rating, comment } = req.body;

    const user = await User.findOne({ userId: req.user.userId });

    const review = new Review({
      expertId,
      userId: req.user.userId,
      username: user.name,
      queryId,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({ message: "Review submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error submitting review" });
  }
});

/* ================= GET EXPERT REVIEWS ================= */

router.get("/expert/:expertId", async (req, res) => {
  try {
    const reviews = await Review.find({
      expertId: req.params.expertId,
    }).sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

module.exports = router;
