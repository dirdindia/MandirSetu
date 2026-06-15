import Dham from '../../models/core/Dham.js';
import { createNotification } from '../../controllers/system/notificationController.js';
import { mandirDhamValidationSchema } from '../../validation/directoryValidation.js';

export const createDham = async (req, res) => {
  try {
    const { 
      name, establishedYear, mainDeity, description, 
      address, city, state, pincode, 
      phone, email, website,
      profilePic, gallery, latitude, longitude,
      category, schedule, howToReach
    } = req.body;

    // Joi validation
    const { error } = mandirDhamValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newDham = new Dham({
      name,
      establishedYear,
      mainDeity,
      category,
      description,
      schedule,
      howToReach,
      location: {
        address,
        city,
        state,
        pincode,
      },
      contact: {
        phone,
        email,
        website,
      },
      profilePic,
      gallery,
      geolocation: {
        latitude,
        longitude
      }
    });

    const savedDham = await newDham.save();
    
    // Create notification
    await createNotification(
      'New Dham Onboarded',
      `The Dham "${name}" in ${city} has been successfully added to the platform.`,
      'success',
      '/onboard-dham' // View link
    );

    res.status(201).json({
      message: 'Dham onboarded successfully',
      dham: savedDham
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDhams = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalItems = await Dham.countDocuments();
    const dhams = await Dham.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.status(200).json({
      data: dhams,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDhamById = async (req, res) => {
  try {
    const dham = await Dham.findById(req.params.id);
    if (!dham) {
      return res.status(404).json({ message: 'Dham not found' });
    }
    res.status(200).json(dham);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateDham = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, establishedYear, mainDeity, description, 
      address, city, state, pincode, 
      phone, email, website,
      profilePic, gallery, latitude, longitude,
      category, schedule, howToReach
    } = req.body;

    const { error } = mandirDhamValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updatedDham = await Dham.findByIdAndUpdate(
      id,
      {
        name, establishedYear, mainDeity, category, description, schedule, howToReach,
        location: { address, city, state, pincode },
        contact: { phone, email, website },
        profilePic, gallery,
        geolocation: { latitude, longitude }
      },
      { new: true }
    );

    if (!updatedDham) return res.status(404).json({ message: 'Dham not found' });
    
    res.status(200).json({ message: 'Dham updated successfully', dham: updatedDham });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteDham = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDham = await Dham.findByIdAndDelete(id);
    if (!deletedDham) return res.status(404).json({ message: 'Dham not found' });
    res.status(200).json({ message: 'Dham deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
