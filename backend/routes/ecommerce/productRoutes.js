import express from 'express';
import verifyToken from '../../middleware/verifyToken.js';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleVisibility
} from '../../controllers/ecommerce/productController.js';

const router = express.Router();

router.post('/', verifyToken, createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', verifyToken, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);
router.patch('/:id/toggle-visibility', verifyToken, toggleVisibility);

export default router;
