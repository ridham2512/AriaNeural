// routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const { upload, uploadFile } = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/files/upload  — single file upload, field name = "file"
router.post('/upload', protect, upload.single('file'), uploadFile);

module.exports = router;
