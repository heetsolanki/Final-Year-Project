const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
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

    savedLaws: [
      {
        lawId: {
          type: String,
          required: true,
        },
        sectionAlias: {
          type: String,
          required: true,
        },
      },
    ],

    role: {
      type: String,
      enum: ["consumer", "legalExpert", "admin"],
      default: "consumer",
    },

    isMasterAdmin: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    resetOTP: {
      type: String,
    },

    otpExpire: {
      type: Date,
    },

    resetToken: {
      type: String,
    },

    resetTokenExpire: {
      type: Date,
    },

    queryRejectCount: {
      type: Number,
      default: 0,
    },

    phone: String,
    gender: String,
    dob: Date,
    address: String,
    city: String,
    state: String,
    pincode: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
