const queryRejectedEmail = (name, title, reason) => {
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

        <h2 style="color:#111827;">Query Rejected</h2>

        <p style="color:#4b5563; line-height:1.6;">
          Hello <strong>${name}</strong>,
        </p>

        <p style="color:#4b5563; line-height:1.6;">
          Your query has been reviewed and <strong style="color:#dc2626;">rejected</strong> by our admin team.
        </p>

        <div style="background:#f9fafb; border-left:4px solid #6b7280; padding:15px; margin:25px 0; border-radius:6px;">
          <p style="margin:0 0 5px 0; color:#374151; font-weight:600;">Query Title:</p>
          <p style="margin:0; color:#4b5563;">${title}</p>
        </div>

        <div style="background:#fef2f2; border-left:4px solid #dc2626; padding:15px; margin:25px 0; border-radius:6px;">
          <p style="margin:0 0 5px 0; color:#374151; font-weight:600;">Reason for Rejection:</p>
          <p style="margin:0; color:#4b5563;">${reason}</p>
        </div>

        <p style="color:#4b5563; line-height:1.6;">
          You may submit a new query after addressing the concerns mentioned above. Please ensure your query follows our community guidelines.
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

module.exports = queryRejectedEmail;
