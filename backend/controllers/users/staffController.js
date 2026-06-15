import Staff from '../../models/users/Staff.js';
import User from '../../models/users/User.js';
import bcrypt from 'bcryptjs';
import { createNotification } from '../../controllers/system/notificationController.js';
import { staffValidationSchema } from '../../validation/directoryValidation.js';

// Create new staff
export const hireStaff = async (req, res) => {
  try {
    const { 
      name, gender, dob, address, city, state, pincode, latitude, longitude,
      phone, email, emergencyContact, 
      role, assignedMandir, assignedDham,
      profilePic, documentType, documentUrl,
      password
    } = req.body;

    // Joi validation
    const { error } = staffValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if user already exists
    let userQuery = [{ phone }];
    if (email) userQuery.push({ email });
    const existingUser = await User.findOne({ $or: userQuery });
    if (existingUser) {
      return res.status(400).json({ message: "A user with this phone number or email already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User account for staff
    const newUser = new User({
      phone,
      ...(email && { email }),
      password: hashedPassword,
      role: 'staff'
    });
    await newUser.save();

    const newStaff = new Staff({
      name,
      gender,
      dob,
      address,
      city,
      state,
      pincode,
      geolocation: {
        type: "Point",
        coordinates: [parseFloat(longitude) || 0, parseFloat(latitude) || 0],
        formattedAddress: address
      },
      contact: { phone, email, emergencyContact },
      employment: { 
        role, 
        assignedMandir: assignedMandir || null,
        assignedDham: assignedDham || null
      },
      media: { profilePic, documentType, documentUrl }
    });

    await newStaff.save();

    // Create notification
    await createNotification(
      'New Staff Hired',
      `${name} has been hired as a ${role}.`,
      'info',
      '/hire-staff' 
    );

    res.status(201).json({ message: "Staff hired successfully!", staff: newStaff });
  } catch (error) {
    console.error("Error hiring staff:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all staff
export const getAllStaff = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalItems = await Staff.countDocuments();
    const staffList = await Staff.find()
      .populate('employment.assignedMandir', 'name city')
      .populate('employment.assignedDham', 'name city')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: staffList,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch staff", error: error.message });
  }
};

// Get Single Staff
export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .populate('employment.assignedMandir', 'name city')
      .populate('employment.assignedDham', 'name city');
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    res.status(200).json({ data: staff });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch staff details", error: error.message });
  }
};

// Update Staff
export const updateStaff = async (req, res) => {
  try {
    const { 
      name, gender, dob, address, city, state, pincode, latitude, longitude,
      phone, email, emergencyContact, 
      role, assignedMandir, assignedDham,
      profilePic, documentType, documentUrl
    } = req.body;

    const staffToUpdate = await Staff.findById(req.params.id);
    if (!staffToUpdate) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const updateData = {
      name,
      gender,
      dob,
      address,
      city,
      state,
      pincode,
      geolocation: {
        type: "Point",
        coordinates: [parseFloat(longitude) || 0, parseFloat(latitude) || 0],
        formattedAddress: address
      },
      contact: { phone, email, emergencyContact },
      employment: { 
        role, 
        assignedMandir: assignedMandir || null,
        assignedDham: assignedDham || null
      },
      media: { profilePic, documentType, documentUrl }
    };

    const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ message: "Staff updated successfully", data: updatedStaff });
  } catch (error) {
    res.status(500).json({ message: "Failed to update staff", error: error.message });
  }
};

// Delete Staff
export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    
    // Find associated user by phone or email to delete login access
    const userQuery = [];
    if (staff.contact?.phone) userQuery.push({ phone: staff.contact.phone });
    if (staff.contact?.email) userQuery.push({ email: staff.contact.email });
    
    if (userQuery.length > 0) {
      await User.findOneAndDelete({ $or: userQuery, role: 'staff' });
    }

    await Staff.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete staff", error: error.message });
  }
};

// Get current staff profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const staffProfile = await Staff.findOne({
      $or: [
        { 'contact.email': user.email },
        { 'contact.phone': user.phone }
      ]
    })
    .populate('employment.assignedMandir', 'name city')
    .populate('employment.assignedDham', 'name city');

    if (!staffProfile) return res.status(404).json({ message: 'Staff profile not found for this user.' });

    res.status(200).json({ data: staffProfile });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

// Update current staff profile
export const updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const staffProfile = await Staff.findOne({
      $or: [
        { 'contact.email': user.email },
        { 'contact.phone': user.phone }
      ]
    });

    if (!staffProfile) return res.status(404).json({ message: 'Staff profile not found.' });

    const { 
      name, gender, dob, address, city, state, pincode, 
      phone, email, emergencyContact, profilePic
    } = req.body;

    // We allow updating basic info but not role or assignedMandir which are admin controlled
    const updateData = {
      name: name || staffProfile.name,
      gender: gender || staffProfile.gender,
      dob: dob || staffProfile.dob,
      address: address || staffProfile.address,
      city: city || staffProfile.city,
      state: state || staffProfile.state,
      pincode: pincode || staffProfile.pincode,
      'contact.emergencyContact': emergencyContact || staffProfile.contact.emergencyContact,
    };

    if (profilePic) updateData['media.profilePic'] = profilePic;

    // If phone/email is updated, we also need to update the User model
    if (phone && phone !== staffProfile.contact.phone) {
      updateData['contact.phone'] = phone;
      user.phone = phone;
    }
    if (email && email !== staffProfile.contact.email) {
      updateData['contact.email'] = email;
      user.email = email;
    }

    await user.save();
    
    const updatedStaff = await Staff.findByIdAndUpdate(staffProfile._id, { $set: updateData }, { new: true });
    
    res.status(200).json({ message: "Profile updated successfully", data: updatedStaff });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};
