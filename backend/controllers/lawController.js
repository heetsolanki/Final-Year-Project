const Law = require("../models/Law");

// GET all laws
exports.getAllLaws = async (req, res) => {
  try {
    const laws = await Law.find();

    res.status(200).json(laws);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET single law
exports.getLawById = async (req, res) => {
  try {
    const law = await Law.findById(req.params.id);

    if (!law) {
      return res.status(404).json({ message: "Law not found" });
    }

    res.status(200).json(law);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
