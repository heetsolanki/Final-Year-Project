const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;
const PDF_MIME_TYPE = "application/pdf";

const buildValidationError = (message, field, code = "VALIDATION_ERROR") => ({
  success: false,
  message,
  errors: [{ field, message, code }],
});

const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype !== PDF_MIME_TYPE) {
    return cb(new Error("Only PDF files are allowed."));
  }
  cb(null, true);
};

const multerPdf = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PDF_SIZE_BYTES },
  fileFilter: pdfFileFilter,
});

const handleUploadError = (err, req, res, next) => {
  if (!err) return next();

  if (err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(400)
      .json(
        buildValidationError(
          "File too large. Maximum size is 10MB.",
          err.field || "file",
          "FILE_TOO_LARGE",
        ),
      );
  }

  return res
    .status(400)
    .json(buildValidationError(err.message || "File upload failed.", err.field || "file", "INVALID_FILE"));
};

const runUpload = (uploadMiddleware) => (req, res, next) => {
  uploadMiddleware(req, res, (err) => handleUploadError(err, req, res, next));
};

const uploadPdfToCloudinary = ({ file, folder }) =>
  new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      reject(new Error("No file buffer provided for upload."));
      return;
    }

    const originalBaseName = path.parse(file.originalname || "document").name;
    const safeBaseName = originalBaseName
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40);

    const publicId = `${safeBaseName || "document"}-${Date.now()}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw",
        public_id: publicId,
        format: "pdf",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        // Log Cloudinary delivery details for upload verification and debugging.
        console.log("[Cloudinary Upload]", {
          public_id: result.public_id,
          resource_type: result.resource_type,
          secure_url: result.secure_url,
        });

        if (result.resource_type !== "raw") {
          reject(new Error("Cloudinary upload failed: expected resource_type raw."));
          return;
        }

        if (!result.secure_url || !result.secure_url.includes("/raw/upload/")) {
          reject(new Error("Cloudinary upload failed: expected /raw/upload/ secure URL."));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
        });
      },
    );

    uploadStream.end(file.buffer);
  });

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
  } catch {
    // Ignore deletion failure so profile save is not blocked.
  }
};

const expertVerificationUpload = runUpload(
  multerPdf.fields([
    { name: "governmentIdFile", maxCount: 1 },
    { name: "barCouncilDocFile", maxCount: 1 },
  ]),
);

const consultationUpload = runUpload(multerPdf.single("file"));

module.exports = {
  MAX_PDF_SIZE_BYTES,
  PDF_MIME_TYPE,
  buildValidationError,
  expertVerificationUpload,
  consultationUpload,
  uploadPdfToCloudinary,
  deleteFromCloudinary,
};
