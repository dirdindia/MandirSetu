import express from 'express';
import { hireStaff, getAllStaff } from '../controllers/staffController.js';

const router = express.Router();

// Routes
router.post('/', hireStaff);
router.get('/', getAllStaff);

export default router;
