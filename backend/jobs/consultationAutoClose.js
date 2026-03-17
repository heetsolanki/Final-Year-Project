const cron = require("node-cron");
const Consultation = require("../models/Consultation");
const { createNotification, NOTIFICATION_TYPES } = require("../services/notificationService");

const CONSULTATION_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours

/*
 * Runs every minute.
 * Finds all consultations that started more than 4 hours ago and are
 * still active, closes them, and notifies every connected client in
 * the relevant socket room so the chat window locks immediately.
 */
const startAutoCloseJob = (io) => {
  cron.schedule("* * * * *", async () => {
    try {
      const cutoff = new Date(Date.now() - CONSULTATION_DURATION_MS);

      const expired = await Consultation.find({
        status: "active",
        isActive: true,
        startedAt: { $lte: cutoff },
      });

      if (expired.length === 0) return;

      for (const consultation of expired) {
        consultation.status = "closed";
        consultation.isActive = false;
        consultation.closedAt = new Date();
        await consultation.save();

        await createNotification({
          userId: consultation.userId,
          title: "Consultation Auto-Closed",
          message: `Consultation ${consultation.consultationId} was automatically closed after 4 hours.`,
          type: NOTIFICATION_TYPES.SYSTEM,
          relatedId: consultation.consultationId,
        });

        await createNotification({
          expertId: consultation.expertId,
          title: "Consultation Auto-Closed",
          message: `Consultation ${consultation.consultationId} was automatically closed after 4 hours.`,
          type: NOTIFICATION_TYPES.SYSTEM,
          relatedId: consultation.consultationId,
        });

        // Notify both participants via socket
        io.to(consultation.consultationId).emit(
          "chatClosed",
          consultation.consultationId
        );

        console.log(
          `[AutoClose] Consultation ${consultation.consultationId} closed after 4 hours.`
        );
      }
    } catch (err) {
      console.error("[AutoClose] Error during auto-close job:", err.message);
    }
  });

  console.log("✅ Consultation auto-close job started (runs every minute)");
};

module.exports = startAutoCloseJob;
