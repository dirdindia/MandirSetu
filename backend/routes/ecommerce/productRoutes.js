import express from 'express';
import verifyToken from '../../middleware/verifyToken.js';
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  toggleVisibility
} from '../../controllers/ecommerce/productController.js';

const router = express.Router();

router.post('/', verifyToken, createProduct);
router.get('/', verifyToken, getProducts);
router.put('/:id', verifyToken, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);
router.patch('/:id/toggle-visibility', verifyToken, toggleVisibility);

export default router;
