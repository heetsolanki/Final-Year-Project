const newConsultationEmail = (expertName, consultationId, consumerUserId) => {
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

        <h2 style="color:#111827;">New Consultation Started</h2>

        <p style="color:#4b5563; line-height:1.6;">
          Hello <strong>${expertName}</strong>,
        </p>

        <p style="color:#4b5563; line-height:1.6;">
          A consumer has initiated a new consultation with you on <strong>LawAssist</strong>.
        </p>

        <div style="background:#f9fafb; border-left:4px solid #2563eb; padding:15px; margin:25px 0; border-radius:6px;">
          <p style="margin:6px 0; color:#374151;">
            <strong>Consultation ID:</strong> ${consultationId}
          </p>
          <p style="margin:6px 0; color:#374151;">
            <strong>Consumer:</strong> ${consumerUserId}
          </p>
        </div>

        <p style="color:#4b5563; line-height:1.6;">
          Please head to your dashboard to review the consultation details and begin assisting the consumer.
        </p>

        <a href="https://lawassist.vercel.app/legal-expert-dashboard" target="_blank"
           style="display:inline-block;
           margin-top:10px;
           background:#2563eb;
           color:white;
           padding:12px 22px;
           text-decoration:none;
           border-radius:6px;
           font-weight:600;">
           View Consultation
        </a>

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

module.exports = newConsultationEmail;
