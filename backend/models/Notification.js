const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    receiverId: {
      type: String,
      required: true,
      index: true,
    },

    receiverRole: {
      type: String,
      enum: ["user", "expert", "admin"],
      required: true,
      index: true,
    },

    senderId: {
      type: String,
      default: null,
    },

    senderRole: {
      type: String,
      enum: ["user", "expert", "admin"],
      default: null,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "QUERY_POSTED",
        "QUERY_SUBMITTED",
        "QUERY_ACCEPTED",
        "QUERY_APPROVED",
        "QUERY_REJECTED",
        "QUERY_ANSWERED",
        "QUERY_RESOLVED",
        "QUERY_RESOLVED_BY_USER",
        "QUERY_RESOLVED_BY_EXPERT",
        "CONSULTATION_BOOKED",
        "CONSULTATION_STARTED",
        "CONSULTATION_ENDED",
        "NEW_MESSAGE",
        "PAYMENT_SUCCESS",
        "PAYMENT_FAILED",
        "PAYMENT_RECEIVED",
        "REVIEW_SUBMITTED",
        "NEW_REVIEW",
        "EXPERT_AVAILABLE",
        "NEW_REGISTRATION",
        "REPORT_SUBMITTED",
        "ACCOUNT_STATUS",
        "SYSTEM",
      ],
      default: "SYSTEM",
    },

    relatedId: {
      type: String,
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ receiverId: 1, receiverRole: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
