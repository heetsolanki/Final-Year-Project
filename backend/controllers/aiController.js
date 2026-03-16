const { generateExpertBio, summarizeLawText } = require("../services/geminiService");

/* ─────────────────────────────────────────────────────────
   POST /api/ai/generate-bio
   Requires authentication (legalExpert only).
───────────────────────────────────────────────────────── */
exports.generateExpertBioController = async (req, res) => {
  try {
    const {
      name,
      specialization,
      expertiseAreas,
      languages,
      experience,
      city,
      state,
    } = req.body;

    if (!name || !specialization || !experience) {
      return res.status(400).json({
        success: false,
        message: "name, specialization, and experience are required.",
      });
    }

    const bio = await generateExpertBio({
      name,
      specialization,
      expertiseAreas: expertiseAreas || [],
      languages: languages || [],
      experience,
      city: city || "",
      state: state || "",
    });

    res.json({ success: true, data: bio });
  } catch (error) {
    console.error("[AI] generateExpertBio error:", error.message);
    console.error("Full error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate bio. Please try again.",
    });
  }
};

/* ─────────────────────────────────────────────────────────
   POST /api/ai/summarize-law
   Public — no authentication required.
───────────────────────────────────────────────────────── */
exports.summarizeLawController = async (req, res) => {
  try {
    const { lawText } = req.body;

    if (!lawText || !lawText.trim()) {
      return res.status(400).json({
        success: false,
        message: "lawText is required.",
      });
    }

    const summary = await summarizeLawText(lawText.trim());

    res.json({ success: true, data: summary });
  } catch (error) {
    console.error("[AI] summarizeLaw error:", error.message);
    console.error("Full error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate summary. Please try again.",
    });
  }
};
