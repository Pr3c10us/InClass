const router = require('express').Router();

const {
    studentRegister,
  studentLogin,
  studentLogout,
  studentProfile,
  lecturersRegister,
  lecturersLogin,
  lecturersLogout,
  lecturersProfile,
} = require('../controllers/auth');

router.post('/student/register', studentRegister);
router.post('/student/login', studentLogin);
router.post('/student/logout', studentLogout);
router.get('/student/profile', studentProfile);

router.post('/lecturer/register', lecturersRegister);
router.post('/lecturer/login', lecturersLogin);
router.post('/lecturer/logout', lecturersLogout);
router.get('/lecturer/profile', lecturersProfile);

module.exports = router;
