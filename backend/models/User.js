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

  phone: String,
  gender: String,
  dob: Date,
  address: String,
  city: String,
  state: String,
  pincode: String,

},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);