const expertVerifiedEmail = (name) => {
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

        <h2 style="color:#111827;">Profile Verified Successfully</h2>

        <p style="color:#4b5563; line-height:1.6;">
          Hello <strong>${name}</strong>,
        </p>

        <p style="color:#4b5563; line-height:1.6;">
          Congratulations! Your legal expert profile has been reviewed and
          <strong style="color:#16a34a;">verified</strong> by our admin team.
        </p>

        <div style="background:#f0fdf4; border-left:4px solid #16a34a; padding:15px; margin:25px 0; border-radius:6px;">
          <p style="margin:0; color:#374151;">
            You can now <strong>accept cases</strong> and <strong>respond to consumer queries</strong> on LawAssist.
          </p>
        </div>

        <p style="color:#4b5563; line-height:1.6;">
          Head over to your dashboard to view assigned queries and start helping consumers with their legal concerns.
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

module.exports = expertVerifiedEmail;
