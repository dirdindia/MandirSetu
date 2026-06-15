import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/users/authRoutes.js';
import mandirRoutes from './routes/core/mandirRoutes.js';
import dhamRoutes from './routes/core/dhamRoutes.js';
import uploadRoutes from './routes/system/uploadRoutes.js';
import staffRoutes from './routes/users/staffRoutes.js';
import notificationRoutes from './routes/system/notificationRoutes.js';
import hotelRoutes from './routes/directories/hotelRoutes.js';
import restaurantRoutes from './routes/directories/restaurantRoutes.js';
import ashramRoutes from './routes/directories/ashramRoutes.js';
import User from './models/users/User.js';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mandirsetu';
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('✅ MongoDB Database connected successfully');
    
    // Create default admin if not exists
    User.findOne({ email: 'admin@gmail.com' }).then(async (admin) => {
      if (!admin) {
        const hashedPassword = await bcrypt.hash('admin@123', 10);
        await User.create({
          email: 'admin@gmail.com',
          password: hashedPassword,
          role: 'admin'
        });
        console.log('✅ Default admin user created (admin@gmail.com)');
      }
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Database connection error:', err.message);
    console.log('Ensure MongoDB service is running locally or check your MONGO_URI in .env');
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mandirs', mandirRoutes);
app.use('/api/dhams', dhamRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/ashrams', ashramRoutes);

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'MandirSetu backend is healthy and running',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health check available at http://localhost:${PORT}/api/health`);
});
