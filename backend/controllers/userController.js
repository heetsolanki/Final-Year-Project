const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId }).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId: req.user.userId },
      req.body,
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findOne({ userId: req.user.userId });

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};