import express from 'express';
import { 
  createCoupon, 
  getCoupons, 
  updateCoupon, 
  deleteCoupon, 
  toggleStatus 
} from '../../controllers/ecommerce/couponController.js';
import verifyToken from '../../middleware/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, getCoupons);
router.post('/', verifyToken, createCoupon);
router.put('/:id', verifyToken, updateCoupon);
router.delete('/:id', verifyToken, deleteCoupon);
router.patch('/:id/toggle-status', verifyToken, toggleStatus);

export default router;
