const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  consultationUpload,
  uploadPdfToCloudinary,
  buildValidationError,
} = require("../middleware/uploadMiddleware");

/*
 * POST /api/upload/consultation
 * Accepts a single PDF file, uploads to Cloudinary, returns metadata.
 * The caller then emits a socket `sendMessage` event with the metadata
 * so the message is broadcast to both chat participants.
 */
router.post(
  "/consultation",
  verifyToken,
  consultationUpload,
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json(buildValidationError("PDF file is required.", "file"));
    }

    try {
      const uploaded = await uploadPdfToCloudinary({
        file: req.file,
        folder: "lawassist/consultation_docs",
      });

      return res.json({
        fileUrl: uploaded.secure_url,
        filePublicId: uploaded.public_id,
        resourceType: uploaded.resource_type,
        fileName: req.file.originalname,
        fileType: "pdf",
        fileSize: req.file.size,
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Failed to upload file to Cloudinary.",
        errors: [{ field: "file", code: "UPLOAD_FAILED", message: "Cloud upload failed." }],
      });
    }
  }
);

module.exports = router;
