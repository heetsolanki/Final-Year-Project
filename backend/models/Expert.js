const mongoose = require("mongoose");

const expertSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    specialization: String,
    experience: Number,

    barCouncilId: String,
    consultationCharges: Number,
    languages: [String],
    expertiseAreas: [String],
    bio: String,

    phone: String,
    gender: String,
    dob: Date,
    address: String,
    city: String,
    state: String,
    pincode: String,

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    verificationStatus: {
      type: String,
      enum: ["incomplete", "pending", "verified"],
      default: "incomplete",
    },

    profileCompletion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Expert", expertSchema);
