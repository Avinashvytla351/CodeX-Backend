const Subject = require("../models/subject.model.js");

const getOneSubject = async (subjectId) => {
  try {
    const subject = await Subject.findOne({ subjectId: subjectId });
    return subject;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const getOneSubjectByName = async (subjectName) => {
  try {
    const subject = await Subject.findOne({
      subjectName: subjectName,
    });
    return subject;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const getAllSubjects = async () => {
  try {
    const subjects = await Subject.find();
    return subjects;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const updateSubject = async (
  subjectId,
  subjectName,
  subjectTagId,
  subjectTagName
) => {
  try {
    const updatedSubject = Subject.findOneAndUpdate(
      { subjectId: subjectId },
      {
        $set: {
          subjectName: subjectName,
          subjectTagId: subjectTagId,
          subjectTagName: subjectTagName,
        },
      },
      { new: true }
    );
    return updatedSubject;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const deleteSubject = async (subjectId) => {
  try {
    const deletedSubject = Subject.findOneAndDelete({
      subjectId: subjectId,
      chaptersCount: 0,
      questionsCount: 0,
    });
    return deletedSubject;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

module.exports = {
  getOneSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
  getOneSubjectByName,
};
