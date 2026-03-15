const User = require("../models/User");

const verifyMasterAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });

    if (!user || !user.isMasterAdmin) {
      return res.status(403).json({
        message: "Only master admin can perform this action",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = verifyMasterAdmin;
