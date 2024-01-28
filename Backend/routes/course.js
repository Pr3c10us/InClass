const router = require("express").Router();

const {
  addCourse,
  deleteCourse,
  addStudentToCourse,
  removeStudentFromCourse,
  addMultipleStudentsToCourse,
  getAllCourses,
  getAllCoursesTeaching,
  getAllCoursesOffering,
  getCourseById,
} = require("../controllers/course");
const { lecturerAuthorize, studentAuthorize } = require("../middleware/authorizationMiddleware");

router.route("/").post(lecturerAuthorize, addCourse).get(getAllCourses);
router.get("/lecturer", lecturerAuthorize, getAllCoursesTeaching);
router.get("/student", studentAuthorize, getAllCoursesOffering);
router.route("/:id").delete(lecturerAuthorize, deleteCourse).get(getCourseById);
router
  .route("/:id/student")
  .post(lecturerAuthorize, addStudentToCourse)
  .delete(lecturerAuthorize, removeStudentFromCourse);

router.post("/:id/students", lecturerAuthorize, addMultipleStudentsToCourse);

module.exports = router;
