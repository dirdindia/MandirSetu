import express from 'express';
import { createMandir, getMandirs } from '../controllers/mandirController.js';

const router = express.Router();

router.post('/', createMandir);
router.get('/', getMandirs);

export default router;
