import express from 'express';
import { hireStaff, getAllStaff, getStaffById, updateStaff, deleteStaff, getMe, updateMe } from '../controllers/staffController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/me', verifyToken, getMe);
router.put('/me', verifyToken, updateMe);

// Routes
router.post('/', hireStaff);
router.get('/', getAllStaff);
router.get('/:id', getStaffById);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

export default router;
