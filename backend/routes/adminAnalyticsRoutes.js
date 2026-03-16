const express = require("express");

const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");
const { getAdminAnalytics } = require("../controllers/adminAnalyticsController");

const router = express.Router();

router.get("/analytics", verifyToken, authorizeRole("admin"), getAdminAnalytics);

module.exports = router;
