let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const chapterTags = require("../controllers/chapterTag.controller.js");

  //Create new chapter tag
  app.post(
    "/chapterTag",
    middleware.checkTokenAdmin,
    chapterTags.createChapterTag
  );

  //Update a chapter tag
  app.put(
    "/chapterTag/:chapterTagId",
    middleware.checkTokenAdmin,
    chapterTags.updateChapterTag
  );

  //Get a single chapter tag
  app.get(
    "/chapterTag/:chapterTagId",
    middleware.checkTokenAdmin,
    chapterTags.getChapterTag
  );

  //Get all chapter tags
  app.get(
    "/chapterTags",
    middleware.checkTokenAdmin,
    chapterTags.getAllChapterTag
  );

  //Delete a chapter tag
  app.delete(
    "/chapterTag/:chapterTagId",
    middleware.checkTokenAdmin,
    chapterTags.deleteChapterTag
  );
};
