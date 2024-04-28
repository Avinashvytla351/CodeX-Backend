const Chapter = require("../models/chapter.model.js");

const responseUtil = require("../services/responseUtil.js");
const chapterUtil = require("../services/chapterUtil.js");
const chapterTagUtil = require("../services/chapterTagUtil.js");
const Subject = require("../models/subject.model.js");

//Create a new chapter tag
exports.createChapter = async (req, res) => {
  try {
    let name = "";
    let split = req.body.chapterName.split(" ");
    split.forEach((item, index) => {
      if (item.length > 0 && item[0] != " ") {
        name += item.charAt(0).toUpperCase() + item.slice(1);
      }
      if (index != split.length - 1) {
        name += " ";
      }
    });
    const checkChapter = await chapterUtil.getOneChapterByName(name);
    if (!checkChapter) {
      const chapterTag = await chapterTagUtil.getOneChapterTag(
        req.body.chapterTagId
      );
      if (chapterTag) {
        const subject = await Subject.find({ subjectId: req.body.subjectId });
        if (subject.length > 0) {
          const chapter = new Chapter({
            chapterName: name,
            chapterTagId: chapterTag.chapterTagId,
            chapterTagName: chapterTag.chapterTagName,
            subjectId: subject[0].subjectId,
            subjectName: subject[0].subjectName,
          });
          const newChapter = await chapter.save();
          const updateSubject = await Subject.findOneAndUpdate(
            { subjectId: subject[0].subjectId },
            { $set: { chaptersCount: Number(subject[0].chaptersCount) + 1 } },
            { new: true }
          );

          return responseUtil.sendResponse(
            res,
            true,
            newChapter,
            "Created Chapter Successfully",
            201
          );
        } else {
          return responseUtil.sendResponse(
            res,
            true,
            "",
            "Assigned Subject not found",
            400
          );
        }
      } else {
        return responseUtil.sendResponse(
          res,
          true,
          "",
          "Chapter Tag not found",
          400
        );
      }
    } else {
      return responseUtil.sendResponse(
        res,
        true,
        "",
        "Chapter Already exists",
        400
      );
    }
  } catch (error) {
    return responseUtil.sendResponse(
      res,
      false,
      null,
      "Chapter creation failed due to " + error.message,
      500
    );
  }
};

//Get one chapter tag based on the chapter tag Id
exports.getChapter = async (req, res) => {
  try {
    const chapter = await chapterUtil.getOneChapter(req.params.chapterId);

    return responseUtil.sendResponse(
      res,
      true,
      chapter,
      "Fetched Chapter Successfully",
      200
    );
  } catch (error) {
    return responseUtil.sendResponse(
      res,
      false,
      null,
      "Failed to fetch Chapter due to " + error.message,
      500
    );
  }
};

//Get all the chapter tags
exports.getAllChapter = async (req, res) => {
  try {
    const chapters = await chapterUtil.getAllChapters();
    return responseUtil.sendResponse(
      res,
      true,
      chapters,
      "Fetched Chapters Successfully",
      200
    );
  } catch (error) {
    return responseUtil.sendResponse(
      res,
      false,
      null,
      "Failed to fetch Chapters due to " + error.message,
      500
    );
  }
};

//Update one chapter tag based on the chapter tag Id
exports.updateChapter = async (req, res) => {
  try {
    const chapterTag = await chapterTagUtil.getOneChapterTag(
      req.body.chapterTagId
    );
    const subject = await Subject.findOne({ subjectId: req.body.subjectId });
    const chapterVal = await chapterUtil.getOneChapter(req.params.chapterId);
    if (chapterTag && subject && chapterVal) {
      let name = "";
      let split = req.body.chapterName.split(" ");
      split.forEach((item, index) => {
        if (item.length > 0 && item[0] != " ") {
          name += item.charAt(0).toUpperCase() + item.slice(1);
        }
        if (index != split.length - 1) {
          name += " ";
        }
      });
      const chapter = await chapterUtil.updateChapter(
        req.params.chapterId,
        name,
        chapterTag.chapterTagId,
        chapterTag.chapterTagName,
        subject.subjectId,
        subject.subjectName
      );
      if (chapter) {
        //Update the chapter counts for the subjects
        if (chapterVal.subjectId != subject.subjectId) {
          const updatedSubject1 = await Subject.findOneAndUpdate(
            { subjectId: chapterVal.subjectId, chaptersCount: { $gt: 0 } }, // Ensure chaptersCount is greater than 0
            { $inc: { chaptersCount: -1 } }, // Decrement chaptersCount by 1
            { new: true } // Return the updated document
          );

          const updatedSubject2 = await Subject.findOneAndUpdate(
            { subjectId: subject.subjectId },
            { $inc: { chaptersCount: 1 } }, // Increment chaptersCount by 1
            { new: true } // Return the updated document
          );
        }

        return responseUtil.sendResponse(
          res,
          true,
          chapter,
          "Updated Chapter Successfully",
          200
        );
      } else {
        return responseUtil.sendResponse(
          res,
          true,
          "",
          "Update failed: Chapter not found",
          400
        );
      }
    } else {
      return responseUtil.sendResponse(
        res,
        true,
        "",
        "Update failed: Chapter tag not found",
        400
      );
    }
  } catch (error) {
    return responseUtil.sendResponse(
      res,
      false,
      null,
      "Failed to update Chapter due to " + error.message,
      500
    );
  }
};

//Delete Chapter Tag based on the chapter tag ID
exports.deleteChapter = async (req, res) => {
  try {
    const chapterVal = await chapterUtil.getOneChapter(req.params.chapterId);
    const chapter = await chapterUtil.deleteChapter(req.params.chapterId);
    if (chapter) {
      //Reduce the chapter count from the subject when the chapter is deleted
      const subjectId = chapterVal.subjectId;
      const updatedSubject = await Subject.findOneAndUpdate(
        { subjectId: subjectId, chaptersCount: { $gt: 0 } }, // Ensure chaptersCount is greater than 0
        { $inc: { chaptersCount: -1 } }, // Decrement chaptersCount by 1
        { new: true } // Return the updated document
      );
    }
    if (chapter) {
      return responseUtil.sendResponse(
        res,
        true,
        chapter,
        "Deleted Chapter Successfully",
        200
      );
    } else {
      return responseUtil.sendResponse(
        res,
        false,
        null,
        "Chapter not found to delete",
        400
      );
    }
  } catch (error) {
    return responseUtil.sendResponse(
      res,
      false,
      null,
      "Failed to delete Chapter due to " + error.message,
      500
    );
  }
};
