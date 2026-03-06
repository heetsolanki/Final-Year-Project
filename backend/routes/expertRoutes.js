const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getExpertStats,
  getAllQueries,
  answerQuery,
  resolveQuery,
  acceptCase,
  completeExpertProfile,
  getExpertProfile
} = require("../controllers/expertController");

router.get("/stats", authMiddleware, getExpertStats);
router.get("/queries", authMiddleware, getAllQueries);
router.patch("/accept/:id", authMiddleware, acceptCase);
router.post("/answer/:id", authMiddleware, answerQuery);
router.patch("/resolve/:id", authMiddleware, resolveQuery);
router.post("/complete-profile", authMiddleware, completeExpertProfile);
router.get("/profile", authMiddleware, getExpertProfile);

module.exports = router;