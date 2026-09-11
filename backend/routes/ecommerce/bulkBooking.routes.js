import express from 'express';
import {
  createBulkBooking,
  getMyBulkBookings,
  getAllBulkBookings,
  addQuoteToBooking,
  initializeAdvancePayment,
  verifyAdvancePayment
} from '../../controllers/ecommerce/bulkBookingController.js';
import verifyToken from '../../middleware/verifyToken.js';

const router = express.Router();

// Routes for devotees
router.route('/')
  .post(verifyToken, createBulkBooking)
  .get(verifyToken, getAllBulkBookings); // We will handle admin authorization in the controller or skip it for now

router.get('/my-bookings', verifyToken, getMyBulkBookings);
router.post('/:id/pay-advance', verifyToken, initializeAdvancePayment);
router.post('/:id/verify-advance', verifyToken, verifyAdvancePayment);

// Routes for admin/staff
router.patch('/:id/quote', verifyToken, addQuoteToBooking);

export default router;
