import express from 'express';
import { createRestaurant, getRestaurants, updateRestaurant, deleteRestaurant, getRestaurantById } from '../../controllers/directories/restaurantController.js';

import verifyToken from '../../middleware/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, createRestaurant);
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.put('/:id', verifyToken, updateRestaurant);
router.delete('/:id', verifyToken, deleteRestaurant);

export default router;
