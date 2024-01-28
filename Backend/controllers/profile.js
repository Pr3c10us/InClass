const Lecturer = require("../models/lecturer");
const Student = require("../models/student");

const getStudentDetails = async (req, res) => {
  const { id } = req.user;

  const student = await Student.findById(id).select("-password");

  res.json({ student });
};

const getLecturerDetails = async (req, res) => {
  const { id } = req.user;

  const student = await Lecturer.findById(id).select("-password");

  res.json({ student });
};
module.exports = {
  getStudentDetails,
  getLecturerDetails,
};
