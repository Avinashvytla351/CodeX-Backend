let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const chapters = require("../controllers/chapter.controller.js");

  //Create new chapter tag
  app.post("/chapter", middleware.checkTokenAdmin, chapters.createChapter);

  //Update a chapter tag
  app.put(
    "/chapter/:chapterId",
    middleware.checkTokenAdmin,
    chapters.updateChapter
  );

  //Get a single chapter tag
  app.get(
    "/chapter/:chapterId",
    middleware.checkTokenAdmin,
    chapters.getChapter
  );

  //Get all chapter tags
  app.get("/chapters", middleware.checkTokenAdmin, chapters.getAllChapter);

  //Delete a chapter tag
  app.delete(
    "/chapter/:chapterId",
    middleware.checkTokenAdmin,
    chapters.deleteChapter
  );
};
