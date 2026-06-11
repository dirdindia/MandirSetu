import express from 'express';
import { createAshram, getAshrams, updateAshram, deleteAshram } from '../controllers/ashramController.js';

const router = express.Router();

router.post('/', createAshram);
router.get('/', getAshrams);
router.put('/:id', updateAshram);
router.delete('/:id', deleteAshram);

export default router;
