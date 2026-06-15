import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  link: {
    type: String, // Optional URL to redirect to when notification is clicked
    default: ''
  }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
