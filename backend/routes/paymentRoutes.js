const express = require("express");
const router = express.Router();

const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");

const {
  getExpertPaymentInfo,
  processPayment,
  getPaymentHistory,
  getPaymentHistoryByUser,
} = require("../controllers/paymentController");

router.get("/expert-info/:expertId", verifyToken, getExpertPaymentInfo);

router.post(
  "/process",
  verifyToken,
  authorizeRole("consumer"),
  processPayment,
);

router.get(
  "/history",
  verifyToken,
  authorizeRole("consumer"),
  getPaymentHistory,
);

router.get(
  "/user/:userId",
  verifyToken,
  authorizeRole("consumer"),
  getPaymentHistoryByUser,
);

module.exports = router;
