import express from 'express';
import { createMandir, getMandirs, getMandirById } from '../controllers/mandirController.js';

const router = express.Router();

router.post('/', createMandir);
router.get('/', getMandirs);
router.get('/:id', getMandirById);

export default router;
