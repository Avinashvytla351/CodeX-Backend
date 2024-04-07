// MONGOOSE SCHEMA
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

var Schema = mongoose.Schema;

var subjectTagSchema = new Schema({
  subjectTagId: {
    type: String,
    required: true,
    default: uuidv4,
  },
  subjectTagName: String,
});

module.exports = mongoose.model("SubjectTag", subjectTagSchema);
