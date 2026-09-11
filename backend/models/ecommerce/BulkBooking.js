import mongoose from 'mongoose';

const quoteItemSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true,
    enum: ['Hotel/Ashram', 'Food/Bhandara', 'Local Transport', 'Pandit/Puja', 'Prasad', 'Other']
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  }
});

const bulkBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactDetails: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    organization: { type: String }
  },
  destination: {
    type: String,
    required: true
  },
  dateRange: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  groupSize: {
    type: Number,
    required: true,
    min: 1
  },
  requestedServices: [{
    type: String,
    enum: ['Hotel/Ashram', 'Food/Bhandara', 'Local Transport', 'Pandit/Puja', 'Prasad', 'Other']
  }],
  specialRequirements: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Quote Sent', 'Advance Paid', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  quoteDetails: [quoteItemSchema],
  totalAmount: {
    type: Number,
    default: 0
  },
  advanceRequired: {
    type: Number,
    default: 0
  },
  advancePaid: {
    type: Number,
    default: 0
  },
  paymentDetails: {
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    paidAt: { type: Date }
  },
  adminNotes: {
    type: String
  }
}, {
  timestamps: true
});

const BulkBooking = mongoose.model('BulkBooking', bulkBookingSchema);

export default BulkBooking;
