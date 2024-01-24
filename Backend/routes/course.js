const router = require("express").Router();

const {
  addCourse,
  deleteCourse,
  addStudentToCourse,
  removeStudentFromCourse,
  addMultipleStudentsToCourse,
  getAllCourses,
  getAllCoursesTeaching,
  getCourseById,
} = require("../controllers/course");
const { lecturerAuthorize } = require("../middleware/authorizationMiddleware");

router.route("/").post(lecturerAuthorize, addCourse).get(getAllCourses);
router.get("/teaching", lecturerAuthorize, getAllCoursesTeaching);
router.route("/:id").delete(lecturerAuthorize, deleteCourse).get(getCourseById);
router
  .route("/:id/student")
  .post(lecturerAuthorize, addStudentToCourse)
  .delete(lecturerAuthorize, removeStudentFromCourse);

router.post("/:id/students", lecturerAuthorize, addMultipleStudentsToCourse);

module.exports = router;
