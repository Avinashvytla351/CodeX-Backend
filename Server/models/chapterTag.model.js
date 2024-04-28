// MONGOOSE SCHEMA
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

var Schema = mongoose.Schema;

var chapterTagSchema = new Schema({
  chapterTagId: {
    type: String,
    required: true,
    default: uuidv4,
  },
  chapterTagName: String,
});

module.exports = mongoose.model("ChapterTag", chapterTagSchema);
