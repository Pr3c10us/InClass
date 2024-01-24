const Attendance = require("../models/attendance");

// create function to generate random string
function generateRandomString(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset.charAt(randomIndex);
  }
  return result;
}

async function generateUniqueCode() {
  let code = generateRandomString(6);
  let exists = await Attendance.exists({ code });

  while (exists) {
    code = generateRandomString(6);
    exists = await Attendance.exists({ code });
  }

  return code;
}

// export randomString
module.exports = { generateUniqueCode };
