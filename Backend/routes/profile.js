const router = require("express").Router();

const { getStudentDetails ,getLecturerDetails} = require("../controllers/profile");
const { studentAuthorize, lecturerAuthorize } = require("../middleware/authorizationMiddleware");

router.get("/student", studentAuthorize, getStudentDetails);
router.get("/lecturer", lecturerAuthorize, getLecturerDetails);

module.exports = router;
