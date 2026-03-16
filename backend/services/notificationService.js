const Notification = require("../models/Notification");
const { connectedUsers, connectedExperts } = require("../sockets/socketRegistry");

let ioInstance = null;

const NOTIFICATION_TYPES = {
  QUERY_POSTED: "QUERY_POSTED",
  QUERY_ACCEPTED: "QUERY_ACCEPTED",
  QUERY_REJECTED: "QUERY_REJECTED",
  CONSULTATION_BOOKED: "CONSULTATION_BOOKED",
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
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

const createNotification = async ({
  userId = null,
  expertId = null,
  title,
  message,
  type = NOTIFICATION_TYPES.SYSTEM,
  relatedId = null,
}) => {
  const notification = await Notification.create({
    userId,
    expertId,
    title,
    message,
    type,
    relatedId,
    isRead: false,
  });

  const payload = {
    _id: notification._id,
    userId: notification.userId,
    expertId: notification.expertId,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    relatedId: notification.relatedId,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
  };

  if (userId && connectedUsers.has(userId)) {
    emitToSocketIds(connectedUsers.get(userId), payload);
  }

  if (expertId && connectedExperts.has(expertId)) {
    emitToSocketIds(connectedExperts.get(expertId), payload);
  }

  return notification;
};

const notifyExpertsBulk = async ({ expertIds = [], title, message, relatedId = null }) => {
  if (!Array.isArray(expertIds) || expertIds.length === 0) return [];

  const now = new Date();
  const docs = expertIds.map((expertId) => ({
    expertId,
    title,
    message,
    type: NOTIFICATION_TYPES.QUERY_POSTED,
    relatedId,
    isRead: false,
    createdAt: now,
    updatedAt: now,
  }));

  const inserted = await Notification.insertMany(docs, { ordered: false });

  inserted.forEach((notification) => {
    if (connectedExperts.has(notification.expertId)) {
      emitToSocketIds(connectedExperts.get(notification.expertId), {
        _id: notification._id,
        userId: notification.userId,
        expertId: notification.expertId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        relatedId: notification.relatedId,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      });
    }
  });

  return inserted;
};

module.exports = {
  NOTIFICATION_TYPES,
  setNotificationSocketServer,
  createNotification,
  notifyExpertsBulk,
};
