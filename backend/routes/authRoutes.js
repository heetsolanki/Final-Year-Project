const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  sendResetOTP,
  verifyResetOTP,
  resetPassword,
  checkUserStatus,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-reset-otp", sendResetOTP);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);
router.get("/check-status", verifyToken, checkUserStatus);

module.exports = router;
