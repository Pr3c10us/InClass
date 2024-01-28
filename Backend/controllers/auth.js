//
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // For generating JWT
// Models
const Student = require("../models/student");
const Lecturer = require("../models/lecturer");
const { BadRequestError } = require("../errors");

const studentRegister = async (req, res) => {
  const { name, email, password, matricNumber } = req.body;

  if (!name || !email || !password || !matricNumber) {
    throw new BadRequestError("Please enter all fields");
  }

  // check if matric number is of format XXX/0000/000 where 000 is a number and XXX is a string
  const matricNumberRegex = /^[a-zA-Z]{3}\/[0-9]{4}\/[0-9]{3}$/;
  if (!matricNumberRegex.test(matricNumber)) {
    throw new BadRequestError("Invalid matric number format");
  }
  const userExist = await Student.findOne({ email: email });

  if (userExist) {
    throw new BadRequestError("User with email already exist");
  }
  const userExist2 = await Student.findOne({ matricNumber: matricNumber });

  if (userExist2) {
    throw new BadRequestError("User with matric number already exist");
  }
  const lowerCaseMatricNumber = matricNumber.toLowerCase();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const student = await Student.create({
    name: name,
    email: email,
    password: hashedPassword,
    matricNumber: lowerCaseMatricNumber,
  });

  res.status(201).json({
    success: true,
    data: student,
  });
};

const studentLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please enter all fields");
  }

  const user = await Student.findOne({ email: email });

  if (!user) {
    throw new BadRequestError("Invalid credentials - User does not exist");
  }
  // console.log({password, userPassword: user.password});

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new BadRequestError("Invalid credentials - Password does not match");
  }

  // create jwt
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res
    .cookie("studentToken", token, {
      signed: true,
      maxAge: 30 * 1000 * 60 * 60 * 24,
      httpOnly: false,
    })
    .json({
      success: true,
      data: user,
    });
};

const studentLogout = async (req, res) => {
  res.clearCookie("studentToken").json({
    success: true,
    message: "Logout Successful",
  });
};

const studentProfile = async (req, res) => {};

// Lecturers Auth
const lecturersRegister = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Please enter all fields");
  }

  const userExist = await Lecturer.findOne({ email: email });

  if (userExist) {
    throw new BadRequestError("User with email already exist");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const lecturer = await Lecturer.create({
    name: name,
    email: email,
    password: hashedPassword,
  });

  res.status(201).json({
    success: true,
    data: lecturer,
  });
};

const lecturersLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please enter all fields");
  }

  const user = await Lecturer.findOne({ email: email });

  if (!user) {
    throw new BadRequestError("Invalid credentials - User does not exist");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new BadRequestError("Invalid credentials - Password does not match");
  }

  // create jwt
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res
    .cookie("lecturerToken", token, {
      signed: true,
      maxAge: 30 * 1000 * 60 * 60 * 24,
      httpOnly: false,
    })
    .json({
      success: true,
      data: user,
    });
};

const lecturersLogout = async (req, res) => {
  res.clearCookie("lecturerToken").json({
    success: true,
    message: "Logout Successful",
  });
};

const lecturersProfile = async (req, res) => {};

module.exports = {
  studentRegister,
  studentLogin,
  studentLogout,
  studentProfile,
  lecturersRegister,
  lecturersLogin,
  lecturersLogout,
  lecturersProfile,
};
