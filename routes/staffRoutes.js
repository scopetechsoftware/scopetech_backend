const express = require('express');
const { getAllStaff, UpdateStaff, addStaff, deleteStaff, getStaffById } = require('../controller/staffsController');
const routerStaff = express.Router();
const multer = require('multer');
const path = require('path');


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
        const fileTypes = /jpeg|jpg|png|gif|pdf/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extname && mimeType) {
            return cb(null, true);``
        } else {
            cb(new Error('Only images and PDFs are allowed'));
        }
    }
})


const fieldUpload = upload.fields([{name: 'staffImage', maxCount: 1}, {name: 'staffAadharImage', maxCount: 1}]);


routerStaff.get('/', getAllStaff);
routerStaff.post('/', fieldUpload, addStaff);
routerStaff.put('/:id', fieldUpload, UpdateStaff);
routerStaff.delete('/:id', deleteStaff);
routerStaff.get('/:id', getStaffById);

module.exports = routerStaff;