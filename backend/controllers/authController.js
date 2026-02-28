const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate userId from email
    const baseId = email.split("@")[0];
    let userId;
    let isUnique = false;

    while (!isUnique) {
      const random = Math.floor(1000 + Math.random() * 9000);
      userId = `${baseId}_${random}`;
      const check = await User.findOne({ userId });
      if (!check) isUnique = true;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prepare user object
    const userData = {
      userId,
      name,
      email,
      password: hashedPassword,
      role: role || "consumer",
    };

    // Only add expert-related field if legalExpert
    if (role === "legalExpert") {
      userData.profileCompleted = false;
    }

    const newUser = await User.create(userData);

    res.status(201).json({
      message: "Registration successful",
      user: {
        userId: newUser.userId,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        userId: user.userId,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
