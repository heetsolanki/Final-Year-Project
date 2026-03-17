const express = require("express");
const Notification = require("../models/Notification");
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");
const { createNotification } = require("../services/notificationService");

const router = express.Router();

const toClientNotification = (item) => ({
  ...item,
  title: item.title || String(item.type || "SYSTEM").replace(/_/g, " "),
});

const buildRecipientFilter = (user) => {
  if (user.role === "admin") {
    return { receiverId: user.userId, receiverRole: "admin" };
  }

  if (user.role === "legalExpert") {
    return {
      $or: [
        { receiverId: user.userId, receiverRole: "expert" },
        { expertId: user.userId },
      ],
    };
  }

  return {
    $or: [
      { receiverId: user.userId, receiverRole: "user" },
      { userId: user.userId },
    ],
  };
};

const typeFilters = {
  all: null,
  unread: null,
  queries: [
    "QUERY_POSTED",
    "QUERY_SUBMITTED",
    "QUERY_ACCEPTED",
    "QUERY_APPROVED",
    "QUERY_REJECTED",
    "QUERY_ANSWERED",
    "QUERY_RESOLVED",
  ],
  consultations: ["CONSULTATION_BOOKED", "CONSULTATION_STARTED", "CONSULTATION_ENDED"],
  system: ["SYSTEM", "ACCOUNT_STATUS", "PAYMENT_SUCCESS", "PAYMENT_FAILED"],
};

router.get("/", verifyToken, async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;
    const filter = String(req.query.filter || "all").toLowerCase();

    const baseQuery = buildRecipientFilter(req.user);
    const query = { ...baseQuery };

    if (filter === "unread") {
      query.isRead = false;
    }

    if (typeFilters[filter]) {
      query.type = { $in: typeFilters[filter] };
    }

    const [items, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query),
    ]);

    res.status(200).json({
      items: items.map(toClientNotification),
      page,
      limit,
      total,
      hasMore: skip + items.length < total,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

router.get("/latest", verifyToken, async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 10);
    const query = buildRecipientFilter(req.user);

    const items = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json(items.map(toClientNotification));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch latest notifications" });
  }
});

router.get("/unread-count", verifyToken, async (req, res) => {
  try {
    const query = {
      ...buildRecipientFilter(req.user),
      isRead: false,
    };

    const unreadCount = await Notification.countDocuments(query);
    res.status(200).json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
});

router.patch("/read-all", verifyToken, async (req, res) => {
  try {
    const query = {
      ...buildRecipientFilter(req.user),
      isRead: false,
    };

    const result = await Notification.updateMany(query, {
      $set: { isRead: true },
    });

    res.status(200).json({
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
});

router.patch("/mark-all-read", verifyToken, async (req, res) => {
  try {
    const query = {
      ...buildRecipientFilter(req.user),
      isRead: false,
    };

    const result = await Notification.updateMany(query, {
      $set: { isRead: true },
    });

    res.status(200).json({
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
});

router.patch("/:id/read", verifyToken, async (req, res) => {
  try {
    const query = {
      _id: req.params.id,
      ...buildRecipientFilter(req.user),
    };

    const notification = await Notification.findOneAndUpdate(
      query,
      { $set: { isRead: true } },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(toClientNotification(notification.toObject()));
  } catch (error) {
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const query = {
      _id: req.params.id,
      ...buildRecipientFilter(req.user),
    };

    const deleted = await Notification.findOneAndDelete(query);
    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete notification" });
  }
});

router.post(
  "/create",
  verifyToken,
  authorizeRole("admin"),
  async (req, res) => {
    try {
      const notification = await createNotification(req.body);
      res.status(201).json(notification);
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to create notification" });
    }
  },
);

module.exports = router;
