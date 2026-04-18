const Payment = require("../models/Payment");
const Consultation = require("../models/Consultation");
const Expert = require("../models/Expert");
const Message = require("../models/Message");
const sendEmail = require("../utils/sendEmail");
const newConsultationEmail = require("../template/newConsultationEmail");
const { generateConsultationTitle } = require("../services/geminiService");
const { createNotification, NOTIFICATION_TYPES } = require("../services/notificationService");
const {
  formatAvailabilityWindow,
} = require("../utils/availability");

const generateConsultationId = () => `CONS_${Math.floor(100000 + Math.random() * 900000)}`;

const getFallbackTitle = (specialization) => {
  const prefix = specialization ? `${specialization} Case` : "Legal Consultation";
  return String(prefix).slice(0, 120);
};

const getPaymentAmount = (expert, fieldNames = ["consultationFee", "consultationCharges"]) => {
  for (const fieldName of fieldNames) {
    const amount = Number(expert?.[fieldName]);
    if (Number.isFinite(amount) && amount > 0) {
      return amount;
    }
  }
  return 0;
};

const notifyPaymentSideEffects = (tasks, label) => {
  Promise.allSettled(tasks).then((results) => {
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.log(`${label} side effect failed:`, result.reason?.message || result.reason);
      }
    });
  });
};

