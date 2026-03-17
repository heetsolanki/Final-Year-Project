const expertAvailableEmail = (userName, expertName, startTime, endTime) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
      <h2 style="color: #1E3A8A; margin-bottom: 8px;">Expert Is Now Available</h2>
      <p style="font-size: 14px; line-height: 1.6;">Hello ${userName || "there"},</p>
      <p style="font-size: 14px; line-height: 1.6;">
        ${expertName} is now available for consultation on LawAssist.
      </p>
      <p style="font-size: 14px; line-height: 1.6;">
        Availability window: <strong>${startTime} - ${endTime}</strong>
      </p>
      <p style="font-size: 14px; line-height: 1.6; margin-top: 20px;">
        You can open the platform and start your consultation now.
      </p>
      <p style="font-size: 13px; color: #6b7280; margin-top: 20px;">- LawAssist Team</p>
    </div>
  `;
};

module.exports = expertAvailableEmail;
