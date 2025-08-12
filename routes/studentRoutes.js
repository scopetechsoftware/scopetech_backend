const express = require('express');
const routerStudent = express.Router();
const multer = require('multer');
const path = require('path');
const { getAllStudent, UpdateStudent, addStudent, deleteStudent, getStudent, getStudentAllDetail } = require('../controller/studentsController');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const fileName = uniqueName + path.extname(file.originalname)
        cb(null, fileName);
    }
})

const upload = multer({
    storage: storage, fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png|gif|pdf|webp/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extname && mimeType) {
            return cb(null, true);
        } else {
            cb(new Error('Only images and PDFs are allowed'));
        }
    }
})


const fieldUpload = upload.fields([{name: 'studentImage', maxCount: 1}, {name: 'studentAadharImage', maxCount: 1}]);


routerStudent.get('/', getAllStudent);
routerStudent.post('/', fieldUpload, addStudent);
routerStudent.put('/:id', fieldUpload, UpdateStudent);
routerStudent.delete('/:id', deleteStudent);
routerStudent.get('/:id', getStudent);
routerStudent.get('/:id/details', getStudentAllDetail);

module.exports = routerStudent;