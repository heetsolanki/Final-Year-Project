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
  isWithinAvailability,
} = require("../utils/availability");

const getFallbackTitle = (specialization) =>
  String(specialization ? `${specialization} Case` : "Legal Consultation").slice(0, 120);

// GET /api/payments/expert-info/:expertId - Get expert info for payment page
exports.getExpertPaymentInfo = async (req, res) => {
  try {
    const expert = await Expert.findOne({ userId: req.params.expertId });

    if (!expert || !expert.isActive || expert.verificationStatus !== "active") {
      return res.status(400).json({ message: "Expert unavailable" });
    }

    if (!isWithinAvailability(expert.availability)) {
      return res.status(400).json({
        message: `Expert is currently offline. Available between ${formatAvailabilityWindow(expert.availability)}.`,
      });
    }

    res.json({
      name: expert.name,
      specialization: expert.specialization || "Legal Expert",
      consultationFee: expert.consultationFee ?? expert.consultationCharges ?? 0,
      consultationCharges: expert.consultationFee ?? expert.consultationCharges ?? 0,
      followUpFee: expert.followUpFee,
      experience: expert.experience,
      city: expert.city,
      state: expert.state,
      availability: expert.availability,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/payments/process - Process a simulated payment
exports.processPayment = async (req, res) => {
  try {
    const { expertId, paymentMethod, upiId, cardLast4Digits } =
      req.body;

    // Validate expert
    const expert = await Expert.findOne({ userId: expertId });
    if (!expert || !expert.isActive || expert.verificationStatus !== "active") {
      return res.status(400).json({ message: "Expert unavailable" });
    }

    if (!isWithinAvailability(expert.availability)) {
      return res.status(400).json({
        message: `Expert is currently offline. Available between ${formatAvailabilityWindow(expert.availability)}.`,
      });
    }

    const consultationAmount = expert.consultationFee ?? expert.consultationCharges ?? 0;

    // Generate payment ID
    const paymentId = "PAY_" + Date.now() + Math.floor(Math.random() * 1000);

    // Create payment record with Pending status
    const payment = await Payment.create({
      paymentId,
      userId: req.user.userId,
      expertId,
      amount: consultationAmount,
      paymentMethod,
      paymentStatus: "Pending",
      paymentPurpose: "initial",
      upiId: paymentMethod === "UPI" ? upiId : null,
      cardLast4Digits: paymentMethod === "CARD" ? cardLast4Digits : null,
    });

    // Simulate payment processing (80% success, 20% failure)
    const paymentSuccess = Math.random() < 0.8;

    if (paymentSuccess) {
      const transactionId = "TXN" + Date.now();

      // Update payment status
      payment.paymentStatus = "Success";
      payment.transactionId = transactionId;
      await payment.save();

      // Increment expert's total earnings
      expert.totalEarnings = (expert.totalEarnings || 0) + consultationAmount;
      await expert.save();

      // Create consultation
      const consultationId =
        "CONS_" + Math.floor(100000 + Math.random() * 900000);

      let chatTitle = getFallbackTitle(expert.specialization);
      try {
        const aiTitle = await generateConsultationTitle({
          specialization: expert.specialization,
          city: expert.city,
          state: expert.state,
        });
        if (aiTitle) chatTitle = aiTitle;
      } catch (error) {
        // Keep fallback title if AI generation fails
      }

      const consultation = await Consultation.create({
        consultationId,
        userId: req.user.userId,
        consumerId: req.user.userId,
        expertId,
        consultationFee: consultationAmount,
        chatTitle,
        paymentStatus: "paid",
      });

      await createNotification({
        receiverId: req.user.userId,
        receiverRole: "user",
        senderId: expertId,
        senderRole: "expert",
        message: "Your consultation payment was successful.",
        type: NOTIFICATION_TYPES.PAYMENT_SUCCESS,
        relatedId: paymentId,
      });

      await createNotification({
        receiverId: req.user.userId,
        receiverRole: "user",
        senderId: expertId,
        senderRole: "expert",
        message: "Your consultation booking has been confirmed.",
        type: NOTIFICATION_TYPES.CONSULTATION_BOOKED,
        relatedId: consultationId,
      });

      await createNotification({
        receiverId: expertId,
        receiverRole: "expert",
        senderId: req.user.userId,
        senderRole: "user",
        message: "A new paid consultation has been booked with you.",
        type: NOTIFICATION_TYPES.CONSULTATION_BOOKED,
        relatedId: consultationId,
      });

      await createNotification({
        receiverId: req.user.userId,
        receiverRole: "user",
        senderId: expertId,
        senderRole: "expert",
        message: `Consultation ${consultationId} is now active. You can start chatting with your expert.`,
        type: NOTIFICATION_TYPES.CONSULTATION_STARTED,
        relatedId: consultationId,
      });

      await createNotification({
        receiverId: expertId,
        receiverRole: "expert",
        senderId: req.user.userId,
        senderRole: "user",
        message: `You received payment of ₹${consultationAmount} for consultation ${consultationId}.`,
        type: NOTIFICATION_TYPES.PAYMENT_RECEIVED,
        relatedId: paymentId,
      });

      // Link consultation to payment
      payment.consultationId = consultationId;
      await payment.save();

      // Send email notification to expert
      try {
        await sendEmail(
          expert.email,
          "New Consultation on LawAssist",
          newConsultationEmail(expert.name, consultationId, req.user.userId),
          { category: "payment_consultation_created", targetId: consultationId },
        );
      } catch (emailError) {
        console.log("Email send failed:", emailError.message);
      }

      return res.status(200).json({
        success: true,
        transactionId,
        consultationId,
        paymentId,
        message: "Payment successful",
      });
    } else {
      // Payment failed
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
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    if (consultation.userId !== req.user.userId) {
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

    const followUpFee = expert.followUpFee;
    if (followUpFee === null || followUpFee === undefined) {
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
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/payments/process-followup - Process payment for an already created pending follow-up consultation
exports.processFollowUpPayment = async (req, res) => {
  try {
    const { consultationId, followUpConsultationId, paymentMethod, upiId, cardLast4Digits } =
      req.body;

    const targetConsultationId = consultationId || followUpConsultationId;

    const consultation = await Consultation.findOne({
      consultationId: targetConsultationId,
    });

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    if (consultation.userId !== req.user.userId) {
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

    const amount = expert.followUpFee;
    if (amount === null || amount === undefined) {
      return res.status(400).json({ message: "Follow-up fee is not configured" });
    }

    const paymentId = "PAY_" + Date.now() + Math.floor(Math.random() * 1000);

    const payment = await Payment.create({
      paymentId,
      userId: req.user.userId,
      expertId: consultation.expertId,
      consultationId: consultation.consultationId,
      amount,
      paymentMethod,
      paymentStatus: "Pending",
      paymentPurpose: "followup",
      upiId: paymentMethod === "UPI" ? upiId : null,
      cardLast4Digits: paymentMethod === "CARD" ? cardLast4Digits : null,
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

    const transactionId = "TXN" + Date.now();
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

    await createNotification({
      receiverId: req.user.userId,
      receiverRole: "user",
      senderId: consultation.expertId,
      senderRole: "expert",
      message: "Your follow-up consultation payment was successful.",
      type: NOTIFICATION_TYPES.PAYMENT_SUCCESS,
      relatedId: paymentId,
    });

    await createNotification({
      receiverId: req.user.userId,
      receiverRole: "user",
      senderId: consultation.expertId,
      senderRole: "expert",
      message: `Consultation ${consultation.consultationId} is active again. You can continue the chat.` ,
      type: NOTIFICATION_TYPES.CONSULTATION_STARTED,
      relatedId: consultation.consultationId,
    });

    await createNotification({
      receiverId: consultation.expertId,
      receiverRole: "expert",
      senderId: req.user.userId,
      senderRole: "user",
      message: "User has initiated a follow-up consultation.",
      type: NOTIFICATION_TYPES.CONSULTATION_BOOKED,
      relatedId: consultation.consultationId,
    });

    await createNotification({
      receiverId: consultation.expertId,
      receiverRole: "expert",
      senderId: req.user.userId,
      senderRole: "user",
      message: `You received follow-up payment of ₹${amount} for consultation ${consultation.consultationId}.`,
      type: NOTIFICATION_TYPES.PAYMENT_RECEIVED,
      relatedId: paymentId,
    });

    return res.status(200).json({
      success: true,
      transactionId,
      consultationId: consultation.consultationId,
      paymentId,
      amount,
      message: "Follow-up payment successful",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Helper: attach expert names to a list of payment records
const attachExpertNames = async (payments) => {
  const expertIds = [...new Set(payments.map((p) => p.expertId))];
  const experts = await Expert.find(
    { userId: { $in: expertIds } },
    { userId: 1, name: 1 },
  );
  const nameMap = {};
  experts.forEach((e) => { nameMap[e.userId] = e.name; });

  return payments.map((p) => ({
    ...p.toObject(),
    expertName: nameMap[p.expertId] || "Unknown Expert",
  }));
};

// GET /api/payments/history - Get payment history for current user
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });

    const enriched = await attachExpertNames(payments);
    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/payments/user/:userId - Get payment history by userId (consumer only)
exports.getPaymentHistoryByUser = async (req, res) => {
  try {
    // Ensure the requesting user can only access their own payments
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const payments = await Payment.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    const enriched = await attachExpertNames(payments);
    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
