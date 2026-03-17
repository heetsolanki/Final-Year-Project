const express = require("express");
const router = express.Router();
const {
  generateExpertBioController,
  summarizeLawController,
  rephraseTextController,
} = require("../controllers/aiController");
const { verifyToken } = require("../middleware/authMiddleware");

// POST /api/ai/generate-bio  — requires login (any authenticated role)
router.post("/generate-bio", verifyToken, generateExpertBioController);

// POST /api/ai/summarize-law — public
router.post("/summarize-law", summarizeLawController);

// POST /api/ai/rephrase-text — public
router.post("/rephrase-text", rephraseTextController);

module.exports = router;