// GET /api/payments/expert-info/:expertId - Fetch payment summary for a consultation
exports.getExpertPaymentInfo = async (req, res) => {
  try {
    const expert = await Expert.findOne({ userId: req.params.expertId });

    if (!expert || !expert.isActive || expert.verificationStatus !== "active") {
      return res.status(400).json({ message: "Expert unavailable" });
    }

    const consultationFee = getPaymentAmount(expert, ["consultationFee", "consultationCharges"]);
    if (!consultationFee) {
      return res.status(400).json({ message: "Consultation fee is not configured" });
    }

    const availabilityWindow = formatAvailabilityWindow(expert.availability);
    const isCurrentlyAvailable = expert.availability?.startTime && expert.availability?.endTime
      ? (() => {
          const [startHour, startMinute] = String(expert.availability.startTime).split(":").map(Number);
          const [endHour, endMinute] = String(expert.availability.endTime).split(":").map(Number);
          const now = new Date();
          const nowMinutes = now.getHours() * 60 + now.getMinutes();
          const startMinutes = startHour * 60 + startMinute;
          const endMinutes = endHour * 60 + endMinute;

          if ([startHour, startMinute, endHour, endMinute].some((value) => Number.isNaN(value))) {
            return false;
          }

          if (startMinutes < endMinutes) {
            return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
          }

          return nowMinutes >= startMinutes || nowMinutes <= endMinutes;
        })()
      : false;

    return res.json({
      expertId: expert.userId,
      consultationFee,
      availabilityWindow,
      isCurrentlyAvailable,
      expert: {
        name: expert.name || "Legal Expert",
        specialization: expert.specialization || "Legal Expert",
        experience: expert.experience,
        city: expert.city,
        state: expert.state,
        availability: expert.availability,
      },
    });
  } catch (error) {
    console.error("[getExpertPaymentInfo error]", error);
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/payments/process - Process a simulated payment
exports.processPayment = async (req, res) => {
  try {
    const { expertId, paymentMethod, upiId, cardLast4Digits } = req.body;

    if (!expertId) {
      return res.status(400).json({ message: "Expert ID is required" });
    }

    const normalizedPaymentMethod = String(paymentMethod || "").toUpperCase();
    if (!["UPI", "CARD"].includes(normalizedPaymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const expert = await Expert.findOne({ userId: expertId });
    if (!expert || !expert.isActive || expert.verificationStatus !== "active") {
      return res.status(400).json({ message: "Expert unavailable" });
    }

    const consultationAmount = getPaymentAmount(expert, ["consultationFee", "consultationCharges"]);
    if (!consultationAmount) {
      return res.status(400).json({ message: "Consultation fee is not configured" });
    }

    const paymentId = `PAY_${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const payment = await Payment.create({
      paymentId,
      userId: req.user.userId,
      expertId,
      amount: consultationAmount,
      paymentMethod: normalizedPaymentMethod,
      paymentStatus: "Pending",
      paymentPurpose: "initial",
      upiId: normalizedPaymentMethod === "UPI" ? upiId || null : null,
      cardLast4Digits: normalizedPaymentMethod === "CARD" ? cardLast4Digits || null : null,
    });

    const paymentSuccess = Math.random() < 0.8;

    if (!paymentSuccess) {
      payment.paymentStatus = "Failed";
      await payment.save();

      await createNotification({
        receiverId: req.user.userId,
        receiverRole: "user",
        senderId: expertId,
        senderRole: "expert",
        message: "Your consultation payment failed. Please try again.",
        type: NOTIFICATION_TYPES.PAYMENT_FAILED,
        relatedId: paymentId,
      });

      return res.status(200).json({
        success: false,
        paymentId,
        message: "Payment failed",
      });
    }

    const transactionId = `TXN${Date.now()}`;
    payment.paymentStatus = "Success";
    payment.transactionId = transactionId;
    await payment.save();

    expert.totalEarnings = (expert.totalEarnings || 0) + consultationAmount;
    await expert.save();

    const consultationId = generateConsultationId();

    let chatTitle = getFallbackTitle(expert.specialization);
    try {
      const aiTitle = await generateConsultationTitle({
        specialization: expert.specialization,
        city: expert.city,
        state: expert.state,
      });

      if (aiTitle) {
        chatTitle = aiTitle;
      }
    } catch (error) {
      console.log("Consultation title generation failed:", error.message);
    }

    await Consultation.create({
      consultationId,
      userId: req.user.userId,
      consumerId: req.user.userId,
      expertId,
      consultationFee: consultationAmount,
      chatTitle,
      paymentStatus: "paid",
    });

    payment.consultationId = consultationId;
    await payment.save();

    notifyPaymentSideEffects(
      [
        createNotification({
          receiverId: req.user.userId,
          receiverRole: "user",
          senderId: expertId,
          senderRole: "expert",
          message: "Your consultation payment was successful.",
          type: NOTIFICATION_TYPES.PAYMENT_SUCCESS,
          relatedId: paymentId,
        }),
        createNotification({
          receiverId: req.user.userId,
          receiverRole: "user",
          senderId: expertId,
          senderRole: "expert",
          message: "Your consultation booking has been confirmed.",
          type: NOTIFICATION_TYPES.CONSULTATION_BOOKED,
          relatedId: consultationId,
        }),
        createNotification({
          receiverId: expertId,
          receiverRole: "expert",
          senderId: req.user.userId,
          senderRole: "user",
          message: "A new paid consultation has been booked with you.",
          type: NOTIFICATION_TYPES.CONSULTATION_BOOKED,
          relatedId: consultationId,
        }),
        createNotification({
          receiverId: req.user.userId,
          receiverRole: "user",
          senderId: expertId,
          senderRole: "expert",
          message: `Consultation ${consultationId} is now active. You can start chatting with your expert.`,
          type: NOTIFICATION_TYPES.CONSULTATION_STARTED,
          relatedId: consultationId,
        }),
        createNotification({
          receiverId: expertId,
          receiverRole: "expert",
          senderId: req.user.userId,
          senderRole: "user",
          message: `You received payment of ₹${consultationAmount} for consultation ${consultationId}.`,
          type: NOTIFICATION_TYPES.PAYMENT_RECEIVED,
          relatedId: paymentId,
        }),
        sendEmail(
          expert.email,
          "New Consultation on LawAssist",
          newConsultationEmail(expert.name, consultationId, req.user.userId),
          { category: "payment_consultation_created", targetId: consultationId },
        ),
      ],
      "Payment",
    );

    return res.status(200).json({
      success: true,
      transactionId,
      consultationId,
      paymentId,
      message: "Payment successful",
    });
  } catch (error) {
    console.error("[processPayment error]", error);
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/payments/followup-info/:consultationId - Fetch pending follow-up payment summary
exports.getFollowUpPaymentInfo = async (req, res) => {
  try {
    const consultation = await Consultation.findOne({
      consultationId: req.params.consultationId,
    });

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    if (String(consultation.userId) !== String(req.user.userId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (consultation.isFollowUp) {
      return res.status(400).json({ message: "Use the original consultation for follow-up payment" });
    }

    if (consultation.status !== "closed" || consultation.isActive) {
      return res.status(400).json({ message: "Follow-up payment is allowed only after consultation ends" });
    }

    const expert = await Expert.findOne({ userId: consultation.expertId });
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    const followUpFee = Number(expert.followUpFee);
    if (!Number.isFinite(followUpFee) || followUpFee <= 0) {
      return res.status(400).json({ message: "Follow-up fee is not configured" });
    }

    const pendingPayment = await Payment.findOne({
      userId: req.user.userId,
      consultationId: consultation.consultationId,
      paymentPurpose: "followup",
      paymentStatus: "Pending",
    });

    return res.json({
      consultationId: consultation.consultationId,
      parentConsultationId: consultation.consultationId,
      expertId: consultation.expertId,
      followUpFee,
      originalConsultationFee: consultation.consultationFee,
      paymentStatus: pendingPayment ? "pending" : "ready",
      expert: {
        name: expert?.name || "Legal Expert",
        specialization: expert?.specialization || "Legal Expert",
        experience: expert?.experience,
        city: expert?.city,
        state: expert?.state,
        availability: expert?.availability,
      },
    });
  } catch (error) {
    console.error("[getFollowUpPaymentInfo error]", error);
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/payments/process-followup - Process payment for an already created pending follow-up consultation
exports.processFollowUpPayment = async (req, res) => {
  try {
    const { consultationId, followUpConsultationId, paymentMethod, upiId, cardLast4Digits } = req.body;
    const targetConsultationId = consultationId || followUpConsultationId;

    if (!targetConsultationId) {
      return res.status(400).json({ message: "Consultation ID is required" });
    }

    const normalizedPaymentMethod = String(paymentMethod || "").toUpperCase();
    if (!["UPI", "CARD"].includes(normalizedPaymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const consultation = await Consultation.findOne({ consultationId: targetConsultationId });
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    if (String(consultation.userId) !== String(req.user.userId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (consultation.isFollowUp) {
      return res.status(400).json({ message: "Use the original consultation for follow-up payment" });
    }

    if (consultation.status !== "closed" || consultation.isActive) {
      return res.status(400).json({ message: "Consultation must be closed before follow-up" });
    }

    const existingPendingPayment = await Payment.findOne({
      userId: req.user.userId,
      consultationId: consultation.consultationId,
      paymentPurpose: "followup",
      paymentStatus: "Pending",
    });

    if (existingPendingPayment) {
      return res.status(400).json({
        message: "You already have an unpaid follow-up payment for this consultation",
        paymentId: existingPendingPayment.paymentId,
      });
    }

    const expert = await Expert.findOne({ userId: consultation.expertId });
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    const amount = Number(expert.followUpFee);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: "Follow-up fee is not configured" });
    }

    const paymentId = `PAY_${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const payment = await Payment.create({
      paymentId,
      userId: req.user.userId,
      expertId: consultation.expertId,
      consultationId: consultation.consultationId,
      amount,
      paymentMethod: normalizedPaymentMethod,
      paymentStatus: "Pending",
      paymentPurpose: "followup",
      upiId: normalizedPaymentMethod === "UPI" ? upiId || null : null,
      cardLast4Digits: normalizedPaymentMethod === "CARD" ? cardLast4Digits || null : null,
    });

    const paymentSuccess = Math.random() < 0.8;
    if (!paymentSuccess) {
      payment.paymentStatus = "Failed";
      await payment.save();

      await createNotification({
        receiverId: req.user.userId,
        receiverRole: "user",
        senderId: consultation.expertId,
        senderRole: "expert",
        message: "Your follow-up consultation payment failed. Please try again.",
        type: NOTIFICATION_TYPES.PAYMENT_FAILED,
        relatedId: paymentId,
      });

      return res.status(200).json({
        success: false,
        paymentId,
        message: "Payment failed",
      });
    }

    const transactionId = `TXN${Date.now()}`;
    payment.paymentStatus = "Success";
    payment.transactionId = transactionId;
    await payment.save();

    expert.totalEarnings = (expert.totalEarnings || 0) + amount;
    await expert.save();

    consultation.status = "active";
    consultation.isActive = true;
    consultation.startedAt = consultation.startedAt || new Date();
    consultation.closedAt = null;
    await consultation.save();

    await Message.create({
      consultationId: consultation.consultationId,
      senderId: consultation.expertId,
      receiverId: consultation.userId,
      message: "Follow-Up Consultation Started",
      messageType: "system",
    });

    notifyPaymentSideEffects(
      [
        createNotification({
          receiverId: req.user.userId,
          receiverRole: "user",
          senderId: consultation.expertId,
          senderRole: "expert",
          message: "Your follow-up consultation payment was successful.",
          type: NOTIFICATION_TYPES.PAYMENT_SUCCESS,
          relatedId: paymentId,
        }),
        createNotification({
          receiverId: req.user.userId,
          receiverRole: "user",
          senderId: consultation.expertId,
          senderRole: "expert",
          message: `Consultation ${consultation.consultationId} is active again. You can continue the chat.`,
          type: NOTIFICATION_TYPES.CONSULTATION_STARTED,
          relatedId: consultation.consultationId,
        }),
        createNotification({
          receiverId: consultation.expertId,
          receiverRole: "expert",
          senderId: req.user.userId,
          senderRole: "user",
          message: "User has initiated a follow-up consultation.",
          type: NOTIFICATION_TYPES.CONSULTATION_BOOKED,
          relatedId: consultation.consultationId,
        }),
        createNotification({
          receiverId: consultation.expertId,
          receiverRole: "expert",
          senderId: req.user.userId,
          senderRole: "user",
          message: `You received follow-up payment of ₹${amount} for consultation ${consultation.consultationId}.`,
          type: NOTIFICATION_TYPES.PAYMENT_RECEIVED,
          relatedId: paymentId,
        }),
      ],
      "Follow-up payment",
    );

    return res.status(200).json({
      success: true,
      transactionId,
      consultationId: consultation.consultationId,
      paymentId,
      amount,
      message: "Follow-up payment successful",
    });
  } catch (error) {
    console.error("[processFollowUpPayment error]", error);
    return res.status(500).json({ message: error.message });
  }
};

const attachExpertNames = async (payments) => {
  const expertIds = [...new Set(payments.map((payment) => payment.expertId))];
  const experts = await Expert.find({ userId: { $in: expertIds } }, { userId: 1, name: 1 });

  const nameMap = {};
  experts.forEach((expert) => {
    nameMap[expert.userId] = expert.name;
  });

  return payments.map((payment) => ({
    ...payment.toObject(),
    expertName: nameMap[payment.expertId] || "Unknown Expert",
  }));
};

// GET /api/payments/history - Get payment history for current user
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });

    const enriched = await attachExpertNames(payments);
    return res.json(enriched);
  } catch (error) {
    console.error("[getPaymentHistory error]", error);
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/payments/user/:userId - Get payment history by userId (consumer only)
exports.getPaymentHistoryByUser = async (req, res) => {
  try {
    if (String(req.user.userId) !== String(req.params.userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const payments = await Payment.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    const enriched = await attachExpertNames(payments);
    return res.json(enriched);
  } catch (error) {
    console.error("[getPaymentHistoryByUser error]", error);
    return res.status(500).json({ message: error.message });
  }
};
