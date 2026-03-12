const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    expertId: {
      type: String,
      default: null,
    },

    title: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    subcategory: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      default: "",
    },

    answeredBy: {
      name: String,
      specialization: String,
    },

    status: {
      type: String,
      enum: ["In Review", "Assigned", "Resolved", "Answered"],
      default: "In Review",
    },
    assignedAt: {
      type: Date,
    },

    answeredAt: {
      type: Date,
    },

    resolvedAt: {
      type: Date,
    },

    ratingGiven: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Query", querySchema);
