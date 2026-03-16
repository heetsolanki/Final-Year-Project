const express = require("express");
const router = express.Router();
const path = require("path");
const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../config/multerConfig");

/*
 * POST /api/upload/consultation
 * Accepts a single file, stores it in /uploads, returns metadata.
 * The caller then emits a socket `sendMessage` event with the metadata
 * so the message is broadcast to both chat participants.
 */
router.post(
  "/consultation",
  verifyToken,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ message: "File too large. Maximum size is 5MB." });
        }
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const ext = path.extname(req.file.originalname).toLowerCase().replace(".", "");

    res.json({
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      fileType: ext,
      fileSize: req.file.size,
    });
  }
);

module.exports = router;
