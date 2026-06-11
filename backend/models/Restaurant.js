import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  cuisine: [{ type: String, trim: true }],
  isVegetarianOnly: { type: Boolean, default: false },
  averageCostForTwo: { type: Number },
  schedule: {
    openTime: { type: String, trim: true },
    closeTime: { type: String, trim: true },
    alwaysOpen: { type: Boolean, default: false }
  },
  amenities: [{ type: String, trim: true }],
  seatingCapacity: { type: Number },
  fssaiLicense: { type: String, trim: true },
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

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
