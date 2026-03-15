const ActivityLog = require("../models/ActivityLog");

const logActivity = async (
  action,
  performedBy,
  targetId = null,
  details = {},
) => {
  try {
    await ActivityLog.create({
      action,
      performedBy,
      targetId,
      details,
    });
  } catch (error) {
    console.error("Activity log error:", error);
  }
};

module.exports = logActivity;
