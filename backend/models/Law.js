const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  sectionNumber: String,
  title: String,
  technicalExplanation: String,
  laymanExplanation: String,
  keywords: [String],
});

const lawSchema = new mongoose.Schema({
  actName: {
    type: String,
    required: true,
  },
  category: String,
  alias: String,
  year: Number,
  description: {
    technical: String,
    layman: String,
    short: String,
  },
  sections: [sectionSchema],
});

module.exports = mongoose.model("Law", lawSchema);
