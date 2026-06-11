import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  starRating: { type: Number, min: 1, max: 5 },
  amenities: [{ type: String, trim: true }],
  roomTypes: [{ type: String, trim: true }],
  schedule: {
    openTime: { type: String, trim: true },
    closeTime: { type: String, trim: true },
    alwaysOpen: { type: Boolean, default: false }
  },
  hasHall: { type: Boolean, default: false },
  foodAvailable: { type: Boolean, default: false },
  distanceFromNearestMandir: { type: String, trim: true },
  startingPrice: { type: Number },
  policies: [{ type: String, trim: true }],
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  contact: {
    managerName: { type: String, trim: true },
    phone: { type: String, required: true },
    email: { type: String, trim: true, lowercase: true },
    website: { type: String, trim: true },
  },
  profilePic: { type: String },
  gallery: [{ type: String }],
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

const Hotel = mongoose.model('Hotel', hotelSchema);
export default Hotel;
