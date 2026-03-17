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

    role: {
      type: String,
      enum: ["legalExpert", "admin"],
      default: "legalExpert",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    specialization: String,
    experience: {
      type: Number,
      min: 1,
      max: 50,
    },

    barCouncilId: {
      type: String,
      unique: true,
      sparse: true,
    },
    consultationFee: {
      type: Number,
      min: 0,
      default: 0,
    },

    followUpFee: {
      type: Number,
      min: 0,
      default: null,
    },

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
      enum: ["profile_incomplete", "under_review", "active", "rejected", "blocked"],
      default: "profile_incomplete",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    idDocumentType: {
      type: String,
      enum: ["aadhaar", "pan", "passport", "voter_id", "driving_license"],
    },
    idNumber: String,
    idProofUrl: String,

    profileCompletion: {
      type: Number,
      default: 0,
    },

    totalEarnings: {
      type: Number,
      default: 0,
    },

    availability: {
      startTime: {
        type: String,
        default: "09:00",
      },
      endTime: {
        type: String,
        default: "18:00",
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Expert", expertSchema);
