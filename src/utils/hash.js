const CryptoJS = require("crypto-js");

function generateSHA256(content) {
  return CryptoJS.SHA256(content).toString();
}

module.exports = { generateSHA256 };
