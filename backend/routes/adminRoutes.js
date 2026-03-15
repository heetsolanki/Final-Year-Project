const express = require("express");
const router = express.Router();

const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");
const verifyMasterAdmin = require("../middleware/masterAdminMiddleware");

const {
  getAdminStats,
  getAllUsers,
  promoteToAdmin,
  demoteAdmin,
  blockUser,
  unblockUser,
  deleteQuery,
  deleteUser,
  getAllExpertsAdmin,
  getExpertByUserId,
  verifyExpert,
  rejectExpert,
  blockExpert,
  unblockExpert,
  getActivityLogs,
  getNotifications,
  getDetailedStats,
  approveQuery,
  rejectQuery,
} = require("../controllers/adminController");


/* ================= GET ALL USERS ================= */

router.get("/users", verifyToken, authorizeRole("admin"), getAllUsers);

/* ================= PROMOTE USER ================= */

router.put(
  "/promote/:userId",
  verifyToken,
  authorizeRole("admin"),
  verifyMasterAdmin,
  promoteToAdmin,
);

/* ================= DEMOTE ADMIN ================= */

router.put(
  "/demote/:userId",
  verifyToken,
  authorizeRole("admin"),
  verifyMasterAdmin,
  demoteAdmin,
);

/* ================= BLOCK USER ================= */

router.put("/block/:userId", verifyToken, authorizeRole("admin"), blockUser);

/* ================= UNBLOCK USER ================= */

router.put("/unblock/:userId", verifyToken, authorizeRole("admin"), unblockUser);

/* ================= DELETE QUERY ================= */

router.delete("/query/:id", verifyToken, authorizeRole("admin"), deleteQuery);

/* ================= APPROVE QUERY ================= */

router.put("/query/approve/:id", verifyToken, authorizeRole("admin"), approveQuery);

/* ================= REJECT QUERY ================= */

router.put("/query/reject/:id", verifyToken, authorizeRole("admin"), rejectQuery);

/* ================= DELETE USER ================= */

router.delete("/users/:userId", verifyToken, authorizeRole("admin"), deleteUser);

router.get(
  "/experts",
  verifyToken,
  authorizeRole("admin"),
  getAllExpertsAdmin,
);

router.get(
  "/experts/:userId",
  verifyToken,
  authorizeRole("admin"),
  getExpertByUserId,
);

router.put(
  "/experts/verify/:userId",
  verifyToken,
  authorizeRole("admin"),
  verifyExpert,
);

router.put(
  "/experts/reject/:userId",
  verifyToken,
  authorizeRole("admin"),
  rejectExpert,
);

router.put(
  "/experts/block/:userId",
  verifyToken,
  authorizeRole("admin"),
  blockExpert,
);

router.put(
  "/experts/unblock/:userId",
  verifyToken,
  authorizeRole("admin"),
  unblockExpert,
);

router.get("/activity", verifyToken, authorizeRole("admin"), getActivityLogs);

router.get(
  "/notifications",
  verifyToken,
  authorizeRole("admin"),
  getNotifications,
);

const adminOnly = [verifyToken, authorizeRole("admin")];
 
// GET /api/admin/stats  — summary counts for the overview dashboard
router.get("/stats", ...adminOnly, getAdminStats);
 
// GET /api/admin/stats/detailed — full breakdown by sub-status
router.get("/stats/detailed", ...adminOnly, getDetailedStats);

module.exports = router;
