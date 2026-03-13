const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");

const {
  getExpertStats,
  getAllQueries,
  answerQuery,
  acceptCase,
  completeExpertProfile,
  getExpertProfile,
  getAllExperts,
  getExpertById,
  toggleExpertStatus,
} = require("../controllers/expertController");

router.get("/stats", verifyToken, authorizeRole("legalExpert"), getExpertStats);
router.get(
  "/queries",
  verifyToken,
  authorizeRole("legalExpert"),
  getAllQueries,
);
router.patch(
  "/accept/:id",
  verifyToken,
  authorizeRole("legalExpert"),
  acceptCase,
);
router.post(
  "/answer/:id",
  verifyToken,
  authorizeRole("legalExpert"),
  answerQuery,
);
router.post(
  "/complete-profile",
  verifyToken,
  authorizeRole("legalExpert"),
  completeExpertProfile,
);
router.get(
  "/profile",
  verifyToken,
  authorizeRole("legalExpert"),
  getExpertProfile,
);
router.patch(
  "/toggle-status",
  verifyToken,
  authorizeRole("legalExpert"),
  toggleExpertStatus,
);
router.get("/all", getAllExperts);
router.get("/:id", getExpertById);

module.exports = router;
