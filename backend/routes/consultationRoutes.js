const express = require("express");
const router = express.Router();

const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");

const {
  createConsultation,
  closeConsultation,
  getUserConsultations,
  getExpertConsultations,
  getConsultationById,
} = require("../controllers/consultationController");

router.post(
  "/create",
  verifyToken,
  authorizeRole("consumer"),
  createConsultation,
);

router.patch(
  "/close/:consultationId",
  verifyToken,
  authorizeRole("consumer"),
  closeConsultation,
);

router.get(
  "/user",
  verifyToken,
  authorizeRole("consumer"),
  getUserConsultations,
);

router.get(
  "/expert",
  verifyToken,
  authorizeRole("legalExpert"),
  getExpertConsultations,
);

router.get("/:consultationId", verifyToken, getConsultationById);

module.exports = router;
