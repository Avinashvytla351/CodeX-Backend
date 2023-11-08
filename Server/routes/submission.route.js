let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const submissions = require("../controllers/submission.controller.js");

  // Retrieve submissions with contestId
  app.get(
    "/submissions/:questionId",
    middleware.checkToken,
    submissions.findAll
  );

  // Retrieve submissions with userId
  app.get(
    "/submissions/user/:username/:questionId",
    middleware.checkToken,
    submissions.findUser
  );

  //judge a submission(run)
  app.post("/runSubmission", middleware.checkToken, submissions.runSubmission)

  //judge a submission
  app.post("/validateSubmission", middleware.checkToken, submissions.validateSubmission);

  app.get("/submissions/gen/:questionId", submissions.genSource);

  app.get("/submission/profile/:username", submissions.findProfileData);
};
