import express from 'express';
import multer from 'multer';
import { uploadToCloudinary } from '../controllers/uploadController.js';

const router = express.Router();

// Setup multer to store files temporarily in 'uploads/' directory
const upload = multer({ dest: 'uploads/' });

// Route matches frontend API call: /api/upload/upload-files
router.post('/upload-files', upload.array('files', 10), uploadToCloudinary);

export default router;
