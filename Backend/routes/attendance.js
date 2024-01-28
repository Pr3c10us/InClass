const router = require("express").Router();

const {
  createAttendanceInstance,
  deleteAttendanceInstance,
  deActivateAttendanceInstance,
  addStudentToAttendance,
  authorizeStudent,
  getAttendanceDetails,
} = require("../controllers/attendance");

const {
  lecturerAuthorize,
  studentAuthorize,
} = require("../middleware/authorizationMiddleware");

router.route("/").post(lecturerAuthorize, createAttendanceInstance);
router.route("/authorize").patch(studentAuthorize, authorizeStudent);
router
  .route("/:id")
  .get(lecturerAuthorize, getAttendanceDetails)
  .delete(lecturerAuthorize, deleteAttendanceInstance);
router
  .route("/deactivate/:id")
  .patch(lecturerAuthorize, deActivateAttendanceInstance);
// router.route("/activate/:id").patch(lecturerAuthorize, activateAttendanceInstance);
router.route("/add/:id").patch(lecturerAuthorize, addStudentToAttendance);

module.exports = router;
