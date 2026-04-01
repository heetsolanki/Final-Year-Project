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

    consumerId: {
      type: String,
      required: false,
    },

    expertId: {
      type: String,
      required: true,
    },

    consultationFee: {
      type: Number,
      required: true,
    },

    chatTitle: {
      type: String,
      default: null,
      trim: true,
      maxlength: 120,
    },

    followUpFee: {
      type: Number,
      default: null,
      validate: {
        validator(value) {
          if (value === null || value === undefined) return true;
          return value <= this.consultationFee;
        },
        message: "Follow-up fee cannot exceed consultation fee",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isFollowUp: {
      type: Boolean,
      default: false,
    },

    parentConsultationId: {
      type: String,
      default: null,
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
