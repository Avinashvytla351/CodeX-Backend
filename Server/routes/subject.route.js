let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const subjects = require("../controllers/subject.controller.js");

  //Create new subject tag
  app.post("/subject", middleware.checkTokenAdmin, subjects.createSubject);

  //Update a subject tag
  app.put(
    "/subject/:subjectId",
    middleware.checkTokenAdmin,
    subjects.updateSubject
  );

  //Get a single subject tag
  app.get(
    "/subject/:subjectId",
    middleware.checkTokenAdmin,
    subjects.getSubject
  );

  //Get all subject tags
  app.get("/subjects", middleware.checkTokenAdmin, subjects.getAllSubject);

  //Delete a subject tag
  app.delete(
    "/subject/:subjectId",
    middleware.checkTokenAdmin,
    subjects.deleteSubject
  );
};
