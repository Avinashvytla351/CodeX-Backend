// MONGOOSE SCHEMA
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

var Schema = mongoose.Schema;

var subjectSchema = new Schema({
  subjectId: {
    type: String,
    required: true,
    default: uuidv4,
  },
  subjectName: String,
  subjectTagId: String,
  subjectTagName: String,
  chaptersCount: {
    type: Number,
    default: 0,
  },
  questionsCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Contest", subjectSchema);
