import mongoose from 'mongoose';

const dhamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  establishedYear: {
    type: String,
    trim: true,
  },
  mainDeity: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  schedule: {
    openTime: { type: String, trim: true },
    closeTime: { type: String, trim: true },
  },
  howToReach: {
    bus: { type: String, trim: true },
    train: { type: String, trim: true },
    air: { type: String, trim: true },
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, trim: true, lowercase: true },
    website: { type: String, trim: true },
  },
  profilePic: {
    type: String, // URL of the profile picture
  },
  gallery: [{
    type: String, // Array of URLs
  }],
  geolocation: {
    latitude: { type: String },
    longitude: { type: String },
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'inactive'],
    default: 'active',
  }
}, { timestamps: true });

const Dham = mongoose.model('Dham', dhamSchema);
export default Dham;
