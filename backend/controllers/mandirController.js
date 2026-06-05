import Mandir from '../models/Mandir.js';
import { createNotification } from './notificationController.js';

export const createMandir = async (req, res) => {
  try {
    const { 
      name, establishedYear, mainDeity, description, 
      address, city, state, pincode, 
      phone, email, website,
      profilePic, gallery, latitude, longitude
    } = req.body;

    // Basic validation
    if (!name || !mainDeity || !address || !city || !state || !pincode || !phone) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const newMandir = new Mandir({
      name,
      establishedYear,
      mainDeity,
      description,
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

    const savedMandir = await newMandir.save();
    
    // Create notification
    await createNotification(
      'New Mandir Onboarded',
      `The temple "${name}" in ${city} has been successfully added to the platform.`,
      'success',
      '/onboard-mandir' // Or perhaps a view link in the future
    );

    res.status(201).json({
      message: 'Mandir onboarded successfully',
      mandir: savedMandir
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMandirs = async (req, res) => {
  try {
    const mandirs = await Mandir.find().sort({ createdAt: -1 });
    res.status(200).json(mandirs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
