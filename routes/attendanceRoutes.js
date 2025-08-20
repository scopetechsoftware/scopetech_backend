const express = require('express');
const router = express.Router();
const attendanceController = require('../controller/attendanceController');

// Student marks attendance
router.post('/mark', attendanceController.markAttendance);

// Admin views pending requests
router.get('/pending', attendanceController.getPendingAttendance);
router.get('/all',attendanceController.getallattend)

// Admin updates status
router.post('/update', attendanceController.updateAttendanceStatus);

router.delete('/delete/:id', attendanceController.deleteAttendance)

module.exports = router;
