const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getExpertStats,
  getAllQueries,
  answerQuery,
  resolveQuery,
  acceptCase
} = require("../controllers/expertController");

router.get("/stats", authMiddleware, getExpertStats);

router.get("/queries", authMiddleware, getAllQueries);

router.patch("/accept/:id", authMiddleware, acceptCase);

router.post("/answer/:id", authMiddleware, answerQuery);

router.patch("/resolve/:id", authMiddleware, resolveQuery);


module.exports = router;