const express = require('express');
const router = express.Router();
const studentRegCtrl = require('../controller/studentRegisterController');


// Routes
router.get('/', studentRegCtrl.getAllStudentRegisters);
router.get('/:id', studentRegCtrl.getStudentRegisterById);
router.post('/',  studentRegCtrl.addStudentRegister);
router.put('/:id', studentRegCtrl.updateStudentRegister);
router.delete('/:id', studentRegCtrl.deleteStudentRegister);

module.exports = router;
