const express = require("express");
const Notification = require("../models/Notification");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

const buildRecipientFilter = (user) => {
  if (user.role === "legalExpert") {
    return { expertId: user.userId };
  }
  return { userId: user.userId };
};

const typeFilters = {
  all: null,
  unread: null,
  queries: ["QUERY_POSTED", "QUERY_ACCEPTED", "QUERY_REJECTED"],
  consultations: ["CONSULTATION_BOOKED"],
  system: ["SYSTEM", "ACCOUNT_STATUS", "PAYMENT_SUCCESS"],
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
      items,
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

    res.status(200).json(items);
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

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
});

module.exports = router;
