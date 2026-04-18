const { consultationUpload } = require("../middleware/uploadMiddleware");

module.exports = {
  single: () => consultationUpload,
};
