const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");
const verifyExpertStatus = require("../middleware/verifyExpertStatus");
const Notification = require("../models/Notification");
const Expert = require("../models/Expert");
const Query = require("../models/Query");
const ExpertNotifyRequest = require("../models/ExpertNotifyRequest");

const {
  getExpertStats,
  getAllQueries,
  answerQuery,
  acceptCase,
  completeExpertProfile,
  getExpertProfile,
  updateExpertProfile,
  getAllExperts,
  getExpertById,
  toggleExpertStatus,
  updateAvailability,
  resolveCase,
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
router.patch(
  "/resolve/:id",
  verifyToken,
  authorizeRole("legalExpert"),
  verifyExpertStatus,
  resolveCase,
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
router.put(
  "/profile",
  verifyToken,
  authorizeRole("legalExpert"),
  updateExpertProfile,
);
router.patch(
  "/toggle-status",
  verifyToken,
  authorizeRole("legalExpert"),
  toggleExpertStatus,
);
router.patch(
  "/availability",
  verifyToken,
  authorizeRole("legalExpert"),
  updateAvailability,
);

router.post(
  "/:expertUserId/notify-me",
  verifyToken,
  authorizeRole("consumer"),
  async (req, res) => {
    try {
      if (req.params.expertUserId === req.user.userId) {
        return res.status(400).json({ message: "You cannot subscribe to yourself" });
      }

      await ExpertNotifyRequest.findOneAndUpdate(
        {
          userId: req.user.userId,
          expertId: req.params.expertUserId,
        },
        {
          $set: {
            userId: req.user.userId,
            expertId: req.params.expertUserId,
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      );

      return res.status(200).json({ message: "Notify Me enabled successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to enable Notify Me" });
    }
  },
);
router.get("/all", getAllExperts);

/* ================= GET EXPERT NOTIFICATIONS ================= */
router.get(
  "/notifications",
  verifyToken,
  authorizeRole("legalExpert"),
  async (req, res) => {
    try {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
      const skip = (page - 1) * limit;

      const notifications = await Notification.find({
        $or: [
          { receiverId: req.user.userId, receiverRole: "expert" },
          { expertId: req.user.userId },
        ],
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

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
