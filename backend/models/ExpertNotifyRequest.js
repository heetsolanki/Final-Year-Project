const mongoose = require("mongoose");

const expertNotifyRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    expertId: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

expertNotifyRequestSchema.index({ userId: 1, expertId: 1 }, { unique: true });

module.exports = mongoose.model("ExpertNotifyRequest", expertNotifyRequestSchema);
