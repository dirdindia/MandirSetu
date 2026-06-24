import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
  },
  stock: {
    type: Number,
    default: 0,
  },
  unit: {
    type: String,
    default: 'piece',
  },
  displayImage: {
    type: String,
  },
  gallery: [{
    type: String,
  }],
  isVisible: {
    type: Boolean,
    default: true,
  },
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
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
