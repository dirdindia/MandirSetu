import express from 'express';
import { createDham, getDhams, getDhamById } from '../controllers/dhamController.js';

const router = express.Router();

router.post('/', createDham);
router.get('/', getDhams);
router.get('/:id', getDhamById);

export default router;
