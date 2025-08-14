const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const eventController = require("../controller/events");

// Multer storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Folder to save images
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Keep original extension
    }
});

// File filter (optional: only images)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit

});

// Routes
router.post("/", upload.single("src"), eventController.postevents);
router.get("/", eventController.getevents);
router.get("/:id", eventController.geteventById);
router.put("/:id", upload.single("image"), eventController.updateevent);
router.delete("/:id", eventController.deleteevent);

module.exports = router;