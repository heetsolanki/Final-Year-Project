const express = require("express");
const router = express.Router();

const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");

const {
  createQuery,
  getPublicQueries,
  getSingleQuery,
  deleteQuery
} = require("../controllers/queryController");

/* ================= CREATE QUERY ================= */
router.post("/", verifyToken, authorizeRole("consumer"), createQuery);

/* ================= GET ALL PUBLIC QUERIES ================= */
router.get("/public", getPublicQueries);

/* ================= GET SINGLE QUERY ================= */
router.get("/:id", getSingleQuery);

/* ================= DELETE QUERY ================= */
router.delete("/:id", verifyToken, authorizeRole("consumer"), deleteQuery);

module.exports = router;