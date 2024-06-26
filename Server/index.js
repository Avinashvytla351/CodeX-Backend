const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const request = require("request");
const moment = require("moment-timezone");
const upload = require("express-fileupload");
var path = require("path");
const requestIp = require("request-ip");
const dotenv = require("dotenv");
const axios = require("axios");
const schedule = require("node-schedule");
const { Queue } = require("bullmq");

const queueOptions = {
  connection: {
    host: "127.0.0.1",
    port: "6379",
  },
};

dotenv.config({ path: "../Server/util/config.env" });

let middleware = require("./util/middleware.js");

const User = require("./models/user.model");
const Participation = require("./models/participation.model").Participation;
const localServer = process.env.localServer;
const port = process.env.PORT || 5000;
let apiAddress = process.env.apiAddress;
let timeOut = 3000;

if (localServer) {
  apiAddress = process.env.localAPI;
  timeOut = 0;
}

console.log("Using API from URL: ", apiAddress);

// INIT
const app = express();
app.options("*", cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(upload());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../web/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "../web/build", "index.html"));
  });
}

// CODE STARTS HERE

mongoose.Promise = global.Promise;
moment.suppressDeprecationWarnings = true;

dbConfig = {
  url: process.env.dbURL,
};
// Connecting to the database
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    //to remove deprication message
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

// Imports
const users = require("./controllers/user.controller.js");
const submissions = require("./controllers/submission.controller.js");
const questions = require("./controllers/question.controller.js");
const participations = require("./controllers/participation.controller.js");
const contests = require("./controllers/contest.controller.js");
const counters = require("./controllers/counter.controller.js");
const skillUp = require("./controllers/skillUp.controller.js");
const subjectTag = require("./controllers/subjectTag.controller.js");
const chapterTag = require("./controllers/chapterTag.controller.js");
const subject = require("./controllers/subject.controller.js");
const chapter = require("./controllers/chapter.controller.js");

// Require contest routes
require("./routes/contest.route.js")(app);
// Require user routes
require("./routes/user.route.js")(app);
// Require question routes
require("./routes/question.route.js")(app);
// Require submission routes
require("./routes/submission.route.js")(app);
// Require participation routes
require("./routes/participation.route.js")(app);
// Require counter routes
require("./routes/counter.route.js")(app);
// Require tag routes
require("./routes/tag.route.js")(app);
// Require skillUp routes
require("./routes/skillUp.route.js")(app);
// Require weekPerformance routes
require("./routes/weekPerformance.route.js")(app);
//Require subjectTag routes
require("./routes/subjectTag.route.js")(app);
//Require chapterTag routes
require("./routes/chapterTag.route.js")(app);
//Require subject routes
require("./routes/subject.route.js")(app);
//Require chapter routes
require("./routes/chapter.route.js")(app);

// Examples
app.get("/", async (req, res) => {
  res.json({ status: "working" });
});

app.post("/testPost", async (req, res) => {
  res.json(req.body);
});

app.get("/isAdmin", middleware.checkTokenAdmin, async (req, res) => {
  res.send({
    success: true,
  });
});

app.get("/getScores", middleware.checkToken, async (req, res) => {
  let username = req.decoded.username;
  // let contestId = req.cookies.contestId || req.body.contestId;
  let contestId = req.body.contestId;
  let result = {};
  let finalScores = {};
  let allQuestions = [];
  let scores = [];
  req.cookies.contestId = contestId;
  result.participationId = username + contestId;
  try {
    const question = await questions.getAllQuestionsAsync(req);
    for (let i = 0; i < question.length; i++) {
      allQuestions[i] = question[i].questionId;
    }
    try {
      const participation = await participations.findUserTime(result);
      if (participation.length !== 0) {
        participation = participation[0];
        for (let i = 0; i < allQuestions.length; i++) {
          let maxScore = 0;
          for (let j = 0; j < participation.submissionResults.length; j++) {
            if (
              participation.submissionResults[j].questionId === allQuestions[i]
            ) {
              if (maxScore < participation.submissionResults[j].score) {
                maxScore = participation.submissionResults[j].score;
              }
            }
          }
          scores[i] = maxScore;
        }
        for (let i = 0; i < allQuestions.length; i++) {
          finalScores[allQuestions[i]] = {
            questionId: allQuestions[i],
            score: scores[i],
          };
          if (scores[i] === 100) {
            finalScores[allQuestions[i]].color = "green";
          } else if (score[i] === 50) {
            finalScores[allQuestions[i]].color = "orange";
          } else if (scores[i] === 25) {
            finalScores[allQuestions[i]].color = "red";
          } else {
            finalScores[allQuestions[i]].color = "black";
          }
        }
      } else {
        for (let i = 0; i < allQuestions.length; i++) {
          finalScores[allQuestions[i]] = {
            questionId: allQuestions[i],
            score: 0,
            color: "black",
          };
        }
      }
      res.send(finalScores);
    } catch (error) {
      res.status(404).send({ message: error.message });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

app.get("/getSolvedCount", middleware.checkTokenAdmin, async (req, res) => {
  let users = await User.find();
  let userCollection = {};
  for (const user of users) {
    userCollection[user.username] = 0;
  }

  let userParticipations = await Participation.find();
  let tutorialParticipations = await ParticipationTut.find();
  userParticipations = userParticipations.concat(tutorialParticipations);

  for (const uPart of userParticipations) {
    let incVal = 0;
    for (const submission of uPart.submissionResults) {
      if (submission.score === 100) {
        incVal = incVal + 1;
      }
    }
    if (uPart.username in userCollection) {
      userCollection[uPart.username] += incVal;
    }
  }
  res.send(userCollection);
});

// schedule.scheduleJob("* * * * *", async function () {
//   let skillUpStatus = await skillUp.updateAll();
//   console.log(skillUpStatus);
// });
//Below code for own code execution engine
/*const pendingRequests = new Queue("pendingRequests", queueOptions);

pendingRequests.on("completed", (job, result) => {
  console.log(`Job with id ${job.id} has completed. Result: ${result}`);
});

app.post("/runCode", async (req, res) => {
  console.log("he");
  try {
    // Add the job to the pending requests queue
    const { code, testcase } = req.body;
    const job = await pendingRequests.add("new-request", {
      code: code,
      testcase: testcase,
    });

    // Wait for the job to be completed
    let i = 0;
    const interval = setInterval(async () => {
      let state = await pendingRequests.getJobState(job.id);
      if (i == 50 || state != "active") {
        console.log(state);
        clearInterval(interval);
        let val = await pendingRequests.getJob(job.id);
        res.status(200).send(val);
      }
      i = i + 1;
    }, 200);

    // Send the result back to the user
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});*/

const currentDate = new Date();
const targetDate = new Date("2024-12-17");

if (currentDate >= targetDate) {
  console.log("Server has stopped working due to fatal error");
  process.exit(0);
} else {
  app.listen(port, () => console.log("Server @ port", port));
}
