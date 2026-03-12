const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    expertId: {
      type: String,
      ref: "Expert",
      required: true,
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    queryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Query",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Review", reviewSchema);
