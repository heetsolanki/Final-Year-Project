const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    
    status: {
      type: String,
      enum: ["In Review", "Assigned", "Resolved"],
      default: "In Review",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Query", querySchema);