import mongoose from 'mongoose';

const ashramSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  founder: { type: String, trim: true },
  facilities: [{ type: String, trim: true }],
  accommodationAvailable: { type: Boolean, default: false },
  capacity: { type: Number },
  rules: { type: String, trim: true },
  schedule: {
    openTime: { type: String, trim: true },
    closeTime: { type: String, trim: true },
    alwaysOpen: { type: Boolean, default: false }
  },
  dailySchedule: [{
    time: { type: String, trim: true },
    activity: { type: String, trim: true }
  }],
  donationAccepted: { type: Boolean, default: false },
  mandir: { type: mongoose.Schema.Types.ObjectId, ref: 'Mandir' },
  dham: { type: mongoose.Schema.Types.ObjectId, ref: 'Dham' },
  onboardedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
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

const Ashram = mongoose.model('Ashram', ashramSchema);
export default Ashram;
