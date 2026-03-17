const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    consultationId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    userId: {
      type: String,
      required: true,
    },

    expertId: {
      type: String,
      required: true,
    },

    consultationFee: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    closedAt: {
      type: Date,
    },

    resolvedByUser: {
      type: Boolean,
      default: false,
    },

    resolvedByExpert: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Consultation", consultationSchema);
