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
