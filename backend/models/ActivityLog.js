const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },

    performedBy: {
      type: String,
      required: true,
    },

    targetId: String,

    details: Object,
  },
  { timestamps: true },
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
