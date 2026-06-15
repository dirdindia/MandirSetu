import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  dob: { type: Date },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  geolocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    },
    formattedAddress: String
  },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true },
    emergencyContact: { type: String }
  },
  employment: {
    role: { type: String, required: true }, // e.g. Temple Sevadar, Manager
    assignedMandir: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Mandir' 
    }, // Optional for global admins
    assignedDham: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dham'
    },
    dateOfJoining: { type: Date, default: Date.now }
  },
  media: {
    profilePic: { type: String }, // Cloudinary URL
    documentType: { type: String }, // e.g. Aadhar, PAN
    documentUrl: { type: String } // Cloudinary URL
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active'
  }
}, { timestamps: true });

const Staff = mongoose.model('Staff', staffSchema);
export default Staff;
