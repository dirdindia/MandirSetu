import User from '../models/User.js';
import { loginValidation } from '../validation/authValidation.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  // Validate request
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: 'Email or password is wrong' });

    // Validate password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({ message: 'Email or password is wrong' });

    // Ensure user is admin (optional, based on requirement, but good to check if they are logging into admin panel)
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You are not an admin.' });
    }

    // Create and assign a token
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || 'supersecretkey123', { expiresIn: '1d' });
    
    res.header('auth-token', token).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
