import express from 'express';
import { createMandir, getMandirs, getMandirById, updateMandir, deleteMandir, getMandirFullDetails } from '../../controllers/core/mandirController.js';
import verifyToken from '../../middleware/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, createMandir);
router.get('/', getMandirs);
router.get('/:id/full-details', getMandirFullDetails);
router.get('/:id', getMandirById);
router.put('/:id', verifyToken, updateMandir);
router.delete('/:id', verifyToken, deleteMandir);

export default router;
