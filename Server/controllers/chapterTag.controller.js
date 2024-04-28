const ChapterTag = require("../models/chapterTag.model.js");

const responseUtil = require("../services/responseUtil.js");
const chapterTagUtil = require("../services/chapterTagUtil.js");

//Create a new chapter tag
exports.createChapterTag = async (req, res) => {
  try {
    let name = "";
    let split = req.body.chapterTagName.split(" ");
    split.forEach((item, index) => {
      if (item.length > 0 && item[0] != " ") {
        name += item.charAt(0).toUpperCase() + item.slice(1);
      }
      if (index != split.length - 1) {
        name += " ";
      }
    });
    const checkChapterTag = await chapterTagUtil.getOneChapterTagByName(name);
    if (!checkChapterTag) {
      const chapterTag = new ChapterTag({
        chapterTagName: name,
      });
      const newChapterTag = await chapterTag.save();

      return responseUtil.sendResponse(
        res,
        true,
        newChapterTag,
        "Created Chapter-Tag Successfully",
        201
      );
    } else {
      return responseUtil.sendResponse(
        res,
        true,
        "",
        "Chapter-Tag Already exists",
        400
      );
    }
  } catch (error) {
    return responseUtil.sendResponse(
      res,
      false,
      null,
      "Chapter-Tag creation failed due to " + error.message,
      500
    );
  }
};

//Get one chapter tag based on the chapter tag Id
exports.getChapterTag = async (req, res) => {
  try {
    const chapterTag = await chapterTagUtil.getOneChapterTag(
      req.params.chapterTagId
    );

    return responseUtil.sendResponse(
      res,
      true,
      chapterTag,
      "Fetched Chapter-Tag Successfully",
      200
    );
  } catch (error) {
    return responseUtil.sendResponse(
      res,
      false,
      null,
      "Failed to fetch Chapter-Tag due to " + error.message,
      500
    );
  }
};

//Get all the chapter tags
exports.getAllChapterTag = async (req, res) => {
  try {
    const chapterTags = await chapterTagUtil.getAllChapterTags();
    return responseUtil.sendResponse(
      res,
      true,
      chapterTags,
      "Fetched Chapter-Tags Successfully",
      200
    );
  } catch (error) {
    return responseUtil.sendResponse(
      res,
      false,
      null,
      "Failed to fetch Chapter-Tags due to " + error.message,
      500
    );
  }
};

//Update one chapter tag based on the chapter tag Id
exports.updateChapterTag = async (req, res) => {
  try {
    const chapterTag = await chapterTagUtil.updateChapterTag(
      req.params.chapterTagId,
      req.body.chapterTagName
    );

    return responseUtil.sendResponse(
      res,
      true,
      chapterTag,
      "Updated Chapter-Tag Successfully",
      200
    );
  } catch (error) {
    return responseUtil.sendResponse(
      res,
      false,
      null,
      "Failed to update Chapter-Tag due to " + error.message,
      500
    );
  }
};

//Delete Chapter Tag based on the chapter tag ID
exports.deleteChapterTag = async (req, res) => {
  try {
    const chapterTag = await chapterTagUtil.deleteChapterTag(
      req.params.chapterTagId
    );
    console.log(req.params.chapterTagId);
    return responseUtil.sendResponse(
      res,
      true,
      chapterTag,
      "Deleted Chapter-Tag Successfully",
      200
    );
  } catch (error) {
    return responseUtil.sendResponse(
      res,
      false,
      null,
      "Failed to delete Chapter-Tag due to " + error.message,
      500
    );
  }
};
