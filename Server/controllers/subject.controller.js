const Subject = require("../models/subject.model.js");

const responseUtil = require("../services/responseUtil.js");
const subjectUtil = require("../services/subjectUtil.js");
const subjectTagUtil = require("../services/subjectTagUtil.js");

//Create a new subject tag
exports.createSubject = async (req, res) => {
  try {
    let name = "";
    let split = req.body.subjectName.split(" ");
    split.forEach((item, index) => {
      if (item.length > 0 && item[0] != " ") {
        name += item.charAt(0).toUpperCase() + item.slice(1);
      }
      if (index != split.length - 1) {
        name += " ";
      }
    });
    const checkSubject = await subjectUtil.getOneSubjectByName(name);
    if (!checkSubject) {
      const subjectTag = await subjectTagUtil.getOneSubjectTag(
        req.body.subjectTagId
      );
      if (subjectTag) {
        const subject = new Subject({
          subjectName: name,
          subjectTagId: subjectTag.subjectTagId,
          subjectTagName: subjectTag.subjectTagName,
        });
        const newSubject = await subject.save();

        return responseUtil.sendResponse(
          res,
          true,
          newSubject,
          "Created Subject Successfully",
          201
        );
      } else {
        return responseUtil.sendResponse(
          res,
          true,
          "",
          "Subject Tag not found",
          400
        );
      }
    } else {
      return responseUtil.sendResponse(
        res,
        true,
        "",
        "Subject Already exists",
        400
      );
    }
  } catch (error) {
    return responseUtil.sendResponse(
      res,
      false,
      null,
      "Subject creation failed due to " + error.message,
      500
    );
  }
};

//Get one subject tag based on the subject tag Id
exports.getSubject = async (req, res) => {
  try {
    const subject = await subjectUtil.getOneSubject(req.params.subjectId);

    return responseUtil.sendResponse(
      res,
      true,
      subject,
      "Fetched Subject Successfully",
      200
    );
  } catch (error) {
    return responseUtil.sendResponse(
      res,
      false,
      null,
      "Failed to fetch Subject due to " + error.message,
      500
    );
  }
};

//Get all the subject tags
exports.getAllSubject = async (req, res) => {
  try {
    const subjects = await subjectUtil.getAllSubjects();
    return responseUtil.sendResponse(
      res,
      true,
      subjects,
      "Fetched Subjects Successfully",
      200
    );
  } catch (error) {
    return responseUtil.sendResponse(
      res,
      false,
      null,
      "Failed to fetch Subjects due to " + error.message,
      500
    );
  }
};

//Update one subject tag based on the subject tag Id
exports.updateSubject = async (req, res) => {
  try {
    const subjectTag = await subjectTagUtil.getOneSubjectTag(
      req.body.subjectTagId
    );
    if (subjectTag) {
      let name = "";
      let split = req.body.subjectName.split(" ");
      split.forEach((item, index) => {
        if (item.length > 0 && item[0] != " ") {
          name += item.charAt(0).toUpperCase() + item.slice(1);
        }
        if (index != split.length - 1) {
          name += " ";
        }
      });
      const subject = await subjectUtil.updateSubject(
        req.params.subjectId,
        name,
        subjectTag.subjectTagId,
        subjectTag.subjectTagName
      );

      return responseUtil.sendResponse(
        res,
        true,
        subject,
        "Updated Subject Successfully",
        200
      );
    } else {
      return responseUtil.sendResponse(
        res,
        true,
        "",
        "Update failed: Subject tag not found",
        400
      );
    }
  } catch (error) {
    return responseUtil.sendResponse(
      res,
      false,
      null,
      "Failed to update Subject due to " + error.message,
      500
    );
  }
};

//Delete Subject Tag based on the subject tag ID
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await subjectUtil.deleteSubject(req.params.subjectId);
    return responseUtil.sendResponse(
      res,
      true,
      subject,
      "Deleted Subject Successfully",
      200
    );
  } catch (error) {
    return responseUtil.sendResponse(
      res,
      false,
      null,
      "Failed to delete Subject due to " + error.message,
      500
    );
  }
};
