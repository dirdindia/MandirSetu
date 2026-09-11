import BulkBooking from '../../models/ecommerce/BulkBooking.js';
import User from '../../models/users/User.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

// @desc    Create a new bulk booking inquiry
// @route   POST /api/bulk-bookings
// @access  Private (Devotee)
export const createBulkBooking = async (req, res, next) => {
  try {
    const { contactDetails, destination, dateRange, groupSize, requestedServices, specialRequirements } = req.body;

    const booking = await BulkBooking.create({
      user: req.user._id,
      contactDetails,
      destination,
      dateRange,
      groupSize,
      requestedServices,
      specialRequirements
    });

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's bulk bookings
// @route   GET /api/bulk-bookings/my-bookings
// @access  Private (Devotee)
export const getMyBulkBookings = async (req, res, next) => {
  try {
    const bookings = await BulkBooking.find({ user: req.user._id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bulk bookings
// @route   GET /api/bulk-bookings
// @access  Private/Admin
export const getAllBulkBookings = async (req, res, next) => {
  try {
    let filter = {};
    
    // If user is staff, filter by their assigned Mandir or Dham
    if (req.user.role === 'staff') {
      const staffUser = await User.findById(req.user._id).populate('employment.assignedMandir employment.assignedDham');
      if (staffUser?.employment?.assignedMandir) {
        filter = { 
          'destination.destinationType': 'Mandir', 
          'destination.destinationId': staffUser.employment.assignedMandir._id 
        };
      } else if (staffUser?.employment?.assignedDham) {
        filter = { 
          'destination.destinationType': 'Dham', 
          'destination.destinationId': staffUser.employment.assignedDham._id 
        };
      }
    }

    const bookings = await BulkBooking.find(filter).populate('user', 'name email').sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add quote to a bulk booking (Admin)
// @route   PATCH /api/bulk-bookings/:id/quote
// @access  Private/Admin
export const addQuoteToBooking = async (req, res, next) => {
  try {
    const { quoteDetails, advanceRequired, adminNotes } = req.body;

    let booking = await BulkBooking.findById(req.params.id);

    if (!booking) {
      res.status(404).json({ success: false, message: `Booking not found with id of ${req.params.id}` });
      return;
    }

    const totalAmount = quoteDetails.reduce((sum, item) => sum + Number(item.cost), 0);

    booking.quoteDetails = quoteDetails;
    booking.totalAmount = totalAmount;
    booking.advanceRequired = advanceRequired;
    booking.adminNotes = adminNotes;
    booking.status = 'Quote Sent';

    await booking.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Initialize Advance Payment
// @route   POST /api/bulk-bookings/:id/pay-advance
// @access  Private
export const initializeAdvancePayment = async (req, res, next) => {
  try {
    const booking = await BulkBooking.findById(req.params.id);

    if (!booking) {
      res.status(404).json({ success: false, message: `Booking not found with id of ${req.params.id}` });
      return;
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ success: false, message: `Not authorized to access this booking` });
      return;
    }

    if (booking.status !== 'Quote Sent') {
      res.status(400).json({ success: false, message: `Booking is not in a state to accept advance payment` });
      return;
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(booking.advanceRequired * 100), // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_bulk_${booking._id}`
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: {
        order,
        booking
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Advance Payment
// @route   POST /api/bulk-bookings/:id/verify-advance
// @access  Private
export const verifyAdvancePayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const booking = await BulkBooking.findById(req.params.id);

    if (!booking) {
      res.status(404).json({ success: false, message: `Booking not found with id of ${req.params.id}` });
      return;
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret')
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      booking.status = 'Confirmed';
      booking.advancePaid = booking.advanceRequired;
      booking.paymentDetails = {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        paidAt: Date.now()
      };
      await booking.save();

      res.status(200).json({
        success: true,
        data: booking
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }
  } catch (error) {
    next(error);
  }
};
