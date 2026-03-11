const welcomeEmailTemplate = (name, userId) => {
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

        <h2 style="color:#111827;">Welcome, ${name} 👋</h2>

        <p style="color:#4b5563; line-height:1.6;">
          Your account has been successfully created on <b>LawAssist</b>.
        </p>

        <p style="color:#4b5563; line-height:1.6;">
          You can now explore consumer rights, understand legal protections, 
          and submit queries to verified legal experts.
        </p>

        <div style="background:#f9fafb; border-left:4px solid #2563eb; padding:15px; margin:25px 0; border-radius:6px;">
          <p style="margin:0; color:#374151;">
            <strong>Your User ID:</strong> ${userId}
          </p>
        </div>

        <a href="https://lawassist.vercel.app/login" target="_blank"
           style="display:inline-block;
           margin-top:10px;
           background:#2563eb;
           color:white;
           padding:12px 22px;
           text-decoration:none;
           border-radius:6px;
           font-weight:600;">
           Visit LawAssist
        </a>

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
};

module.exports = welcomeEmailTemplate;