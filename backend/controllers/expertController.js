const Query = require("../models/Query");
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

    const user = await User.findOne({ userId: expertId });

    if (!user) {
      return res.status(404).json({ message: "Expert not found" });
    }

    if (user.role !== "legalExpert") {
      return res
        .status(403)
        .json({ message: "Only experts can complete profile" });
    }

    user.barCouncilId = barCouncilId;
    user.specialization = specialization;
    user.experience = experience;
    user.consultationCharges = consultationCharges;
    user.state = state;
    user.city = city;
    user.languages = languages;
    user.expertiseAreas = expertiseAreas;
    user.bio = bio;

    const completion = calculateProfileCompletion(user);

    user.profileCompletion = completion;

    user.verificationStatus = completion === 100 ? "verified" : "pending";

    await user.save();

    res.json({
      message: "Profile updated successfully",
      profileCompletion: completion,
      verificationStatus: user.verificationStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

exports.getExpertProfile = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId }).select(
      "-password",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

exports.getExpertStats = async (req, res) => {
  try {
    const expertId = req.user.userId;

    const assignedQueries = await Query.countDocuments({
      expertId: expertId,
      status: "Assigned",
    });

    const pendingQueries = await Query.countDocuments({
      expertId: expertId,
      status: "Assigned",
      $or: [{ answer: "" }, { answer: null }],
    });

    const resolvedQueries = await Query.countDocuments({
      expertId: expertId,
      status: "Resolved",
    });

    res.json({
      assignedQueries,
      pendingQueries,
      resolvedQueries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};

exports.getAllQueries = async (req, res) => {
  try {
    const expertId = req.user.userId;

    const queries = await Query.find({
      $or: [{ status: "In Review" }, { expertId: expertId }],
    }).sort({ createdAt: -1 });

    res.json(queries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching queries" });
  }
};

exports.acceptCase = async (req, res) => {
  try {
    const { id } = req.params;

    const existingQuery = await Query.findById(id);

    if (!existingQuery) {
      console.log("Query does not exist");
      return res.status(404).json({ message: "Query not found" });
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
      console.log("Query update failed — conditions not matched");
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

    console.log("Case accepted successfully");

    res.json({
      message: "Case accepted successfully",
      query,
    });
  } catch (error) {
    console.error("Accept Case Error:", error);
    res.status(500).json({ message: "Error accepting case" });
  }
};

exports.answerQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    const expert = await User.findOne({ userId: req.user.userId });

    if (!expert || expert.verificationStatus !== "verified") {
      return res.status(403).json({
        message: "Only verified experts can answer queries",
      });
    }

    const query = await Query.findById(id);

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error answering query" });
  }
};

const calculateProfileCompletion = (user) => {
  const fields = [
    user.barCouncilId,
    user.specialization,
    user.experience,
    user.city,
    user.languages,
    user.expertiseAreas,
    user.bio,
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
    const experts = await User.find({
      role: "legalExpert",
      verificationStatus: "verified",
    }).select(
      "name specialization experience city state consultationCharges expertiseAreas bio",
    );

    res.json(experts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching experts" });
  }
};

exports.getExpertById = async (req, res) => {
  try {
    const expert = await User.findById(req.params.id).select("-password");

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    res.json(expert);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expert" });
  }
};
