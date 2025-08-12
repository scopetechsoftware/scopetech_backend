const express = require('express');
const router = express.Router();
const controller = require('../controller/enquiryController');


router.post('/', controller.addEnquiry);
router.get('/', controller.getEnquiry);
router.get('/followups', controller.getFollowup);
router.get('/:id', controller.getSingleEnquiry);
router.put('/:id', controller.updateSingleEnquiry);
router.delete('/:id', controller.deleteSingleEnquiry);

module.exports = router;
