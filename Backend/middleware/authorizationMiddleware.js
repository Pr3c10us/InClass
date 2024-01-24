const { UnAuthorizedError } = require("../errors");
const Lecturer = require("../models/lecturer");
const Student = require("../models/student");
const jwt = require("jsonwebtoken");

const lecturerAuthorize = async (req, res, next) => {
  const { lecturerToken: token } = req.signedCookies;
  if (!token) {
    throw new UnAuthorizedError("Missing Token");
  }
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const lecturerExist = await Lecturer.findById(id);
    if (!lecturerExist) {
      throw new UnAuthorizedError("Invalid Token");
    }
    req.user = { id };
    next();
  } catch (error) {
    console.log(error);
    throw new UnAuthorizedError("Authentication failed");
  }
};

const studentAuthorize = async (req, res, next) => {
  const { studentToken: token } = req.signedCookies;
  if (!token) {
    throw new UnAuthorizedError("Missing Token");
  }
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const studentExist = await Student.findById(id);
    if (!studentExist) {
      throw new UnAuthorizedError("Invalid Token");
    }
    req.user = { id };
    next();
  } catch (error) {
    throw new UnAuthorizedError("Authentication failed");
  }
};

module.exports = { lecturerAuthorize, studentAuthorize };
