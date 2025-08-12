const express = require('express');
const router = express.Router();
const studentInsCtrl = require('../controller/installmentController');


// Routes
router.get('/', studentInsCtrl.getAllStudentInstallments);
router.get('/:id', studentInsCtrl.getStudentInstallmentById);
router.post('/',  studentInsCtrl.addStudentInstallment);
router.put('/:id', studentInsCtrl.updateStudentInstallment);
router.delete('/:id', studentInsCtrl.deleteStudentInstallment);

module.exports = router;
