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

    role: {
      type: String,
      enum: ["consumer", "legalExpert"],
      default: "consumer",
    },

    specialization: String,
    experience: Number,

    phone: String,
    gender: String,
    dob: Date,
    address: String,
    city: String,
    state: String,
    pincode: String,

    profileCompleted: Boolean,
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
