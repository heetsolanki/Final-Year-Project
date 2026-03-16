const nodemailer = require("nodemailer");
const logActivity = require("./logActivity");

const sendEmail = async (to, subject, text, options = {}) => {
  try {
    const {
      category = "general",
      performedBy = "SYSTEM",
      targetId = null,
      details = {},
    } = options;

    console.log(`Preparing email [${category}]...`);

    if (!to) {
      console.log("No recipient email provided.");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `"LawAssist" <${process.env.EMAIL_USER}>`,
      to: String(to).trim(),
      subject,
      html: text,
    };
    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent [${category}]:`, info.response);

    await logActivity("Email sent", performedBy, targetId, {
      category,
      to: String(to).trim(),
      subject,
      response: info.response,
      ...details,
    });
  } catch (error) {
    console.error("Email error:", error);

    await logActivity("Email failed", options.performedBy || "SYSTEM", options.targetId || null, {
      category: options.category || "general",
      to: to ? String(to).trim() : null,
      subject,
      error: error.message,
      ...(options.details || {}),
    });
  }
};

module.exports = sendEmail;