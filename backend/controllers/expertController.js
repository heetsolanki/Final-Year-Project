const Query = require("../models/Query");
const Expert = require("../models/Expert");
const User = require("../models/User");
const Notification = require("../models/Notification");
const queryStatusUpdateEmail = require("../template/queryStatusUpdateEmail");
const sendEmail = require("../utils/sendEmail");

exports.completeExpertProfile = async (req, res) => {
  try {
    const expertId = req.user.userId;

    const {
      barCouncilId,
      specialization,
      experience,
      consultationCharges,
      city,
      state,
      languages,
      expertiseAreas,
      bio,
      idDocumentType,
      idNumber,
      idProofUrl,
    } = req.body;

    // ── Validations ──

    // Bar Council ID format: XX/1234/2020
    if (barCouncilId && !/^[A-Z]{2}\/[0-9]{4}\/[0-9]{4}$/.test(barCouncilId)) {
      return res.status(400).json({ message: "Invalid Bar Council ID format. Expected: XX/1234/2020" });
    }

    // Check Bar Council ID uniqueness
    if (barCouncilId) {
      const existing = await Expert.findOne({ barCouncilId, userId: { $ne: expertId } });
      if (existing) {
        return res.status(400).json({ message: "This Bar Council ID is already registered with another expert" });
      }
    }

    // Experience limits
    if (experience !== undefined && experience !== "") {
      const exp = Number(experience);
      if (isNaN(exp) || exp < 1 || exp > 50) {
        return res.status(400).json({ message: "Years of experience must be between 1 and 50" });
      }
    }

    // ID document validation based on type
    const validDocTypes = ["aadhaar", "pan", "passport", "voter_id", "driving_license"];
    if (idDocumentType && !validDocTypes.includes(idDocumentType)) {
      return res.status(400).json({ message: "Invalid document type selected" });
    }

    if (idNumber && idDocumentType) {
      const idValidation = {
        aadhaar: { regex: /^\d{12}$/, msg: "Aadhaar must be exactly 12 digits" },
        pan: { regex: /^[A-Z]{5}\d{4}[A-Z]$/, msg: "PAN must be in format: ABCDE1234F" },
        passport: { regex: /^[A-Z]\d{7}$/, msg: "Passport must be in format: A1234567" },
        voter_id: { regex: /^[A-Z]{3}\d{7}$/, msg: "Voter ID must be in format: ABC1234567" },
        driving_license: { regex: /^[A-Z]{2}\d{2}\s?\d{11}$/, msg: "Driving License must be in format: MH02 12345678901" },
      };

      const rule = idValidation[idDocumentType];
      if (rule && !rule.regex.test(idNumber)) {
        return res.status(400).json({ message: rule.msg });
      }
    }

    // Consultation charges validation
    if (consultationCharges !== undefined && consultationCharges !== "") {
      const charges = Number(consultationCharges);
      if (isNaN(charges) || charges < 0) {
        return res.status(400).json({ message: "Consultation charges cannot be negative" });
      }
    }

    const expert = await Expert.findOne({ userId: expertId });

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    expert.barCouncilId = barCouncilId;
    expert.specialization = specialization;
    expert.experience = experience;
    expert.consultationCharges = consultationCharges;
    expert.state = state;
    expert.city = city;
    expert.languages = languages;
    expert.expertiseAreas = expertiseAreas;
    expert.bio = bio;
    expert.idDocumentType = idDocumentType;
    expert.idNumber = idNumber;
    expert.idProofUrl = idProofUrl;

    const completion = calculateProfileCompletion(expert);
    expert.profileCompletion = completion;

    const previousStatus = expert.verificationStatus;
    expert.verificationStatus = completion === 100 ? "under_review" : "profile_incomplete";

    if (expert.verificationStatus === "under_review") {
      expert.rejectionReason = "";
    }

    if (
      previousStatus !== "under_review" &&
      expert.verificationStatus === "under_review"
    ) {
      await Notification.create({
        message: `Expert ${expert.name} requested verification`,
        type: "expert_request",
      });
    }

    await expert.save();

    res.json({
      message: "Profile updated successfully",
      profileCompletion: completion,
      verificationStatus: expert.verificationStatus,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

exports.getExpertProfile = async (req, res) => {
  try {
    const expert = await Expert.findOne({ userId: req.user.userId }).select(
      "-password",
    );

    res.json(expert);
  } catch {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

exports.getExpertStats = async (req, res) => {
  try {
    const expertId = req.user.userId;

    const assignedQueries = await Query.countDocuments({
      expertId,
      status: "Assigned",
    });

    const pendingQueries = await Query.countDocuments({
      expertId,
      status: "Assigned",
      $or: [{ answer: "" }, { answer: null }],
    });

    const resolvedQueries = await Query.countDocuments({
      expertId,
      status: "Resolved",
    });

    res.json({
      assignedQueries,
      pendingQueries,
      resolvedQueries,
    });
  } catch {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

exports.getAllQueries = async (req, res) => {
  try {
    const expertId = req.user.userId;

    const queries = await Query.find({
      $or: [{ status: "In Review" }, { expertId }],
    }).sort({ createdAt: -1 });

    res.json(queries);
  } catch {
    res.status(500).json({ message: "Error fetching queries" });
  }
};

exports.acceptCase = async (req, res) => {
  try {
    const { id } = req.params;

    const expertProfile = await Expert.findOne({ userId: req.user.userId });

    if (!expertProfile.isActive) {
      return res.status(403).json({
        message: "Your profile is inactive. Activate it to accept cases.",
      });
    }

    if (expertProfile.verificationStatus !== "active" || !expertProfile.isVerified) {
      return res.status(403).json({
        message: "Only verified experts can accept cases.",
      });
    }

    const query = await Query.findOneAndUpdate(
      {
        _id: id,
        expertId: null,
        status: "In Review",
      },
      {
        expertId: req.user.userId,
        status: "Assigned",
      },
      { new: true },
    );

    if (!query) {
      return res.status(400).json({
        message: "Case already accepted by another expert.",
      });
    }

    const user = await User.findOne({ userId: query.userId });

    if (user) {
      await sendEmail(
        user.email,
        "Your query has been accepted",
        queryStatusUpdateEmail(user.name, query.title, "Accepted"),
      );
    }

    res.json({
      message: "Case accepted successfully",
      query,
    });
  } catch {
    res.status(500).json({ message: "Error accepting case" });
  }
};

exports.answerQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    const expert = await Expert.findOne({ userId: req.user.userId });

    if (!expert.isActive) {
      return res.status(403).json({
        message: "Your profile is inactive. Activate it to answer queries.",
      });
    }

    if (!expert || expert.verificationStatus !== "active") {
      return res.status(403).json({
        message: "Only verified experts can answer queries",
      });
    }

    const query = await Query.findById(id);

    if (query.expertId !== req.user.userId) {
      return res.status(403).json({
        message: "You are not assigned to this case",
      });
    }

    query.answer = answer;

    query.answeredBy = {
      name: expert.name,
      specialization: expert.specialization || "Legal Expert",
    };

    query.status = "Answered";

    await query.save();

    const user = await User.findOne({ userId: query.userId });

    if (user) {
      await sendEmail(
        user.email,
        "Your query has been answered",
        queryStatusUpdateEmail(user.name, query.title, "Answered"),
      );
    }

    res.json({
      message: "Answer submitted successfully",
      query,
    });
  } catch {
    res.status(500).json({ message: "Error answering query" });
  }
};

const calculateProfileCompletion = (expert) => {
  const fields = [
    expert.barCouncilId,
    expert.specialization,
    expert.experience,
    expert.city,
    expert.languages,
    expert.expertiseAreas,
    expert.bio,
    expert.idDocumentType,
    expert.idNumber,
    expert.idProofUrl,
  ];

  const filled = fields.filter(
    (field) =>
      field !== undefined &&
      field !== null &&
      field !== "" &&
      !(Array.isArray(field) && field.length === 0),
  );

  return Math.round((filled.length / fields.length) * 100);
};

exports.getAllExperts = async (req, res) => {
  try {
    const experts = await Expert.find({
      verificationStatus: "active",
      isActive: true,
    }).select(
      "name specialization experience city state consultationCharges expertiseAreas bio",
    );

    res.json(experts);
  } catch {
    res.status(500).json({ message: "Error fetching experts" });
  }
};

exports.getExpertById = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id).select("-password");

    res.json(expert);
  } catch {
    res.status(500).json({ message: "Error fetching expert" });
  }
};

exports.toggleExpertStatus = async (req, res) => {
  try {
    const expert = await Expert.findOne({ userId: req.user.userId });

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    expert.isActive = !expert.isActive;
    await expert.save();

    res.status(200).json({
      message: "Expert status updated",
      isActive: expert.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
