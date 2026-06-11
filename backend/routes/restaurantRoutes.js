import express from 'express';
import { createRestaurant, getRestaurants, updateRestaurant, deleteRestaurant } from '../controllers/restaurantController.js';

const router = express.Router();

router.post('/', createRestaurant);
router.get('/', getRestaurants);
router.put('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);

export default router;
