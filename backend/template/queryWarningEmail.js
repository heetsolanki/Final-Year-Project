const queryWarningEmail = (name) => {
  return `
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

        <h2 style="color:#dc2626;">Account Warning</h2>

        <p style="color:#4b5563; line-height:1.6;">
          Hello <strong>${name}</strong>,
        </p>

        <p style="color:#4b5563; line-height:1.6;">
          This is an important notice regarding your LawAssist account.
        </p>

        <div style="background:#fef2f2; border-left:4px solid #dc2626; padding:15px; margin:25px 0; border-radius:6px;">
          <p style="margin:0; color:#374151; font-weight:600;">
            Your account has received 3 query rejections.
          </p>
          <p style="margin:10px 0 0 0; color:#dc2626; font-weight:600;">
            If one more query is rejected, your account will be terminated.
          </p>
        </div>

        <p style="color:#4b5563; line-height:1.6;">
          Please ensure that your future queries follow our community guidelines and contain relevant, appropriate content. We take the quality of our platform seriously.
        </p>

        <p style="color:#4b5563; line-height:1.6;">
          If you believe any rejection was made in error, please contact our support team.
        </p>

        <p style="margin-top:30px; color:#111827;">
          — Team LawAssist
        </p>

      </div>

      <!-- Footer -->
      <div style="background:#f3f4f6; padding:15px; text-align:center; font-size:12px; color:#6b7280;">
        &copy; ${new Date().getFullYear()} LawAssist. All rights reserved.
      </div>

    </div>

  </div>
  `;
};

module.exports = queryWarningEmail;
