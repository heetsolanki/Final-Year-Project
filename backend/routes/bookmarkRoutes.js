const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken } = require("../middleware/authMiddleware");

// SAVE SECTION
router.post("/save-law", verifyToken, async (req, res) => {
  try {
    const { lawId, sectionAlias } = req.body;

    if (!lawId || !sectionAlias) {
      return res.status(400).json({ message: "Missing bookmark data" });
    }

    const user = await User.findOne({ userId: req.user.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadySaved = user.savedLaws.find(
      (item) => item.lawId === lawId && item.sectionAlias === sectionAlias,
    );

    if (!alreadySaved) {
      user.savedLaws.push({
        lawId: lawId,
        sectionAlias: sectionAlias,
      });

      await user.save();
    }

    res.status(200).json({ message: "Section bookmarked successfully" });
  } catch (error) {
    console.error("Bookmark error:", error);
    res.status(500).json({ message: "Server error while saving bookmark" });
  }
});

// REMOVE SECTION
router.delete(
  "/remove-law/:lawId/:sectionAlias",
  verifyToken,
  async (req, res) => {
    try {
      const { lawId, sectionAlias } = req.params;

      const user = await User.findOne({ userId: req.user.userId });

      user.savedLaws = user.savedLaws.filter(
        (item) => !(item.lawId === lawId && item.sectionAlias === sectionAlias),
      );

      await user.save();

      res.status(200).json({ message: "Bookmark removed" });
    } catch (error) {
      console.error("Remove bookmark error:", error);
      res.status(500).json({ message: "Server error removing bookmark" });
    }
  },
);

// GET SAVED SECTIONS
router.get("/saved-laws", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });

    res.status(200).json(user.savedLaws);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookmarks" });
  }
});

module.exports = router;
