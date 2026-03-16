const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`;
    cb(null, uniqueName);
  },
});

const ALLOWED_MIMES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ALLOWED_EXTS = /\.(jpg|jpeg|png|pdf|doc|docx)$/i;

const fileFilter = (req, file, cb) => {
  const extOk = ALLOWED_EXTS.test(path.extname(file.originalname));
  const mimeOk = ALLOWED_MIMES.includes(file.mimetype);

  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPG, JPEG, PNG, PDF, DOC, DOCX are allowed."
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
});

module.exports = upload;
