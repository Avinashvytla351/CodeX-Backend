// MONGOOSE SCHEMA
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

var Schema = mongoose.Schema;

var chapterSchema = new Schema({
  chapterId: {
    type: String,
    required: true,
    default: uuidv4,
  },
  chapterName: String,
  chapterTagId: String,
  subjectId: String,
  subjectName: String,
  chapterTagName: String,
  questionsCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Chapter", chapterSchema);
