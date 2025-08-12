const express = require('express');
const router = express.Router();
const controller = require('../controller/courseController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueNumber = Date.now()+ "-" + Math.round(Math.random() * 1E9);
        const fileName = uniqueNumber + path.extname(file.originalname);
        cb(null, fileName);
    }
   
})

const upload = multer({storage: storage,
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png|gif|webp/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
    
        if (extname && mimeType) {
          return cb(null, true);
        } else {
          cb(new Error('Only images are allowed'));
        }
      }
});


router.get('/', controller.getCourses);
router.post('/',upload.single('image'), controller.createCourse);
router.put('/:id',upload.single('image'), controller.updateCourse);
router.delete('/:id', controller.deleteCourse);

module.exports = router;
