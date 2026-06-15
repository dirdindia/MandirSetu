import express from 'express';
import { createHotel, getHotels, updateHotel, deleteHotel, getHotelById } from '../../controllers/directories/hotelController.js';

import verifyToken from '../../middleware/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, createHotel);
router.get('/', getHotels);
router.get('/:id', getHotelById);
router.put('/:id', verifyToken, updateHotel);
router.delete('/:id', verifyToken, deleteHotel);

export default router;
