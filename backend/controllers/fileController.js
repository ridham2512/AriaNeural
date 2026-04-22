// controllers/fileController.js — File Upload & Processing
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// ── Multer Storage Config ─────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = process.env.UPLOAD_PATH || './uploads';
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // Unique filename: timestamp + original name (sanitized)
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

// ── File Filter: Allow PDFs and images only ───
const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, PNG, GIF, WEBP) and PDFs are allowed'), false);
  }
};

// ── Multer Upload Instance ────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 }, // 10 MB
});

// ── @route   POST /api/files/upload ──────────
// ── @desc    Upload a file and extract text ───
// ── @access  Private ──────────────────────────
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    let extractedText = '';

    // ── Extract text from PDF ─────────────────
    if (req.file.mimetype === 'application/pdf') {
      try {
        const pdfParse = require('pdf-parse');
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);
        // Limit extracted text to ~4000 tokens worth of chars
        extractedText = pdfData.text.slice(0, 16000);
      } catch (pdfError) {
        console.warn('PDF text extraction failed:', pdfError.message);
        extractedText = '';
      }
    }

    res.json({
      success: true,
      file: {
        originalName: req.file.originalname,
        storedName: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
      },
      extractedText: extractedText || null,
    });
  } catch (error) {
    next(error);
  }
};

// Export both the upload middleware and the handler
module.exports = { upload, uploadFile };
