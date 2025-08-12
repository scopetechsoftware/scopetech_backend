const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { sendReceiptMail } = require('../controller/sendReceiptController');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) cb(null, true);
    else cb(new Error('Only PDF and image files are allowed'));
  }
});

const fileUpload = upload.single('receipt'); // frontend should send with key `receipt`

// Route to send email
router.post('/', fileUpload, sendReceiptMail);

module.exports = router;
