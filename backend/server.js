import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';

import authRoutes from './routes/users/authRoutes.js';
import userRoutes from './routes/users/userRoutes.js';
import mandirRoutes from './routes/core/mandirRoutes.js';
import dhamRoutes from './routes/core/dhamRoutes.js';
import uploadRoutes from './routes/system/uploadRoutes.js';
import staffRoutes from './routes/users/staffRoutes.js';
import notificationRoutes from './routes/system/notificationRoutes.js';
import hotelRoutes from './routes/directories/hotelRoutes.js';
import restaurantRoutes from './routes/directories/restaurantRoutes.js';
import ashramRoutes from './routes/directories/ashramRoutes.js';
import categoryRoutes from './routes/ecommerce/categoryRoutes.js';
import productRoutes from './routes/ecommerce/productRoutes.js';
import couponRoutes from './routes/ecommerce/couponRoutes.js';
import paymentRoutes from './routes/ecommerce/paymentRoutes.js';
import orderRoutes from './routes/ecommerce/orderRoutes.js';
import eventRoutes from './routes/core/eventRoutes.js';
import User from './models/users/User.js';

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// GLOBAL MIDDLEWARES (OPTIMIZATIONS)
// ==========================================

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Compress all responses
app.use(compression());

// Implement CORS
app.use(cors());

// ==========================================
// DATABASE CONNECTION
// ==========================================
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

// ==========================================
// ROUTES
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mandirs', mandirRoutes);
app.use('/api/dhams', dhamRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/ashrams', ashramRoutes);
app.use('/api/ecommerce/categories', categoryRoutes);
app.use('/api/ecommerce/products', productRoutes);
app.use('/api/ecommerce/coupons', couponRoutes);
app.use('/api/ecommerce/payment', paymentRoutes);
app.use('/api/ecommerce/orders', orderRoutes);
app.use('/api/events', eventRoutes);

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'MandirSetu backend is healthy, optimized, and running',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Handle undefined routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'production') {
    // Send minimal error detail in production
    res.status(err.statusCode).json({
      status: err.status,
      message: err.isOperational ? err.message : 'Something went very wrong!'
    });
  } else {
    // Send detailed error in development
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
});

// ==========================================
// START SERVER
// ==========================================
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health check available at http://localhost:${PORT}/api/health`);
});

// Handle Unhandled Rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
