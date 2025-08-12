const express = require('express');
const router = express.Router();
const { createCourseUpdate, getCourseUpdates } = require('../controller/courseUpdateController');

router.post('/', createCourseUpdate);
router.get('/', getCourseUpdates);

module.exports = router;
