const questionUtil = require("./questionUtil");
const participationUtil = require("./participationUtil");
const submissionUtil = require("./submissionUtil");

const dotenv = require("dotenv");
const axios = require("axios");
const { duration } = require("moment-timezone");

dotenv.config({ path: "../Server/util/config.env" });

const apiAddress = process.env.localAPI;
const postUrl = apiAddress + "/submissions";
var retryCount = process.env.retryCount || 30;
const waitTime = process.env.waitTime || 1000;

const languageIds = {
  python: 71,
  cpp: 54,
  c: 50,
  java: 62,
};

const getSubmissionStatus = async (options) => {
  try {
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error;
  }
};
const getSubmissionToken = async (options) => {
  try {
    const response = await axios(options);
    return response.data.token;
  } catch (error) {
    throw error;
  }
};

const runSubmission = async (data) => {
  var options = {};
  if (data.isRun) {
    options = {
      method: "post",
      data: {
        source_code: data.sourceCode,
        language_id: data.languageId,
        stdin: btoa(data.input),
        compiler_options: null,
      },
      url: postUrl + "?base64_encoded=true&wait=false",
    };
  } else {
    options = {
      method: "post",
      data: {
        source_code: data.sourceCode,
        language_id: data.languageId,
        stdin: btoa(data.input),
        compiler_options: null,
        expected_output: btoa(data.output),
      },
      url: postUrl + "?base64_encoded=true&wait=false",
    };
  }

  const token = await getSubmissionToken(options);
  const timedOutResponse = {
    stdout: null,
    time: null,
    memory: null,
    stderr: btoa("Response Timed Out"),
    token: null,
    compile_output: null,
    message: null,
    status: {
      description: "Timed Out, Please run your submission after some time",
    },
  };

  const maxDuration = 5000; // Adjust as needed
  const waitTime = 250;
  let duration = 0;

  try {
    const pollSubmissionStatus = async () => {
      const statusOption = {
        url: apiAddress + "/submissions/" + token,
        method: "get",
      };

      try {
        const statusResponse = await getSubmissionStatus(statusOption);

        if (
          statusResponse.data.status.description !== "In Queue" &&
          statusResponse.data.status.description !== "Processing"
        ) {
          statusResponse.data.retryCount = duration / waitTime;
          return statusResponse.data;
        } else if (duration >= maxDuration) {
          return timedOutResponse;
        } else {
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          duration += waitTime;
          return pollSubmissionStatus();
        }
      } catch (error) {
        throw error;
      }
    };

    return await pollSubmissionStatus();
  } catch (error) {
    throw error;
  }
};

const sendRequestsToJudge = async (testcases, data) => {
  try {
    data.languageId = languageIds[data.codeLanguage];
    if (data.isRun) {
      const submission = await runSubmission(data);
      return submission;
    } else {
      let newData = {};
      let results = [];
      for (var i = 0; i < testcases.length; i++) {
        (newData.sourceCode = data.sourceCode),
          (newData.languageId = data.languageId),
          (newData.input = testcases[i].Input),
          (newData.output = testcases[i].Output);

        const submission = await runSubmission(newData);
        results.push(submission);
      }
      // Calculate the score
      var score = 0;
      const correctSubmission = Number(
        results.filter((result) => result.status.description === "Accepted")
          .length
      );

      if (!data.isCheck) {
        switch (correctSubmission) {
          case 1:
            score = 25;
            break;
          case 2:
            score = 50;
            break;
          case 3:
            score = 100;
            break;
          default:
            score = 0;
        }

        data.score = score;
        data.submissionTokens = tokens;
        data.participationId = data.username + data.contestId;
        data.retryCount = retryCount;
        // Update the participation score
        const participation = await participationUtil.modifyScore(data);
        return data;
      } else {
        return correctSubmission == testcases.length;
      }
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendRequestsToJudge,
};
