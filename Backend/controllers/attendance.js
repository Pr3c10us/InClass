const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Course = require("../models/course");
const Attendance = require("../models/attendance");
const { generateUniqueCode } = require("../utils/generateCode");
const { BadRequestError } = require("../errors");

const createAttendanceInstance = async (req, res) => {
  const { courseId } = req.body;
  if (!courseId) {
    throw new BadRequestError("Please provide course id");
  }
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new BadRequestError("Invalid course id");
  }
  const { id } = req.user;

  const course = await Course.findOne({
    _id: courseId,
    lecturer: id,
  });
  if (!course) {
    throw new BadRequestError("Course does not exist");
  }

  const code = await generateUniqueCode();

  const attendance = new Attendance({
    course: courseId,
    lecturer: id,
    code,
  });

  course.attendance.push(attendance._id);

  await attendance.save();
  await course.save();

  res.status(201).json({ attendance });
};

const deleteAttendanceInstance = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid attendance id");
  }

  const { id: lecturerId } = req.user;

  const attendance = await Attendance.findOne({
    _id: id,
  }).populate("course", "lecturer");

  if (!attendance) {
    throw new BadRequestError("Attendance does not exist");
  }

  if (attendance.course.lecturer._id.toString() !== lecturerId) {
    throw new ForbiddenError(
      "You are not authorized to delete this attendance"
    );
  }

  await Attendance.deleteOne({ _id: id });

  res.status(200).json({ msg: "Attendance deleted successfully" });
};

const deActivateAttendanceInstance = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid attendance id");
  }

  const { id: lecturerId } = req.user;

  const attendance = await Attendance.findOne({
    _id: id,
  });

  if (!attendance) {
    throw new BadRequestError("Attendance does not exist");
  }

  if (attendance.lecturer._id.toString() !== lecturerId) {
    throw new ForbiddenError(
      "You are not authorized to delete this attendance"
    );
  }

  await Attendance.updateOne({ _id: id }, { active: false });

  res.status(200).json({ msg: "Attendance deactivated successfully" });
};

const addStudentToAttendance = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid attendance id");
  }

  const { id: lecturerId } = req.user;

  const { token } = req.body;

  if (!token) {
    throw new BadRequestError("Please provide token");
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.ATTENDANCE_SECRET);
  } catch (error) {
    console.log(error);
    throw new BadRequestError(
      "Invalid token can not add student to attendance"
    );
  }

  const { id: attendanceId, studentId } = payload;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new BadRequestError("Invalid student id");
  }

  const attendance = await Attendance.findById(id).populate(
    "course",
    "lecturer students"
  );

  if (!attendance) {
    throw new BadRequestError("Attendance does not exist");
  }

  if (attendance.lecturer.toString() !== lecturerId) {
    throw new ForbiddenError(
      "You are not authorized to add student to this attendance"
    );
  }

  if (!attendance.active) {
    throw new BadRequestError("This attendance is no longer active");
  }

  if (attendance._id.toString() !== attendanceId) {
    throw new BadRequestError("Invalid Attendance ID");
  }

  if (!attendance.course.students.includes(studentId)) {
    throw new BadRequestError("Student does not belong to this course list");
  }

  if (attendance.students.includes(studentId)) {
    throw new BadRequestError("Student already added to attendance");
  }

  await Attendance.updateOne({ _id: id }, { $push: { students: studentId } });

  res.status(200).json({ msg: "Student added to attendance successfully" });
};

const authorizeStudent = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    throw new BadRequestError("Please provide code");
  }

  const { id } = req.user;

  const attendance = await Attendance.findOne({ code }).populate(
    "course",
    "students"
  );

  if (!attendance) {
    throw new BadRequestError("Invalid code");
  }

  if (!attendance.active) {
    throw new BadRequestError("This attendance is no longer active");
  }

  if (!attendance.course.students.includes(id)) {
    throw new BadRequestError("Student does not belong to this course list");
  }

  if (attendance.students.includes(id)) {
    throw new BadRequestError("Student already added to attendance");
  }

  const payload = {
    id: attendance._id,
    studentId: id,
  };

  const token = jwt.sign(payload, process.env.ATTENDANCE_SECRET, {
    expiresIn: "1d",
  });

  res.status(200).json({ msg: "Student authorized successfully", token });
};

module.exports = {
  createAttendanceInstance,
  deleteAttendanceInstance,
  deActivateAttendanceInstance,
  addStudentToAttendance,
  authorizeStudent,
};
