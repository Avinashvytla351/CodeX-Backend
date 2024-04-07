let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const subjectTags = require("../controllers/subjectTag.controller.js");

  //Create new subject tag
  app.post(
    "/subjectTag",
    middleware.checkTokenAdmin,
    subjectTags.createSubjectTag
  );

  //Update a subject tag
  app.put(
    "/subjectTag/:subjectTagId",
    middleware.checkTokenAdmin,
    subjectTags.updateSubjectTag
  );

  //Get a single subject tag
  app.get(
    "/subjectTag/:subjectTagId",
    middleware.checkTokenAdmin,
    subjectTags.getSubjectTag
  );

  //Get all subject tags
  app.get(
    "/subjectTags",
    middleware.checkTokenAdmin,
    subjectTags.getAllSubjectTag
  );

  //Delete a subject tag
  app.delete(
    "/subjectTag/:subjectTagId",
    middleware.checkTokenAdmin,
    subjectTags.deleteSubjectTag
  );
};
