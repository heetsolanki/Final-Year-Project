const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: null,
      index: true,
    },

    expertId: {
      type: String,
      default: null,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "QUERY_POSTED",
        "QUERY_ACCEPTED",
        "QUERY_REJECTED",
        "CONSULTATION_BOOKED",
        "PAYMENT_SUCCESS",
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

notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
