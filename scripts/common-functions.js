const fs = require('fs');
const path = require('path');

function importJson(filePath) {
  try {
      if (!fs.existsSync(filePath)) {
          throw new Error(`Json file in path: ${filePath}, doesn't exists.`);
      }
      return JSON.parse(fs.readFileSync(filePath).toString());
  } catch (e) {
      throw new Error(`Fail getting json file in path: ${filePath}. Error: ${e}`);
  }
}

module.exports = {
  importJson
}
