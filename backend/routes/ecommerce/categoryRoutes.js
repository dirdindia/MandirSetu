import express from 'express';
import verifyToken from '../../middleware/verifyToken.js';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleVisibility
} from '../../controllers/ecommerce/categoryController.js';

const router = express.Router();

router.route('/')
  .get(verifyToken, getCategories)
  .post(verifyToken, createCategory);

router.route('/:id')
  .put(verifyToken, updateCategory)
  .delete(verifyToken, deleteCategory);

router.patch('/:id/toggle-visibility', verifyToken, toggleVisibility);

export default router;
