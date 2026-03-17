const mongoose = require("mongoose");
const Query = require("../models/Query");
const sendEmail = require("../utils/sendEmail");
const querySubmittedEmail = require("../template/querySubmittedEmail");
const queryRejectedEmail = require("../template/queryRejectedEmail");
const queryWarningEmail = require("../template/queryWarningEmail");
const queryStatusUpdateEmail = require("../template/queryStatusUpdateEmail");
const expertQueryNotification = require("../template/expertQueryNotification");
const accountBlockedEmail = require("../template/accountBlockedEmail");
const User = require("../models/User");
const Expert = require("../models/Expert");
const {
  analyzeUserQuery,
  validateQueryCategory,
  detectSubcategory,
  getCategoriesFromDataFile,
} = require("../services/geminiService");
const {
  createNotification,
  notifyExpertsBulk,
  notifyAdmins,
  NOTIFICATION_TYPES,
} = require("../services/notificationService");

const resolveFinalSubcategory = ({
  category,
  aiSubcategory,
  selectedSubcategory,
  subcategoryList,
}) => {
  const validSubcategories = Array.isArray(subcategoryList) ? subcategoryList : [];

  if (validSubcategories.includes(aiSubcategory)) {
    return aiSubcategory;
  }

  if (validSubcategories.includes(selectedSubcategory)) {
    return selectedSubcategory;
  }

  return validSubcategories[0] || selectedSubcategory || "";
};

const applyApprovedQueryFlow = async ({ query, user, actorId }) => {
  query.status = "In Review";
  await query.save();

  if (user) {
    await createNotification({
      receiverId: query.userId,
      receiverRole: "user",
      senderId: actorId,
      senderRole: "admin",
      message: `Your query "${query.title}" has been approved and is now under review.`,
      type: NOTIFICATION_TYPES.QUERY_APPROVED,
      relatedId: query._id.toString(),
    });

    sendEmail(
      user.email,
      "Query Approved – LawAssist",
      queryStatusUpdateEmail(user.name, query.title, "In Review"),
      {
        category: "query_approved",
        targetId: query._id.toString(),
        performedBy: actorId,
      },
    ).catch((err) => console.error("Email error:", err));
  }

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
        {
          category: "new_query_for_expert",
          targetId: query._id.toString(),
          performedBy: actorId,
        },
      ),
    ),
  ).catch((err) => console.error("Expert email error:", err));

  await notifyExpertsBulk({
    expertIds: experts.map((expert) => expert.userId),
    title: "New Consumer Query Posted",
    message: "A new consumer query has been posted on the platform.",
    relatedId: query._id.toString(),
    senderId: actorId,
    senderRole: "admin",
  });
};

const applyRejectedQueryFlow = async ({ query, user, reason, actorId }) => {
  query.status = "Rejected";
  query.rejectionReason = reason || "Not specified";
  query.rejectedBy = actorId;
  await query.save();

  if (!user) return;

  await createNotification({
    receiverId: query.userId,
    receiverRole: "user",
    senderId: actorId,
    senderRole: "admin",
    message: `Your query "${query.title}" has been rejected. Reason: ${reason || "Not specified"}`,
    type: NOTIFICATION_TYPES.QUERY_REJECTED,
    relatedId: query._id.toString(),
  });

  sendEmail(
    user.email,
    "Query Rejected – LawAssist",
    queryRejectedEmail(user.name, query.title, reason || "Not specified"),
    {
      category: "query_rejected",
      targetId: query._id.toString(),
      performedBy: actorId,
    },
  ).catch((err) => console.error("Email error:", err));

  user.queryRejectCount = (user.queryRejectCount || 0) + 1;

  if (user.queryRejectCount >= 3) {
    await createNotification({
      receiverId: query.userId,
      receiverRole: "user",
      senderId: actorId,
      senderRole: "admin",
      message:
        "Warning: Your account has received multiple query rejections. Further violations may lead to account termination.",
      type: NOTIFICATION_TYPES.ACCOUNT_STATUS,
      relatedId: query._id.toString(),
    });

    sendEmail(
      user.email,
      "Account Warning – LawAssist",
      queryWarningEmail(user.name),
      {
        category: "query_warning",
        targetId: query._id.toString(),
        performedBy: actorId,
      },
    ).catch((err) => console.error("Warning email error:", err));
  }

  if (user.queryRejectCount > 3) {
    user.status = "blocked";

    await createNotification({
      receiverId: query.userId,
      receiverRole: "user",
      senderId: actorId,
      senderRole: "admin",
      message: "Your account has been blocked due to excessive query rejections.",
      type: NOTIFICATION_TYPES.ACCOUNT_STATUS,
      relatedId: query._id.toString(),
    });

    sendEmail(
      user.email,
      "Account Blocked – LawAssist",
      accountBlockedEmail(user.name),
      {
        category: "user_blocked",
        targetId: query._id.toString(),
        performedBy: actorId,
      },
    ).catch((err) => console.error("Block email error:", err));
  }

  await user.save();
};

