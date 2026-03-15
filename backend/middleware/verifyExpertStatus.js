const Expert = require("../models/Expert");

const verifyExpertStatus = async (req, res, next) => {
  try {
    const expert = await Expert.findOne({ userId: req.user.userId });

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    if (expert.verificationStatus === "blocked") {
      return res.status(403).json({
        message: "Your account has been blocked. Contact admin for details.",
      });
    }

    if (expert.verificationStatus !== "active" || !expert.isVerified) {
      return res.status(403).json({
        message: "Your profile must be verified to perform this action.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = verifyExpertStatus;
