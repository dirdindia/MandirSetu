import express from 'express';
import { createDham, getDhams, getDhamById, updateDham, deleteDham, getDhamFullDetails } from '../../controllers/core/dhamController.js';
import verifyToken from '../../middleware/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, createDham);
router.get('/', getDhams);
router.get('/:id/full-details', getDhamFullDetails);
router.get('/:id', getDhamById);
router.put('/:id', verifyToken, updateDham);
router.delete('/:id', verifyToken, deleteDham);

export default router;
