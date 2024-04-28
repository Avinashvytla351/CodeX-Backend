const Chapter = require("../models/chapter.model.js");

const getOneChapter = async (chapterId) => {
  try {
    const chapter = await Chapter.findOne({ chapterId: chapterId });
    return chapter;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const getOneChapterByName = async (chapterName) => {
  try {
    const chapter = await Chapter.findOne({
      chapterName: chapterName,
    });
    return chapter;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const getAllChapters = async () => {
  try {
    const chapters = await Chapter.find();
    return chapters;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const updateChapter = async (
  chapterId,
  chapterName,
  chapterTagId,
  chapterTagName,
  subjectId,
  subjectName
) => {
  try {
    const updatedChapter = Chapter.findOneAndUpdate(
      { chapterId: chapterId },
      {
        $set: {
          chapterName: chapterName,
          chapterTagId: chapterTagId,
          chapterTagName: chapterTagName,
          subjectId: subjectId,
          subjectName: subjectName,
        },
      },
      { new: true }
    );
    return updatedChapter;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

const deleteChapter = async (chapterId) => {
  try {
    const deletedChapter = Chapter.findOneAndDelete({
      chapterId: chapterId,
      questionsCount: 0,
    });
    return deletedChapter;
  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
};

module.exports = {
  getOneChapter,
  getAllChapters,
  updateChapter,
  deleteChapter,
  getOneChapterByName,
};
