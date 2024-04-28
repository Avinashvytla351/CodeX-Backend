const SubjectTag = require("../models/subjectTag.model.js");

const responseUtil = require("../services/responseUtil.js");
const subjectTagUtil = require("../services/subjectTagUtil.js");

//Create a new subject tag
exports.createSubjectTag = async (req, res) => {
  try {
    let name = "";
    let split = req.body.subjectTagName.split(" ");
    split.forEach((item, index) => {
      if (item.length > 0 && item[0] != " ") {
        name += item.charAt(0).toUpperCase() + item.slice(1);
      }
      if (index != split.length - 1) {
        name += " ";
      }
    });
    const checkSubjectTag = await subjectTagUtil.getOneSubjectTagByName(name);
    if (!checkSubjectTag) {
      const subjectTag = new SubjectTag({
        subjectTagName: name,
      });
      const newSubjectTag = await subjectTag.save();

      return responseUtil.sendResponse(
        res,
        true,
        newSubjectTag,
        "Created Subject-Tag Successfully",
        201
      );
    } else {
      return responseUtil.sendResponse(
        res,
        true,
        "",
        "Subject-Tag Already exists",
        400
      );
    }
  } catch (error) {
    return responseUtil.sendResponse(
      res,
      false,
      null,
      "Subject-Tag creation failed due to " + error.message,
      500
    );
  }
};

//Get one subject tag based on the subject tag Id
exports.getSubjectTag = async (req, res) => {
  try {
    const subjectTag = await subjectTagUtil.getOneSubjectTag(
      req.params.subjectTagId
    );

    return responseUtil.sendResponse(
      res,
      true,
      subjectTag,
      "Fetched Subject-Tag Successfully",
      200
    );
  } catch (error) {
    return responseUtil.sendResponse(
      res,
      false,
      null,
      "Failed to fetch Subject-Tag due to " + error.message,
      500
    );
  }
};

//Get all the subject tags
exports.getAllSubjectTag = async (req, res) => {
  try {
    const subjectTags = await subjectTagUtil.getAllSubjectTags();
    return responseUtil.sendResponse(
      res,
      true,
      subjectTags,
      "Fetched Subject-Tags Successfully",
      200
    );
  } catch (error) {
    return responseUtil.sendResponse(
      res,
      false,
      null,
      "Failed to fetch Subject-Tags due to " + error.message,
      500
    );
  }
};

//Update one subject tag based on the subject tag Id
exports.updateSubjectTag = async (req, res) => {
  try {
    let name = "";
    let split = req.body.subjectTagName.split(" ");
    split.forEach((item, index) => {
      if (item.length > 0 && item[0] != " ") {
        name += item.charAt(0).toUpperCase() + item.slice(1);
      }
      if (index != split.length - 1) {
        name += " ";
      }
    });
    const subjectTag = await subjectTagUtil.updateSubjectTag(
      req.params.subjectTagId,
      name
    );

    return responseUtil.sendResponse(
      res,
      true,
      subjectTag,
      "Updated Subject-Tag Successfully",
      200
    );
  } catch (error) {
    return responseUtil.sendResponse(
      res,
      false,
      null,
      "Failed to update Subject-Tag due to " + error.message,
      500
    );
  }
};

//Delete Subject Tag based on the subject tag ID
exports.deleteSubjectTag = async (req, res) => {
  try {
    const subjectTag = await subjectTagUtil.deleteSubjectTag(
      req.params.subjectTagId
    );
    return responseUtil.sendResponse(
      res,
      true,
      subjectTag,
      "Deleted Subject-Tag Successfully",
      200
    );
  } catch (error) {
    return responseUtil.sendResponse(
      res,
      false,
      null,
      "Failed to delete Subject-Tag due to " + error.message,
      500
    );
  }
};
