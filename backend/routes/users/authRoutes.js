import express from 'express';
import { login, changePassword, customerLogin, generateOTP, verifyOTP } from '../../controllers/users/authController.js';
import verifyToken from '../../middleware/verifyToken.js';

const router = express.Router();

router.post('/login', login);
router.put('/change-password', verifyToken, changePassword);

// Customer specific endpoints
router.post('/customer-login', customerLogin);
router.post('/generate-otp', generateOTP);
router.post('/verify-otp', verifyOTP);

export default router;