exports.createQuery = async (req, res) => {
  try {
    const {
      title,
      description,
      selectedCategory,
      selectedSubcategory,
      category,
      subcategory,
    } = req.body;

    const finalSelectedCategory = selectedCategory || category;
    const userSelectedSubcategory = selectedSubcategory || subcategory;
    const queryText = `${title || ""}\n${description || ""}`.trim();

    const categoriesMap = getCategoriesFromDataFile();
    const categoriesList = Object.keys(categoriesMap);
    const subcategoryList = Array.isArray(categoriesMap[finalSelectedCategory])
      ? categoriesMap[finalSelectedCategory]
      : [];

    let categoryValidation = {
      isMatch: true,
      correctCategory: finalSelectedCategory,
    };

    try {
      categoryValidation = await validateQueryCategory(
        queryText,
        finalSelectedCategory,
        categoriesList,
      );
    } catch (error) {
      console.error("validateQueryCategory failed, continuing normal flow:", error.message);
    }

    if (categoryValidation.isMatch === false) {
      return res.status(200).json({
        requiresCategoryChange: true,
        correctCategory: categoryValidation.correctCategory || finalSelectedCategory,
      });
    }

    let aiSuggestedSubcategory = userSelectedSubcategory;
    try {
      const subcategoryDetection = await detectSubcategory(
        queryText,
        finalSelectedCategory,
        subcategoryList,
      );
      aiSuggestedSubcategory = subcategoryDetection?.subcategory || userSelectedSubcategory;
    } catch (error) {
      console.error("detectSubcategory failed, continuing with user subcategory:", error.message);
    }

    const finalSubcategory = resolveFinalSubcategory({
      category: finalSelectedCategory,
      aiSubcategory: aiSuggestedSubcategory,
      selectedSubcategory: userSelectedSubcategory,
      subcategoryList,
    });

    let moderationResult = {
      isAppropriate: true,
      reason: "Query accepted",
    };

    try {
      moderationResult = await analyzeUserQuery(queryText);
    } catch (error) {
      console.error("analyzeUserQuery failed, continuing normal flow:", error.message);
    }

    const newQuery = await Query.create({
      userId: req.user.userId,
      title,
      category: finalSelectedCategory,
      subcategory: finalSubcategory,
      description,
    });

    const user = await User.findOne({ userId: req.user.userId });

    if (moderationResult.isAppropriate === false) {
      await applyRejectedQueryFlow({
        query: newQuery,
        user,
        reason: moderationResult.reason,
        actorId: req.user.userId,
      });

      return res.status(201).json(newQuery);
    }

    await applyApprovedQueryFlow({
      query: newQuery,
      user,
      actorId: req.user.userId,
    });

    return res.status(201).json(newQuery);
  } catch (error) {
    console.error("Create Query Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.suggestSubcategory = async (req, res) => {
  try {
    const {
      title = "",
      description = "",
      selectedCategory,
      selectedSubcategory,
      category,
      subcategory,
    } = req.body;

    const finalSelectedCategory = selectedCategory || category;
    const userSelectedSubcategory = selectedSubcategory || subcategory || "";

    const categoriesMap = getCategoriesFromDataFile();
    const subcategoryList = Array.isArray(categoriesMap[finalSelectedCategory])
      ? categoriesMap[finalSelectedCategory]
      : [];

    if (!finalSelectedCategory || subcategoryList.length === 0) {
      return res.status(200).json({ suggestedSubcategory: userSelectedSubcategory });
    }

    const queryText = `${title || ""}\n${description || ""}`.trim();

    let aiSuggestedSubcategory = userSelectedSubcategory;

    try {
      const detection = await detectSubcategory(
        queryText,
        finalSelectedCategory,
        subcategoryList,
      );
      aiSuggestedSubcategory = detection?.subcategory || userSelectedSubcategory;
    } catch (error) {
      console.error("suggestSubcategory AI failed, using user input:", error.message);
    }

    const finalSubcategory = resolveFinalSubcategory({
      category: finalSelectedCategory,
      aiSubcategory: aiSuggestedSubcategory,
      selectedSubcategory: userSelectedSubcategory,
      subcategoryList,
    });

    return res.status(200).json({ suggestedSubcategory: finalSubcategory });
  } catch (error) {
    console.error("Suggest Subcategory Error:", error);
    return res.status(200).json({
      suggestedSubcategory: req.body?.selectedSubcategory || req.body?.subcategory || "",
    });
  }
};

/* ================= RE-APPEAL REJECTED QUERY ================= */
exports.reAppealQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Query ID" });
    }

    const query = await Query.findById(id);

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    // Verify ownership
    if (query.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Only allow re-appeal for rejected queries
    if (query.status !== "Rejected") {
      return res.status(400).json({ message: "Only rejected queries can be re-appealed" });
    }

    // Update query with new data and reset status to Pending
    query.title = title || query.title;
    query.description = description || query.description;
    query.status = "Pending";
    query.rejectionReason = null;
    query.rejectionCount = (query.rejectionCount || 0); // Keep rejection count for tracking
    await query.save();

    await createNotification({
      receiverId: req.user.userId,
      receiverRole: "user",
      senderId: req.user.userId,
      senderRole: "user",
      message: "Your query has been re-submitted and is waiting for review.",
      type: NOTIFICATION_TYPES.SYSTEM,
      relatedId: query._id.toString(),
    });

    await notifyAdmins({
      senderId: req.user.userId,
      senderRole: "user",
      type: NOTIFICATION_TYPES.QUERY_SUBMITTED,
      message: `Query "${query.title}" was re-submitted for admin review.`,
      relatedId: query._id.toString(),
    });

    // Send confirmation email
    const user = await User.findOne({ userId: req.user.userId });
    if (user) {
      sendEmail(
        user.email,
        "Query Re-Submitted for Review - LawAssist",
        querySubmittedEmail(
          user.name,
          query.title,
          query.category,
          query.subcategory,
        ),
        { category: "query_reappeal", targetId: query._id.toString() },
      ).catch((err) => console.error("Email sending error:", err));
    }

    return res.status(200).json({ message: "Query re-submitted for review", query });
  } catch (error) {
    console.error("Re-Appeal Query Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL PUBLIC QUERIES ================= */
exports.getPublicQueries = async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    return res.status(200).json(queries);
  } catch (error) {
    console.error("Fetch Queries Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET SINGLE QUERY ================= */
exports.getSingleQuery = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Query ID" });
    }

    const query = await Query.findById(id);

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    return res.status(200).json(query);
  } catch (error) {
    console.error("Get Query Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE QUERY ================= */
exports.deleteQuery = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Query ID" });
    }

    const query = await Query.findById(id);

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    if (query.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await query.deleteOne();

    return res.status(200).json({ message: "Query deleted successfully" });
  } catch (error) {
    console.error("Delete Query Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
