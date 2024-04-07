const SubjectTag = require("../models/subjectTag.model.js");

const getOneSubjectTag = async (subjectTagId) => {
  try {
    const subjectTag = await SubjectTag.findOne({ subjectTagId: subjectTagId });
    return subjectTag;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const getOneSubjectTagByName = async (subjectTagName) => {
  try {
    const subjectTag = await SubjectTag.findOne({
      subjectTagName: subjectTagName,
    });
    return subjectTag;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const getAllSubjectTags = async () => {
  try {
    const subjectTags = await SubjectTag.find();
    return subjectTags;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const updateSubjectTag = async (subjectTagId, subjectTagName) => {
  try {
    const updatedSubjectTag = SubjectTag.findOneAndUpdate(
      { subjectTagId: subjectTagId },
      { $set: { subjectTagName: subjectTagName } },
      { new: true }
    );
    return updatedSubjectTag;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const deleteSubjectTag = async (subjectTagId) => {
  try {
    const deletedSubjectTag = SubjectTag.findOneAndDelete({
      subjectTagId: subjectTagId,
    });
    return deletedSubjectTag;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

module.exports = {
  getOneSubjectTag,
  getAllSubjectTags,
  updateSubjectTag,
  deleteSubjectTag,
  getOneSubjectTagByName,
};
