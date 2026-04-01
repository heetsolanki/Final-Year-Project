const passwordResetOTPEmail = (otp) => {
  const html = `
  <div style="font-family: Arial, sans-serif; background-color:#f5f7fb; padding:40px 20px;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.08);">
      <!-- Header -->
      <div style="background:#1f2937; padding:20px; text-align:center;">
        <h1 style="color:white; margin:0;">LawAssist</h1>
        <p style="color:#d1d5db; margin:5px 0 0; font-size:13px;">
          Consumer Rights Legal Help System
        </p>
      </div>

      <!-- Body -->
      <div style="padding:30px;">
        <h2 style="color:#111827;">Password Reset OTP</h2>
        
        <p style="color:#4b5563; line-height:1.6;">
          We received a request to reset your password. Use the OTP below to proceed.
        </p>

        <div style="margin:24px 0; padding:20px; background:#f0f9ff; border:2px solid #0ea5e9; border-radius:8px; text-align:center;">
          <p style="margin:0 0 8px; color:#6b7280; font-size:13px;">Your OTP</p>
          <p style="margin:0; font-size:32px; font-weight:bold; color:#1E3A8A; letter-spacing:4px;">${otp}</p>
          <p style="margin:8px 0 0; color:#6b7280; font-size:12px;">Valid for 2 minutes</p>
        </div>

        <p style="color:#4b5563; line-height:1.6;">
          Do not share this OTP with anyone. LawAssist will never ask for your OTP via email.
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

  const text = `Password Reset OTP\n\nYour OTP: ${otp}\n\nValid for 2 minutes. Do not share this OTP with anyone. LawAssist will never ask for your OTP via email.`;

  return { html, text };
};

module.exports = passwordResetOTPEmail;
