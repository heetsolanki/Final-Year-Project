const Query = require("../models/Query");
const Expert = require("../models/Expert");
const User = require("../models/User");
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
    } = req.body;

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

    const completion = calculateProfileCompletion(expert);

    expert.profileCompletion = completion;
    expert.verificationStatus = completion === 100 ? "verified" : "pending";

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

    if (!expert || expert.verificationStatus !== "verified") {
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
      verificationStatus: "verified",
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
