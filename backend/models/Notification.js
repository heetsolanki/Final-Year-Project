const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["expert_request", "query_flag", "system", "expert_approved", "expert_rejected", "query_approved", "query_rejected", "query_warning", "account_deleted", "account_blocked"],
    },

    targetUserId: {
      type: String,
      default: null,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
