import express from 'express';
import { login, changePassword } from '../controllers/authController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/login', login);
router.put('/change-password', verifyToken, changePassword);

export default router;
