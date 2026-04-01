const passwordResetEmail = ({ resetUrl, appName = "LawAssist" }) => {
  const html = `
  <div style="font-family: Arial, sans-serif; background-color:#f5f7fb; padding:40px 20px;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.08);">
      <!-- Header -->
      <div style="background:#1f2937; padding:20px; text-align:center;">
        <h1 style="color:white; margin:0;">${appName}</h1>
        <p style="color:#d1d5db; margin:5px 0 0; font-size:13px;">Consumer Rights Legal Help System</p>
      </div>

      <!-- Body -->
      <div style="padding:30px;">
        <h2 style="color:#111827;">Reset Your Password</h2>
        
        <p style="color:#4b5563; line-height:1.6;">
          We received a request to reset your password. Click the button below to continue.
        </p>

        <div style="margin:24px 0; text-align:center;">
          <a href="${resetUrl}" style="display:inline-block; background:#1E3A8A; color:#ffffff; text-decoration:none; padding:12px 22px; border-radius:8px; font-weight:600;">
            Reset Password
          </a>
        </div>

        <p style="color:#4b5563; line-height:1.6;">Or copy and paste this link into your browser:</p>
        <p style="color:#1E3A8A; word-break:break-all; margin:8px 0 16px; font-size:13px;">${resetUrl}</p>

        <p style="color:#6b7280; font-size:12px; line-height:1.6;">
          This link expires in 10 minutes. If you did not request this, please ignore this email.
        </p>

        <p style="margin-top:30px; color:#111827;">
          — Team LawAssist
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f3f4f6; padding:15px; text-align:center; font-size:12px; color:#6b7280;">
        © ${new Date().getFullYear()} LawAssist. All rights reserved.
      </div>
    </div>
  </div>
  `;

  const text = `LawAssist Password Reset\n\nReset your password using this link:\n${resetUrl}\n\nThis link expires in 10 minutes. If you did not request this, ignore this email.`;

  return { html, text };
};

module.exports = passwordResetEmail;
