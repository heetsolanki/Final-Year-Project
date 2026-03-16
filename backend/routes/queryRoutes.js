const express = require("express");
const router = express.Router();

const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");

const {
  createQuery,
  getPublicQueries,
  getSingleQuery,
  deleteQuery,
  reAppealQuery
} = require("../controllers/queryController");

/* ================= CREATE QUERY ================= */
router.post("/", verifyToken, authorizeRole("consumer"), createQuery);

/* ================= RE-APPEAL REJECTED QUERY ================= */
router.put("/re-appeal/:id", verifyToken, authorizeRole("consumer"), reAppealQuery);

/* ================= GET ALL PUBLIC QUERIES ================= */
router.get("/public", getPublicQueries);

/* ================= GET SINGLE QUERY ================= */
router.get("/:id", getSingleQuery);

/* ================= DELETE QUERY ================= */
router.delete("/:id", verifyToken, authorizeRole("consumer"), deleteQuery);

module.exports = router;