const Notification = require("../models/Notification");
const User = require("../models/User");
const Expert = require("../models/Expert");
const { connectedUsers, connectedExperts } = require("../sockets/socketRegistry");

let ioInstance = null;

const NOTIFICATION_TYPES = {
  QUERY_POSTED: "QUERY_POSTED",
  QUERY_SUBMITTED: "QUERY_SUBMITTED",
  QUERY_ACCEPTED: "QUERY_ACCEPTED",
  QUERY_APPROVED: "QUERY_APPROVED",
  QUERY_REJECTED: "QUERY_REJECTED",
  QUERY_ANSWERED: "QUERY_ANSWERED",
  QUERY_RESOLVED: "QUERY_RESOLVED",
  QUERY_RESOLVED_BY_USER: "QUERY_RESOLVED_BY_USER",
  QUERY_RESOLVED_BY_EXPERT: "QUERY_RESOLVED_BY_EXPERT",
  CONSULTATION_BOOKED: "CONSULTATION_BOOKED",
  CONSULTATION_STARTED: "CONSULTATION_STARTED",
  CONSULTATION_ENDED: "CONSULTATION_ENDED",
  NEW_MESSAGE: "NEW_MESSAGE",
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  PAYMENT_RECEIVED: "PAYMENT_RECEIVED",
  REVIEW_SUBMITTED: "REVIEW_SUBMITTED",
  NEW_REVIEW: "NEW_REVIEW",
  EXPERT_AVAILABLE: "EXPERT_AVAILABLE",
  NEW_REGISTRATION: "NEW_REGISTRATION",
  REPORT_SUBMITTED: "REPORT_SUBMITTED",
  ACCOUNT_STATUS: "ACCOUNT_STATUS",
  SYSTEM: "SYSTEM",
};

const setNotificationSocketServer = (io) => {
  ioInstance = io;
};

const emitToSocketIds = (socketIds, payload) => {
  if (!ioInstance || !socketIds || socketIds.size === 0) return;
  socketIds.forEach((socketId) => {
    ioInstance.to(socketId).emit("notification:new", payload);
  });
};

const normalizeLegacyRecipient = ({ receiverId, receiverRole, userId, expertId }) => {
  if (receiverId && receiverRole) return { receiverId, receiverRole };
  if (expertId) return { receiverId: expertId, receiverRole: "expert" };
  if (userId) return { receiverId: userId, receiverRole: "user" };
  return { receiverId: null, receiverRole: null };
};

const normalizeLegacySender = ({ senderId, senderRole }) => {
  if (senderId && senderRole) return { senderId, senderRole };
  return { senderId: senderId || null, senderRole: senderRole || null };
};

const emitNotificationToRecipient = (notification) => {
  const payload = {
    _id: notification._id,
    receiverId: notification.receiverId,
    receiverRole: notification.receiverRole,
    senderId: notification.senderId,
    senderRole: notification.senderRole,
    type: notification.type,
    title: notification.type,
    message: notification.message,
    relatedId: notification.relatedId,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
  };

  if (["user", "admin"].includes(notification.receiverRole)) {
    emitToSocketIds(connectedUsers.get(notification.receiverId), payload);
  }

  if (notification.receiverRole === "expert") {
    emitToSocketIds(connectedExperts.get(notification.receiverId), payload);
  }
};

const createNotification = async ({
  receiverId = null,
  receiverRole = null,
  userId = null,
  expertId = null,
  senderId = null,
  senderRole = null,
  message,
  type = NOTIFICATION_TYPES.SYSTEM,
  relatedId = null,
}) => {
  const normalizedRecipient = normalizeLegacyRecipient({
    receiverId,
    receiverRole,
    userId,
    expertId,
  });
  const normalizedSender = normalizeLegacySender({ senderId, senderRole });

  if (!normalizedRecipient.receiverId || !normalizedRecipient.receiverRole) {
    throw new Error("Receiver details are required to create notification");
  }

  const notification = await Notification.create({
    receiverId: normalizedRecipient.receiverId,
    receiverRole: normalizedRecipient.receiverRole,
    senderId: normalizedSender.senderId,
    senderRole: normalizedSender.senderRole,
    message,
    type,
    relatedId,
    isRead: false,
  });

  emitNotificationToRecipient(notification);
  return notification;
};

const createBulkNotifications = async (items = []) => {
  if (!Array.isArray(items) || items.length === 0) return [];

  const now = new Date();
  const docs = items
    .map((item) => {
      const normalizedRecipient = normalizeLegacyRecipient(item || {});
      if (!normalizedRecipient.receiverId || !normalizedRecipient.receiverRole) {
        return null;
      }

      const normalizedSender = normalizeLegacySender(item || {});
      return {
        receiverId: normalizedRecipient.receiverId,
        receiverRole: normalizedRecipient.receiverRole,
        senderId: normalizedSender.senderId,
        senderRole: normalizedSender.senderRole,
        type: item.type || NOTIFICATION_TYPES.SYSTEM,
        message: item.message,
        relatedId: item.relatedId || null,
        isRead: false,
        createdAt: now,
        updatedAt: now,
      };
    })
    .filter(Boolean);

  if (docs.length === 0) return [];

  const inserted = await Notification.insertMany(docs, { ordered: false });
  inserted.forEach((notification) => emitNotificationToRecipient(notification));
  return inserted;
};

const getAllAdminRecipients = async () => {
  const [userAdmins, expertAdmins] = await Promise.all([
    User.find({ role: "admin" }, { userId: 1 }).lean(),
    Expert.find({ role: "admin" }, { userId: 1 }).lean(),
  ]);

  const unique = new Set([
    ...userAdmins.map((u) => u.userId),
    ...expertAdmins.map((e) => e.userId),
  ]);

  return Array.from(unique);
};

const notifyAdmins = async ({
  message,
  type = NOTIFICATION_TYPES.SYSTEM,
  relatedId = null,
  senderId = null,
  senderRole = null,
}) => {
  const adminIds = await getAllAdminRecipients();
  if (adminIds.length === 0) return [];

  return createBulkNotifications(
    adminIds.map((adminId) => ({
      receiverId: adminId,
      receiverRole: "admin",
      senderId,
      senderRole,
      message,
      type,
      relatedId,
    })),
  );
};

const notifyExpertsBulk = async ({
  expertIds = [],
  title,
  message,
  relatedId = null,
  senderId = null,
  senderRole = null,
}) => {
  if (!Array.isArray(expertIds) || expertIds.length === 0) return [];

  return createBulkNotifications(
    expertIds.map((expertId) => ({
      receiverId: expertId,
      receiverRole: "expert",
      senderId,
      senderRole,
      message: message || title,
      type: NOTIFICATION_TYPES.QUERY_POSTED,
      relatedId,
    })),
  );
};

const notifyUsersBulk = async ({
  userIds = [],
  message,
  type = NOTIFICATION_TYPES.SYSTEM,
  relatedId = null,
  senderId = null,
  senderRole = null,
}) => {
  if (!Array.isArray(userIds) || userIds.length === 0) return [];

  return createBulkNotifications(
    userIds.map((userId) => ({
      receiverId: userId,
      receiverRole: "user",
      senderId,
      senderRole,
      message,
      type,
      relatedId,
    })),
  );
};

module.exports = {
  NOTIFICATION_TYPES,
  setNotificationSocketServer,
  createNotification,
  createBulkNotifications,
  notifyAdmins,
  notifyExpertsBulk,
  notifyUsersBulk,
  getAllAdminRecipients,
};
