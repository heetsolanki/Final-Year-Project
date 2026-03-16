const querySubmittedEmail = (name, queryTitle, queryCategory, querySubcategory) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color:#f5f7fb; padding:40px 20px;">
    
    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.08);">

      <div style="background:#1f2937; padding:20px; text-align:center;">
        <h1 style="color:white; margin:0;">LawAssist</h1>
        <p style="color:#d1d5db; margin:5px 0 0; font-size:13px;">
          Consumer Rights Legal Help System
        </p>
      </div>

      <div style="padding:30px;">

        <h2 style="color:#111827;">Query Submitted Successfully ✅</h2>

        <p style="color:#4b5563; line-height:1.6;">
          Hello <strong>${name}</strong>,
        </p>

        <p style="color:#4b5563; line-height:1.6;">
          Your query has been successfully submitted on <b>LawAssist</b>. 
          Our legal experts will review it and respond soon.
        </p>

        <div style="background:#f9fafb; border-left:4px solid #2563eb; padding:15px; margin:25px 0; border-radius:6px;">
          <p style="margin:0; color:#374151;">
            <strong style="margin-bottom:5px;">Query Title:</strong> ${queryTitle}
          </p>
          <p style="margin:5px 0 0; color:#374151;">
            <strong style="margin-bottom:5px;">Query Category:</strong> ${queryCategory}
          </p>
          <p style="margin:5px 0 0; color:#374151;">
            <strong style="margin-bottom:5px;">Query Subcategory:</strong> ${querySubcategory}
          </p>
        </div>

        <p style="margin-top:30px; color:#111827;">
          — Team LawAssist
        </p>

      </div>

      <div style="background:#f3f4f6; padding:15px; text-align:center; font-size:12px; color:#6b7280;">
        © ${new Date().getFullYear()} LawAssist. All rights reserved.
      </div>

    </div>

  </div>
  `;
};

module.exports = querySubmittedEmail;