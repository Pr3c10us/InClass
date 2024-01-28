const mongoose = require("mongoose");
const { BadRequestError } = require("../errors");
const Course = require("../models/course");
const Lecturer = require("../models/lecturer");
const Student = require("../models/student");

const addCourse = async (req, res) => {
  const { title, description, courseCode } = req.body;
  if ((!title || !description, !courseCode)) {
    throw new BadRequestError("Please provide all details");
  }

  const { id } = req.user;

  const lowerCaseTitle = title.toLowerCase();

  const courseExist = await Course.findOne({
    title: lowerCaseTitle,
    lecturer: id,
  });

  if (courseExist) {
    throw new BadRequestError("Course already exists");
  }

  const course = new Course({
    title: lowerCaseTitle,
    description,
    courseCode,
    lecturer: id,
  });

  const lecturer = await Lecturer.findById(id);
  lecturer.courses.push(course._id);

  await lecturer.save();
  await course.save();

  res.status(201).json({ course });
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;
  const { id: lecturerId } = req.user;

  const course = await Course.findOne({
    _id: id,
    lecturer: lecturerId,
  });

  if (!course) {
    throw new BadRequestError("Course does not exist");
  }

  const lecturer = await Lecturer.findById(lecturerId);

  lecturer.courses = lecturer.courses.filter(
    (courseId) => courseId.toString() !== id
  );

  await Course.deleteOne({ _id: id });
  await lecturer.save();

  res.status(200).json({ msg: "Course deleted successfully" });
};

const addStudentToCourse = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid course id");
  }

  let { studentMatric } = req.body;
  if (!studentMatric) {
    throw new BadRequestError("Please provide student id");
  }
  studentMatric = studentMatric.toLowerCase();
  const matricNumberRegex = /^[a-zA-Z]{3}\/[0-9]{4}\/[0-9]{3}$/;
  if (!matricNumberRegex.test(studentMatric)) {
    throw new BadRequestError("Invalid matric number format");
  }
  // if (!mongoose.Types.ObjectId.isValid(studentMatric)) {
  //   throw new BadRequestError("Invalid student id");
  // }

  const course = await Course.findById(id);
  if (!course) {
    throw new BadRequestError("Course does not exist");
  }

  const student = await Student.findOne({ matricNumber: studentMatric });
  if (!student) {
    throw new BadRequestError("Student does not exist");
  }
  const courseExist = student.courses.find(
    (courseId) => courseId.toString() === id
  );
  if (courseExist) {
    throw new BadRequestError("Student already added to course");
  }

  course.students.push(student._id);
  student.courses.push(id);

  await course.save();
  await student.save();

  res.status(200).json({ msg: "Student added successfully" });
};

const removeStudentFromCourse = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid course id");
  }

  let { studentMatric } = req.body;
  if (!studentMatric) {
    throw new BadRequestError("Please provide student matric number");
  }
  studentMatric = studentMatric.toLowerCase();
  const matricNumberRegex = /^[a-zA-Z]{3}\/[0-9]{4}\/[0-9]{3}$/;
  if (!matricNumberRegex.test(studentMatric)) {
    throw new BadRequestError("Invalid matric number format");
  }
  // if (!mongoose.Types.ObjectId.isValid(studentMatric)) {
  //   throw new BadRequestError("Invalid student id");
  // }

  const course = await Course.findById(id);
  if (!course) {
    throw new BadRequestError("Course does not exist");
  }

  const student = await Student.findOne({ matricNumber: studentMatric });
  if (!student) {
    throw new BadRequestError("Student does not exist");
  }

  const courseExist = student.courses.find(
    (courseId) => courseId.toString() === id
  );
  if (!courseExist) {
    throw new BadRequestError("Student not added to course");
  }

  course.students = course.students.filter(
    (studentMatric) => studentMatric !== studentMatric
  );
  student.courses = student.courses.filter(
    (courseId) => courseId.toString() !== id
  );

  await course.save();
  await student.save();

  res.status(200).json({ msg: "Student removed successfully" });
};

const addMultipleStudentsToCourse = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid course id");
  }

  const { studentMatrics } = req.body;
  if (!studentMatrics || studentMatrics.length === 0) {
    throw new BadRequestError("Please provide student Matrics");
  }
  const validIds = studentMatrics.filter((matric) => {
    // mongoose.Types.ObjectId.isValid(id)
    let studentMatric = matric.toLowerCase();
    const matricNumberRegex = /^[a-zA-Z]{3}\/[0-9]{4}\/[0-9]{3}$/;
    if (matricNumberRegex.test(studentMatric)) {
      return true;
    }
  });

  if (validIds.length < 1) {
    throw new BadRequestError("Invalid student ids");
  }

  const course = await Course.findById(id).populate("students");

  if (!course) {
    throw new BadRequestError("Course does not exist");
  }

  const students = await Student.find({ matricNumber: { $in: validIds } });
  if (!students || students.length < 1) {
    throw new BadRequestError("Students do not exist");
  }

  const studentsExist = students.filter((student) => {
    return !student.courses.find((courseId) => courseId.toString() === id);
  });

  //   console.log(studentsExist);
  //   //   res.send(200);
  //   //   return;

  if (studentsExist.length < 1) {
    throw new BadRequestError("All students already added to course");
  }

  for (const student of studentsExist) {
    const studentsData = await Student.findById(student._id);
    course.students.push(student._id);
    studentsData.courses.push(id);

    await studentsData.save();
  }

  await course.save();
  const courseWithStudents = await Course.findById(id).populate("students");

  res.status(200).json({
    msg: "Students added successfully",
    allStudents: courseWithStudents.students,
  });
};

const getAllCourses = async (req, res) => {
  const courses = await Course.find().select(
    "-students -lecturer -__v -attendance"
  );
  res.status(200).json({ courses });
};

const getAllCoursesTeaching = async (req, res) => {
  const { id } = req.user;
  const courses = await Course.find({ lecturer: id }).select(
    "-students -lecturer -__v -attendance"
  );
  res.status(200).json({ courses });
};

const getAllCoursesOffering = async (req, res) => {
  const { id } = req.user;
  // get student courses and populate with lecturer
  const student = await Student.findById(id).populate({
    path: "courses",
    populate: { path: "lecturer", select: "name -_id" },
    select: "-students -__v -attendance",
  });

  res.status(200).json({ courses: student.courses });
};
// Come back to edit after attendance is done
const getCourseById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid course id");
  }
  // add filter to get only s]certain students based on name of the student
  const { name } = req.query;

  const course = await Course.findById(id)
    .populate({
      path: "students",
      select: "name matricNumber ",
    })
    .populate({
      path: "attendance",
      select: "createdAt students active ",
      sort: { createdAt: -1 },
    })
    .populate({
      path: "lecturer",
      select: "name -_id",
    });
  if (!course) {
    throw new BadRequestError("Course does not exist");
  }

  if (name) {
    const students = course.students.filter((student) => {
      return student.name.toLowerCase().includes(name.toLowerCase());
    });
    course.students = students;
  }

  res.status(200).json({ course });
};

module.exports = {
  addCourse,
  deleteCourse,
  addStudentToCourse,
  removeStudentFromCourse,
  addMultipleStudentsToCourse,
  getAllCourses,
  getAllCoursesTeaching,
  getAllCoursesOffering,
  getCourseById,
};
