const express = require('express');
const studentmark = require('../controller/studentmark');
const router = express.Router()



router.get('/my-students', studentmark.getMyStudents);
router.post('/add-mark', studentmark.addStudentMark);
router.get('/student-marks/:studentRegisterId',studentmark.getStudentMarks);

router.get("/all-marks", studentmark.getAllStudentMarks)

module.exports = router;