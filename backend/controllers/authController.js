const User = require("../models/User");
const Expert = require("../models/Expert");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const welcomeEmailTemplate = require("../template/userWelcomeEmail");
const expertWelcomeEmail = require("../template/expertWelcomeEmail");

/* ================= REGISTER ================= */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser =
      (await User.findOne({ email })) || (await Expert.findOne({ email }));

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const baseId = email.split("@")[0];
    let userId;
    let isUnique = false;

    while (!isUnique) {
      const random = Math.floor(1000 + Math.random() * 9000);
      userId = `${baseId}_${random}`;

      const checkUser = await User.findOne({ userId });
      const checkExpert = await Expert.findOne({ userId });

      if (!checkUser && !checkExpert) isUnique = true;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;

    if (role === "legalExpert") {
      newUser = await Expert.create({
        userId,
        name,
        email,
        password: hashedPassword,
        profileCompleted: false,
      });

      await sendEmail(
        email,
        "Welcome to LawAssist - Legal Expert",
        expertWelcomeEmail(name, userId),
      );
    } else {
      newUser = await User.create({
        userId,
        name,
        email,
        password: hashedPassword,
      });

      await sendEmail(
        email,
        "Welcome to LawAssist",
        welcomeEmailTemplate(name, userId),
      );
    }

    const token = jwt.sign(
      { userId: newUser.userId, role: role || "consumer" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      role: role || "consumer",
      user: {
        userId: newUser.userId,
        name: newUser.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= LOGIN ================= */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    let role = "consumer";

    if (!user) {
      user = await Expert.findOne({ email });
      role = "legalExpert";
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user.userId,
        role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
