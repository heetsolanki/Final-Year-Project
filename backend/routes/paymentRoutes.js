const express = require("express");
const router = express.Router();

const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");

const {
  getExpertPaymentInfo,
  processPayment,
  getFollowUpPaymentInfo,
  processFollowUpPayment,
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
  "/followup-info/:consultationId",
  verifyToken,
  authorizeRole("consumer"),
  getFollowUpPaymentInfo,
);

router.post(
  "/process-followup",
  verifyToken,
  authorizeRole("consumer"),
  processFollowUpPayment,
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
