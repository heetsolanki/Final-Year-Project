const Query = require("../models/Query");

exports.getExpertStats = async (req, res) => {
  try {
    const totalQueries = await Query.countDocuments();

    const pendingQueries = await Query.countDocuments({
      status: "In Review",
    });

    const resolvedQueries = await Query.countDocuments({
      expertId: req.user.userId,
      status: "Resolved",
    });

    const assignedQueries = await Query.countDocuments({
      expertId: req.user.userId,
      status: "Assigned",
    });

    res.json({
      totalQueries,
      pendingQueries,
      assignedQueries,
      resolvedQueries,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

exports.getAllQueries = async (req, res) => {
  try {
    const expertId = req.user.userId;

    const queries = await Query.find({
      $or: [
        { status: "In Review" },
        { expertId: expertId }
      ]
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

    res.json({
      message: "Case accepted successfully",
      query,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error accepting case" });
  }
};

exports.answerQuery = async (req, res) => {
  try {
    const { answer } = req.body;
    const { id } = req.params;

    const query = await Query.findById(id);

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    query.answer = answer;
    query.expertId = req.user.userId;
    query.status = "Assigned";

    await query.save();

    res.json({ message: "Answer submitted successfully", query });
  } catch (error) {
    res.status(500).json({ message: "Error answering query" });
  }
};

exports.resolveQuery = async (req, res) => {
  try {
    const { id } = req.params;

    const query = await Query.findById(id);

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    query.status = "Resolved";

    await query.save();

    res.json({ message: "Query resolved successfully", query });
  } catch (error) {
    res.status(500).json({ message: "Error resolving query" });
  }
};
