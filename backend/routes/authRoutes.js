const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  sendResetOTP,
  verifyResetOTP,
  resetPassword,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-reset-otp", sendResetOTP);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

module.exports = router;
