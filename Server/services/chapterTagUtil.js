const ChapterTag = require("../models/chapterTag.model.js");

const getOneChapterTag = async (chapterTagId) => {
  try {
    const chapterTag = await ChapterTag.findOne({ chapterTagId: chapterTagId });
    return chapterTag;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const getOneChapterTagByName = async (chapterTagName) => {
  try {
    const chapterTag = await ChapterTag.findOne({
      chapterTagName: chapterTagName,
    });
    return chapterTag;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const getAllChapterTags = async () => {
  try {
    const chapterTags = await ChapterTag.find();
    return chapterTags;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const updateChapterTag = async (chapterTagId, chapterTagName) => {
  try {
    const updatedChapterTag = ChapterTag.findOneAndUpdate(
      { chapterTagId: chapterTagId },
      { $set: { chapterTagName: chapterTagName } },
      { new: true }
    );
    return updatedChapterTag;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const deleteChapterTag = async (chapterTagId) => {
  try {
    const deletedChapterTag = ChapterTag.findOneAndDelete({
      chapterTagId: chapterTagId,
    });
    return deletedChapterTag;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

module.exports = {
  getOneChapterTag,
  getAllChapterTags,
  updateChapterTag,
  deleteChapterTag,
  getOneChapterTagByName,
};
