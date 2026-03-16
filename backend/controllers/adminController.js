const User = require("../models/User");
const Expert = require("../models/Expert");
const Query = require("../models/Query");
const Consultation = require("../models/Consultation");
const ActivityLog = require("../models/ActivityLog");
const Notification = require("../models/Notification");
const logActivity = require("../utils/logActivity");
const sendEmail = require("../utils/sendEmail");
const expertVerifiedEmail = require("../template/expertVerifiedEmail");
const expertRejectedEmail = require("../template/expertRejectedEmail");
const queryRejectedEmail = require("../template/queryRejectedEmail");
const queryWarningEmail = require("../template/queryWarningEmail");
const queryStatusUpdateEmail = require("../template/queryStatusUpdateEmail");
const expertQueryNotification = require("../template/expertQueryNotification");
const accountBlockedEmail = require("../template/accountBlockedEmail");

/* ================= ADMIN DASHBOARD STATS ================= */

/* ================= GET ALL USERS ================= */

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -resetOTP -otpExpire -resetToken -resetTokenExpire")
      .sort({ createdAt: -1 });

    const experts = await Expert.find()
      .select("-password -resetOTP -otpExpire -resetToken -resetTokenExpire")
      .sort({ createdAt: -1 });

    // Normalize experts to match the user shape for the frontend
    const normalizedExperts = experts.map((exp) => {
      const obj = exp.toObject();
      // Map verificationStatus to a simple status field for the table
      if (obj.verificationStatus === "blocked") {
        obj.status = "blocked";
      } else {
        obj.status = obj.status || "active";
      }
      // Mark as coming from expert collection so frontend can differentiate
      obj._isExpert = true;
      return obj;
    });

    const combined = [...users, ...normalizedExperts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    res.json(combined);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ================= PROMOTE USER TO ADMIN ================= */

exports.promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOneAndUpdate(
      { userId },
      { role: "admin" },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User promoted to admin",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ================= DEMOTE ADMIN ================= */

exports.demoteAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isMasterAdmin) {
      return res.status(403).json({
        message: "Master admin cannot be demoted",
      });
    }

    user.role = "consumer";

    await user.save();

    res.json({
      message: "Admin demoted successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ================= BLOCK USER ================= */

exports.blockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOneAndUpdate(
      { userId },
      { status: "blocked" },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send email notification to the blocked user
    sendEmail(
      user.email,
      "Account Blocked – LawAssist",
      accountBlockedEmail(user.name),
    ).catch((err) => console.error("Block email error:", err));

    res.json({
      message: "User blocked",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ================= UNBLOCK USER ================= */

exports.unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOneAndUpdate(
      { userId },
      { status: "active" },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User unblocked",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ================= DELETE QUERY ================= */

exports.deleteQuery = async (req, res) => {
  try {
    const { id } = req.params;

    await Query.findByIdAndDelete(id);

    res.json({
      message: "Query deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ================= VERIFY EXPERT ================= */

exports.verifyExpert = async (req, res) => {
  try {
    const { userId } = req.params;

    const expert = await Expert.findOne({ userId });

    if (!expert) {
      return res.status(404).json({
        message: "Expert not found",
      });
    }

    expert.verificationStatus = "active";
    expert.isVerified = true;
    expert.rejectionReason = "";

    await expert.save();

    await Notification.create({
      message: `Your profile has been verified. You can now accept cases.`,
      type: "expert_approved",
      targetUserId: userId,
    });

    await logActivity("Expert verified", req.user.userId, userId);

    // Send verification email
    await sendEmail(
      expert.email,
      "Your LawAssist Profile Has Been Verified",
      expertVerifiedEmail(expert.name),
    );

    res.json({
      message: "Expert verified successfully",
      expert,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ================= REJECT EXPERT ================= */

exports.rejectExpert = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const expert = await Expert.findOne({ userId });

    if (!expert) {
      return res.status(404).json({
        message: "Expert not found",
      });
    }

    expert.verificationStatus = "rejected";
    expert.isVerified = false;
    expert.rejectionReason = reason || "";

    await expert.save();

    await Notification.create({
      message: `Your profile verification was rejected. Reason: ${reason || "Not specified"}`,
      type: "expert_rejected",
      targetUserId: userId,
    });

    await logActivity("Expert rejected", req.user.userId, userId, { reason });

    // Send rejection email
    await sendEmail(
      expert.email,
      "Profile Rejected – LawAssist",
      expertRejectedEmail(expert.name, reason || "Not specified"),
    );

    res.json({
      message: "Expert rejected successfully",
      expert,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ================= GET ALL EXPERTS (ADMIN) ================= */

exports.getAllExpertsAdmin = async (req, res) => {
  try {
    const { status, search } = req.query;

    const filter = {};

    if (status && status !== "all") {
      filter.verificationStatus = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
      ];
    }

    const experts = await Expert.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(experts);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ================= GET EXPERT BY USER ID ================= */

exports.getExpertByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const expert = await Expert.findOne({ userId }).select("-password");

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    res.json(expert);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= BLOCK EXPERT ================= */

exports.blockExpert = async (req, res) => {
  try {
    const { userId } = req.params;

    const expert = await Expert.findOne({ userId });

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    expert.verificationStatus = "blocked";
    expert.isVerified = false;

    await expert.save();

    await logActivity("Expert blocked", req.user.userId, userId);

    // Send email notification to the blocked expert
    sendEmail(
      expert.email,
      "Account Blocked – LawAssist",
      accountBlockedEmail(expert.name),
    ).catch((err) => console.error("Block email error:", err));

    res.json({
      message: "Expert blocked successfully",
      expert,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UNBLOCK EXPERT ================= */

exports.unblockExpert = async (req, res) => {
  try {
    const { userId } = req.params;

    const expert = await Expert.findOne({ userId });

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    if (expert.profileCompletion === 100) {
      expert.verificationStatus = "active";
      expert.isVerified = true;
    } else {
      expert.verificationStatus = "profile_incomplete";
      expert.isVerified = false;
    }

    await expert.save();

    await logActivity("Expert unblocked", req.user.userId, userId);

    res.json({
      message: "Expert unblocked successfully",
      expert,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= PROMOTE EXPERT TO ADMIN ================= */

exports.promoteExpertToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the expert
    const expert = await Expert.findOne({ userId });
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    // Only allow promotion of active experts
    if (expert.verificationStatus !== "active") {
      return res.status(400).json({
        message: "Only verified active experts can be promoted to admin"
      });
    }

    // Update the Expert's role to admin
    expert.role = "admin";
    await expert.save();

    await logActivity("Expert promoted to admin", req.user.userId, userId);

    // Send email notification
    sendEmail(
      expert.email,
      "You've Been Promoted to Admin – LawAssist",
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1E3A8A;">Congratulations, ${expert.name}!</h2>
          <p>You have been promoted to an <strong>Administrator</strong> role on LawAssist.</p>
          <p>As an admin, you now have access to:</p>
          <ul>
            <li>User and expert management</li>
            <li>Query approval and rejection</li>
            <li>Platform statistics and activity logs</li>
          </ul>
          <p>You can access the admin dashboard by logging into your account.</p>
          <p style="margin-top: 20px; color: #666;">Thank you for being a valued member of our team!</p>
          <p style="color: #1E3A8A; font-weight: bold;">– The LawAssist Team</p>
        </div>
      `
    ).catch((err) => console.error("Promotion email error:", err));

    res.json({
      message: "Expert promoted to admin successfully",
      expert,
    });
  } catch (error) {
    console.error("Promote expert error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DEMOTE EXPERT ADMIN ================= */

exports.demoteExpertAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the expert
    const expert = await Expert.findOne({ userId });
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    // Only allow demotion of admin experts
    if (expert.role !== "admin") {
      return res.status(400).json({
        message: "This expert is not an admin"
      });
    }

    // Update the Expert's role back to legalExpert
    expert.role = "legalExpert";
    await expert.save();

    await logActivity("Expert demoted from admin", req.user.userId, userId);

    // Send email notification
    sendEmail(
      expert.email,
      "Admin Role Removed – LawAssist",
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1E3A8A;">Hello, ${expert.name}</h2>
          <p>Your <strong>Administrator</strong> privileges on LawAssist have been removed.</p>
          <p>You will continue to have access to your legal expert features:</p>
          <ul>
            <li>Accept and answer consumer queries</li>
            <li>Manage your expert profile</li>
            <li>View your case history</li>
          </ul>
          <p>If you have any questions, please contact the platform administrator.</p>
          <p style="margin-top: 20px; color: #666;">Thank you for your contributions!</p>
          <p style="color: #1E3A8A; font-weight: bold;">– The LawAssist Team</p>
        </div>
      `
    ).catch((err) => console.error("Demotion email error:", err));

    res.json({
      message: "Expert demoted from admin successfully",
      expert,
    });
  } catch (error) {
    console.error("Demote expert error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ACTIVITY LOGS ================= */

exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(50);

    res.json(logs);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ================= GET NOTIFICATIONS ================= */

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalExperts,
      totalQueries,
      activeConsultations,
      pendingVerifications,
    ] = await Promise.all([
      // All users with role "consumer" (excludes experts & admins)
      User.countDocuments({ role: "consumer" }),

      // Experts who are fully verified
      Expert.countDocuments({ verificationStatus: "active" }),

      // All queries regardless of status
      Query.countDocuments(),

      // Consultations currently active
      Consultation.countDocuments({ status: "active" }),

      // Experts who submitted docs but await admin review
      Expert.countDocuments({ verificationStatus: "under_review" }),
    ]);

    res.status(200).json({
      totalUsers,
      totalExperts,
      totalQueries,
      activeConsultations,
      pendingVerifications,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

// GET /api/admin/stats/detailed — breakdown per status for deeper admin views
exports.getDetailedStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      blockedUsers,
      totalExperts,
      verifiedExperts,
      pendingExperts,
      incompleteExperts,
      rejectedExperts,
      blockedExperts,
      totalQueries,
      queriesPending,
      queriesInReview,
      queriesAssigned,
      queriesAnswered,
      queriesResolved,
      queriesRejected,
      totalConsultations,
      activeConsultations,
      closedConsultations,
    ] = await Promise.all([
      User.countDocuments({ role: "consumer" }),
      User.countDocuments({ role: "consumer", status: "active" }),
      User.countDocuments({ role: "consumer", status: "blocked" }),

      Expert.countDocuments({ role: "legalExpert" }),
      Expert.countDocuments({ verificationStatus: "active" }),
      Expert.countDocuments({ verificationStatus: "under_review" }),
      Expert.countDocuments({ verificationStatus: "profile_incomplete" }),
      Expert.countDocuments({ verificationStatus: "rejected" }),
      Expert.countDocuments({ verificationStatus: "blocked" }),

      Query.countDocuments(),
      Query.countDocuments({ status: "Pending" }),
      Query.countDocuments({ status: "In Review" }),
      Query.countDocuments({ status: "Assigned" }),
      Query.countDocuments({ status: "Answered" }),
      Query.countDocuments({ status: "Resolved" }),
      Query.countDocuments({ status: "Rejected" }),

      Consultation.countDocuments(),
      Consultation.countDocuments({ status: "active" }),
      Consultation.countDocuments({ status: "closed" }),
    ]);

    res.status(200).json({
      users: { total: totalUsers, active: activeUsers, blocked: blockedUsers },
      experts: {
        total: totalExperts,
        verified: verifiedExperts,
        pending: pendingExperts,
        incomplete: incompleteExperts,
        rejected: rejectedExperts,
        blocked: blockedExperts,
      },
      queries: {
        total: totalQueries,
        pending: queriesPending,
        inReview: queriesInReview,
        assigned: queriesAssigned,
        answered: queriesAnswered,
        resolved: queriesResolved,
        rejected: queriesRejected,
      },
      consultations: {
        total: totalConsultations,
        active: activeConsultations,
        closed: closedConsultations,
      },
    });
  } catch (err) {
    console.error("Admin detailed stats error:", err);
    res.status(500).json({ message: "Failed to fetch detailed stats" });
  }
};

/* ================= APPROVE QUERY ================= */

exports.approveQuery = async (req, res) => {
  try {
    const { id } = req.params;

    const query = await Query.findById(id);
    if (!query) return res.status(404).json({ message: "Query not found" });

    if (query.status !== "Pending") {
      return res.status(400).json({ message: "Only pending queries can be approved" });
    }

    query.status = "In Review";
    await query.save();

    // Notify the consumer
    const user = await User.findOne({ userId: query.userId });
    if (user) {
      await Notification.create({
        message: `Your query "${query.title}" has been approved and is now under review.`,
        type: "query_approved",
        targetUserId: query.userId,
      });

      sendEmail(
        user.email,
        "Query Approved – LawAssist",
        queryStatusUpdateEmail(user.name, query.title, "In Review"),
      ).catch((err) => console.error("Email error:", err));
    }

    // Notify all active experts
    const experts = await Expert.find({ verificationStatus: "active", isActive: true });
    Promise.all(
      experts.map((expert) =>
        sendEmail(
          expert.email,
          "New Consumer Query Posted - LawAssist",
          expertQueryNotification(
            expert.name,
            user ? user.name : "A consumer",
            query.title,
            query.category,
            query.description,
          ),
        ),
      ),
    ).catch((err) => console.error("Expert email error:", err));

    await logActivity("Query approved", req.user.userId, query._id.toString());

    res.json({ message: "Query approved successfully", query });
  } catch (error) {
    console.error("Approve query error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= REJECT QUERY ================= */

exports.rejectQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const query = await Query.findById(id);
    if (!query) return res.status(404).json({ message: "Query not found" });

    if (query.status !== "Pending") {
      return res.status(400).json({ message: "Only pending queries can be rejected" });
    }

    query.status = "Rejected";
    query.rejectionReason = reason || "Not specified";
    query.rejectedBy = req.user.userId;
    await query.save();

    // Notify the consumer
    const user = await User.findOne({ userId: query.userId });
    if (user) {
      await Notification.create({
        message: `Your query "${query.title}" has been rejected. Reason: ${reason || "Not specified"}`,
        type: "query_rejected",
        targetUserId: query.userId,
      });

      sendEmail(
        user.email,
        "Query Rejected – LawAssist",
        queryRejectedEmail(user.name, query.title, reason || "Not specified"),
      ).catch((err) => console.error("Email error:", err));

      // Increment reject count and check for warning / block
      user.queryRejectCount = (user.queryRejectCount || 0) + 1;

      if (user.queryRejectCount >= 3) {
        await Notification.create({
          message: "Warning: Your account has received multiple query rejections. Further violations may lead to account termination.",
          type: "query_warning",
          targetUserId: query.userId,
        });

        sendEmail(
          user.email,
          "Account Warning – LawAssist",
          queryWarningEmail(user.name),
        ).catch((err) => console.error("Warning email error:", err));
      }

      if (user.queryRejectCount > 3) {
        user.status = "blocked";

        await Notification.create({
          message: "Your account has been blocked due to excessive query rejections.",
          type: "account_blocked",
          targetUserId: query.userId,
        });

        sendEmail(
          user.email,
          "Account Blocked – LawAssist",
          accountBlockedEmail(user.name),
        ).catch((err) => console.error("Block email error:", err));
      }

      await user.save();
    }

    await logActivity("Query rejected", req.user.userId, query._id.toString(), { reason });

    res.json({ message: "Query rejected successfully", query });
  } catch (error) {
    console.error("Reject query error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE USER ================= */

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Try Expert first
    const expert = await Expert.findOne({ userId });
    if (expert) {
      await Query.deleteMany({ expertId: userId });
      await Expert.deleteOne({ userId });
      await logActivity("User deleted (expert)", req.user.userId, userId);
      return res.json({ message: "Expert account deleted successfully" });
    }

    // Try User
    const user = await User.findOne({ userId });
    if (user) {
      if (user.isMasterAdmin) {
        return res.status(403).json({ message: "Cannot delete master admin account" });
      }
      await Query.deleteMany({ userId });
      await User.deleteOne({ userId });
      await logActivity("User deleted", req.user.userId, userId);
      return res.json({ message: "User account deleted successfully" });
    }

    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
