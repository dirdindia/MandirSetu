import Staff from '../models/Staff.js';
import { createNotification } from './notificationController.js';

// Create new staff
export const hireStaff = async (req, res) => {
  try {
    const { 
      name, gender, dob, address, city, state, pincode, latitude, longitude,
      phone, email, emergencyContact, 
      role, assignedMandir, 
      profilePic, documentType, documentUrl 
    } = req.body;

    if (!name || !phone || !role || !gender) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

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
        assignedMandir: assignedMandir || null 
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
