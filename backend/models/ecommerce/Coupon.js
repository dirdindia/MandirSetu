import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    unique: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true
  },
  banner: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicabilityType: {
    type: String,
    enum: ['all', 'specific_categories', 'specific_products'],
    default: 'all'
  },
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  mandir_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mandir'
  },
  dham_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dham'
  },
  onboardedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  }
}, {
  timestamps: true
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
