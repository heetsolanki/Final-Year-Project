const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
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

    consultationId: {
      type: String,
      default: null,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["UPI", "CARD"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },

    upiId: {
      type: String,
      default: null,
    },

    cardLast4Digits: {
      type: String,
      default: null,
    },

    transactionId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", paymentSchema);
