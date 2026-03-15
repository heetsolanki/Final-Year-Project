const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");
const Query = require("../models/Query");
const User = require("../models/User");
const Notification = require("../models/Notification");
const bcrypt = require("bcryptjs");

/* ================= GET PROFILE ================= */
router.get(
  "/profile",
  verifyToken,
  authorizeRole("consumer"),
  async (req, res) => {
    try {
      const user = await User.findOne({ userId: req.user.userId }).select(
        "-password",
      );

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
);

/* ================= UPDATE PROFILE ================= */
router.put(
  "/profile",
  verifyToken,
  authorizeRole("consumer"),
  async (req, res) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { userId: req.user.userId },
        req.body,
        { new: true },
      ).select("-password");

      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
);

/* ================= CHANGE PASSWORD ================= */
router.put(
  "/change-password",
  verifyToken,
  authorizeRole("consumer"),
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findOne({ userId: req.user.userId });

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Current password incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
);

/* ================= DELETE ACCOUNT ================= */
router.delete(
  "/delete-account",
  verifyToken,
  authorizeRole("consumer"),
  async (req, res) => {
    try {
      // Delete user's queries first
      await Query.deleteMany({ userId: req.user.userId });

      // Then delete user
      await User.findOneAndDelete({ userId: req.user.userId });

      res.status(200).json({ message: "Account and queries deleted" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
);

router.patch(
  "/resolve/:id",
  verifyToken,
  authorizeRole("consumer"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const query = await Query.findById(id);

      if (!query) {
        return res.status(404).json({ message: "Query not found" });
      }

      query.status = "Resolved";

      await query.save();

      res.json({ message: "Query resolved successfully", query });
    } catch (error) {
      res.status(500).json({ message: "Error resolving query" });
    }
  },
);

/* ================= GET USER NOTIFICATIONS ================= */
router.get(
  "/notifications",
  verifyToken,
  authorizeRole("consumer"),
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

module.exports = router;
