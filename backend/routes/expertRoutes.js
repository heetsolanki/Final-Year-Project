const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");
const verifyExpertStatus = require("../middleware/verifyExpertStatus");
const Notification = require("../models/Notification");
const Expert = require("../models/Expert");
const Query = require("../models/Query");

const {
  getExpertStats,
  getAllQueries,
  answerQuery,
  acceptCase,
  completeExpertProfile,
  getExpertProfile,
  getAllExperts,
  getExpertById,
  toggleExpertStatus,
} = require("../controllers/expertController");

router.get("/stats", verifyToken, authorizeRole("legalExpert"), getExpertStats);
router.get(
  "/queries",
  verifyToken,
  authorizeRole("legalExpert"),
  getAllQueries,
);
router.patch(
  "/accept/:id",
  verifyToken,
  authorizeRole("legalExpert"),
  verifyExpertStatus,
  acceptCase,
);
router.post(
  "/answer/:id",
  verifyToken,
  authorizeRole("legalExpert"),
  verifyExpertStatus,
  answerQuery,
);
router.post(
  "/complete-profile",
  verifyToken,
  authorizeRole("legalExpert"),
  completeExpertProfile,
);
router.get(
  "/profile",
  verifyToken,
  authorizeRole("legalExpert"),
  getExpertProfile,
);
router.patch(
  "/toggle-status",
  verifyToken,
  authorizeRole("legalExpert"),
  toggleExpertStatus,
);
router.get("/all", getAllExperts);

/* ================= GET EXPERT NOTIFICATIONS ================= */
router.get(
  "/notifications",
  verifyToken,
  authorizeRole("legalExpert"),
  async (req, res) => {
    try {
      const notifications = await Notification.find({
        targetUserId: req.user.userId,
      }).sort({ createdAt: -1 });

      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
);

/* ================= DELETE EXPERT ACCOUNT ================= */
router.delete(
  "/delete-account",
  verifyToken,
  authorizeRole("legalExpert"),
  async (req, res) => {
    try {
      await Query.deleteMany({ expertId: req.user.userId });
      await Expert.findOneAndDelete({ userId: req.user.userId });
      res.status(200).json({ message: "Expert account deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
);

router.get("/:id", getExpertById);

module.exports = router;
