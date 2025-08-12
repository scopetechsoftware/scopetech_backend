const express = require('express');
const router = express.Router();
const placementController = require('../controller/placementController');
const multer = require('multer');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
router.get('/', placementController.getAllPlacements);
router.get('/:id', placementController.getPlacementById);
router.post('/', upload.single('companyLogo'), placementController.addPlacement);
router.put('/:id', upload.single('companyLogo'), placementController.updatePlacement);
router.delete('/:id', placementController.deletePlacement);

module.exports = router;
