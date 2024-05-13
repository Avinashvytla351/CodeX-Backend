const path = require("path");
const fs = require("fs");

// Function to save a single file
const saveFile = async (fileData, fileName) => {
  try {
    if (!fileData || !fileData.data) {
      throw new Error("Invalid file data provided");
    }

    // Extract necessary information from fileData
    const { name, data, size, mimetype } = fileData;
    let newName = name.split(".");
    newName = fileName + "." + newName[1];

    // Example path where you want to save the file
    const savePath = path.join(__dirname, "../uploads/", newName);

    // Write the file data to the specified path
    fs.writeFileSync(savePath, data);

    console.log("File saved successfully");
    return true;
  } catch (error) {
    console.error("Error saving file:", error.message);
    return false;
  }
};

module.exports = { saveFile };
