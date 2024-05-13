const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var questionSchema = new Schema({
  questionId: String,
  questionName: String,
  questionDescriptionText: String,
  questionInputText: String,
  questionOutputText: String,
  questionExampleTestcase: Array,
  questionHiddenTestcase: Array,
  questionExplanation: String,
  author: String,
  difficulty: {
    type: String,
    default: "Medium",
  },
  company: Array,
  topic: Array,
  image: String,
  subjectName: String,
  subjectId: String,
  chapterName: String,
  chapterId: String,
  code: String,
  codeLanguange: String,
  //mcq attributes
  isMcq: {
    type: Boolean,
    default: false,
  },
  options: Array,
  correctOption: String,
  validated: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Question", questionSchema);
