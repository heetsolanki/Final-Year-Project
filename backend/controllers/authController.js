const User = require("../models/User");
const Expert = require("../models/Expert");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const welcomeEmailTemplate = require("../template/userWelcomeEmail");
const expertWelcomeEmail = require("../template/expertWelcomeEmail");
const passwordResetEmail = require("../template/passwordResetEmail");
const passwordResetOTPEmail = require("../template/passwordResetOTPEmail");
const { notifyAdmins, NOTIFICATION_TYPES } = require("../services/notificationService");

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
        role: "legalExpert",
        profileCompleted: false,
      });

      await sendEmail(
        email,
        "Welcome to LawAssist - Legal Expert",
        expertWelcomeEmail(name, userId),
        { category: "register_expert", targetId: userId },
      );

      await notifyAdmins({
        senderId: userId,
        senderRole: "expert",
        type: NOTIFICATION_TYPES.NEW_REGISTRATION,
        message: `New expert registration: ${name} (${email}).`,
        relatedId: userId,
      });
    } else {
      newUser = await User.create({
        userId,
        name,
        email,
        password: hashedPassword,
        role: "consumer",
      });

      await sendEmail(
        email,
        "Welcome to LawAssist",
        welcomeEmailTemplate(name, userId),
        { category: "register_user", targetId: userId },
      );

      await notifyAdmins({
        senderId: userId,
        senderRole: "user",
        type: NOTIFICATION_TYPES.NEW_REGISTRATION,
        message: `New user registration: ${name} (${email}).`,
        relatedId: userId,
      });
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
    let role;

    if (user) {
      // Normalize legacy role values from old DB records
      const dbRole = user.role || "consumer";
      if (dbRole === "user") role = "consumer";
      else if (dbRole === "expert") role = "legalExpert";
      else role = dbRole;
    } else {
      user = await Expert.findOne({ email });
      // Use the expert's actual role from DB (could be "admin" if promoted)
      role = user ? user.role : "legalExpert";
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if user is blocked
    if (user.status === "blocked" || user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked. Please contact the administrator." });
    }

    // Check if expert is blocked (applies to experts even if promoted to admin)
    if (user.verificationStatus === "blocked") {
      return res.status(403).json({ message: "Your account has been blocked. Please contact the administrator." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user.userId,
        role: role,
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

exports.sendResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const [consumerAccount, expertAccount] = await Promise.all([
      User.findOne({ email }),
      Expert.findOne({ email }),
    ]);

    const user = consumerAccount || expertAccount;

    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with this email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetOTP = hashedOTP;
    user.otpExpire = Date.now() + 2 * 60 * 1000;

    await user.save();

    const otpTemplate = passwordResetOTPEmail(otp);
    const otpEmailSent = await sendEmail(
      email,
      "Password Reset OTP",
      otpTemplate.html,
      { text: otpTemplate.text, category: "password_reset_otp", targetId: user.userId },
    );

    if (!otpEmailSent) {
      return res.status(500).json({ message: "Failed to send reset OTP email" });
    }

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    const findPayload = {
      email,
      resetOTP: hashedOTP,
      otpExpire: { $gt: Date.now() },
    };

    const [consumerMatch, expertMatch] = await Promise.all([
      User.findOne(findPayload),
      Expert.findOne(findPayload),
    ]);
    const match = consumerMatch || expertMatch;

    if (!match)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    match.resetToken = resetToken;
    match.resetTokenExpire = Date.now() + 10 * 60 * 1000;

    await match.save();

    const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const safeRole = expertMatch ? "legalExpert" : "consumer";
    const resetUrl = `${frontendBaseUrl}/forgot-password?email=${encodeURIComponent(email)}&role=${encodeURIComponent(safeRole)}&token=${encodeURIComponent(resetToken)}`;
    const resetTemplate = passwordResetEmail({ resetUrl, appName: "LawAssist" });

    const resetLinkEmailSent = await sendEmail(email, "Reset Your LawAssist Password", resetTemplate.html, {
      text: resetTemplate.text,
      category: "password_reset_link",
      targetId: match.userId,
      details: { role: safeRole },
    });

    if (!resetLinkEmailSent) {
      return res.status(500).json({ message: "Failed to send reset password email" });
    }

    res.json({ resetToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, resetToken, password } = req.body;

    const query = {
      email,
      resetToken,
      resetTokenExpire: { $gt: Date.now() },
    };

    const [consumerUser, expertUser] = await Promise.all([
      User.findOne(query),
      Expert.findOne(query),
    ]);
    const user = consumerUser || expertUser;

    if (!user) return res.status(400).json({ message: "Invalid request" });

    const isSameAsOldPassword = await bcrypt.compare(password, user.password);
    if (isSameAsOldPassword) {
      return res.status(400).json({
        message: "New password cannot be same as previous password.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.resetOTP = undefined;
    user.otpExpire = undefined;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= CHECK USER STATUS ================= */
exports.checkUserStatus = async (req, res) => {
  try {
    const { userId } = req.user;

    let user = await User.findOne({ userId }).select("status isBlocked blockReason role isMasterAdmin");
    if (user) {
      if (user.isBlocked) {
        return res.json({
          status: "blocked",
          role: user.role || "consumer",
          isMasterAdmin: Boolean(user.isMasterAdmin),
          blockReason: user.blockReason || "Account blocked",
        });
      }
      return res.json({
        status: user.status || "active",
        role: user.role || "consumer",
        isMasterAdmin: Boolean(user.isMasterAdmin),
      });
    }

    const expert = await Expert.findOne({ userId }).select("verificationStatus role");
    if (expert) {
      const status = expert.verificationStatus === "blocked" ? "blocked" : "active";
      return res.json({ status, role: expert.role, isMasterAdmin: false });
    }

    return res.json({ status: "deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
