import express from 'express';
import { createAshram, getAshrams, updateAshram, deleteAshram, getAshramById } from '../../controllers/directories/ashramController.js';

import verifyToken from '../../middleware/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, createAshram);
router.get('/', getAshrams);
router.get('/:id', getAshramById);
router.put('/:id', verifyToken, updateAshram);
router.delete('/:id', verifyToken, deleteAshram);

export default router;
