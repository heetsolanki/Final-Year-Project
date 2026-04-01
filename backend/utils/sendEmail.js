const nodemailer = require("nodemailer");
const logActivity = require("./logActivity");

const sendEmail = async (to, subject, html, options = {}) => {
  try {
    const {
      category = "general",
      performedBy = "SYSTEM",
      targetId = null,
      details = {},
      text = "",
    } = options;

    console.log(`Preparing email [${category}]...`);

    if (!to) {
      throw new Error("No recipient email provided");
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Missing EMAIL_USER or EMAIL_PASS environment variables");
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpSecure =
      String(process.env.SMTP_SECURE || "").toLowerCase() === "true" ||
      smtpPort === 465;
    const isProduction = process.env.NODE_ENV === "production";

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Allow local/dev environments with self-signed chains.
      ...(isProduction ? {} : { tls: { rejectUnauthorized: false } }),
    });

    await transporter.verify();

    const mailOptions = {
      from: `"LawAssist" <${process.env.EMAIL_USER}>`,
      to: String(to).trim(),
      subject,
      html,
      text,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Email sent [${category}]`);

    await logActivity("Email sent", performedBy, targetId, {
      category,
      ...details,
    });

    return true;
  } catch (error) {
    console.error(`Email failed [${options.category || "general"}]`, {
      message: error.message,
      stack: error.stack,
      hasEmailUser: Boolean(process.env.EMAIL_USER),
      hasEmailPass: Boolean(process.env.EMAIL_PASS),
      smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
      smtpPort: Number(process.env.SMTP_PORT || 465),
    });

    await logActivity("Email failed", options.performedBy || "SYSTEM", options.targetId || null, {
      category: options.category || "general",
      errorMessage: error.message,
      ...(options.details || {}),
    });

    return false;
  }
};

module.exports = sendEmail;