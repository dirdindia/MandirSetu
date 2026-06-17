import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  isVisible: {
    type: Boolean,
    default: true
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
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
