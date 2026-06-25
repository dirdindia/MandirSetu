import User from '../../models/users/User.js';
import { loginValidation } from '../../validation/authValidation.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Staff from '../../models/users/Staff.js';

export const login = async (req, res) => {
  // Validate request
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    // Check if user exists
    const user = await User.findOne({ 
      $or: [{ email: req.body.identifier }, { phone: req.body.identifier }] 
    });
    if (!user) return res.status(400).json({ message: 'Invalid email/phone or password' });

    // Validate password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({ message: 'Invalid email/phone or password' });

    // Ensure user is admin or staff
    if (user.role !== 'admin' && user.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied. You are not authorized.' });
    }

    let userName = 'Staff Member';
    let userEmail = user.email || user.phone;
    let mandir_id = null;
    let dham_id = null;

    if (user.role === 'staff') {
      const staffProfile = await Staff.findOne({ 
        $or: [
          { 'contact.email': user.email }, 
          { 'contact.phone': user.phone }
        ]
      });
      if (staffProfile) {
        userName = staffProfile.name;
        if (staffProfile.contact.email) userEmail = staffProfile.contact.email;
        if (staffProfile.employment?.assignedMandir) mandir_id = staffProfile.employment.assignedMandir;
        if (staffProfile.employment?.assignedDham) dham_id = staffProfile.employment.assignedDham;
      }
    }

    // Create and assign a token
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || 'supersecretkey123', { expiresIn: '1d' });

    res.header('auth-token', token).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        email: userEmail,
        name: userName,
        role: user.role,
        mandir_id,
        dham_id
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old and new passwords are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const validPass = await bcrypt.compare(oldPassword, user.password);
    if (!validPass) return res.status(400).json({ message: 'Incorrect old password' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: 'Invalid email or password' });

    if (user.role !== 'user') {
      return res.status(403).json({ message: 'Access denied. Only customers can login here.' });
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || 'supersecretkey123', { expiresIn: '7d' });

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Customer login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Global object to store mock OTPs
global.otpStore = global.otpStore || {};

export const generateOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'user') return res.status(403).json({ message: 'Not a customer account' });

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store in memory (expires in 5 mins logically, but we'll just overwrite)
    global.otpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    };

    console.log(`\n\n================================`);
    console.log(`🚀 MOCK OTP for ${email}: ${otp} 🚀`);
    console.log(`================================\n\n`);

    res.status(200).json({ message: 'OTP sent successfully (check console)' });
  } catch (err) {
    console.error('Generate OTP error:', err);
    res.status(500).json({ message: 'Failed to generate OTP' });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const storedData = global.otpStore[email];
    if (!storedData) {
      return res.status(400).json({ message: 'No OTP generated for this email' });
    }

    if (Date.now() > storedData.expiresAt) {
      delete global.otpStore[email];
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is valid
    delete global.otpStore[email];

    const user = await User.findOne({ email });
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || 'supersecretkey123', { expiresIn: '7d' });

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};
