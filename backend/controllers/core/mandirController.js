import Mandir from '../../models/core/Mandir.js';
import { createNotification } from '../../controllers/system/notificationController.js';
import { mandirDhamValidationSchema } from '../../validation/directoryValidation.js';

export const createMandir = async (req, res) => {
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

    const newMandir = new Mandir({
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalItems = await Mandir.countDocuments();
    const mandirs = await Mandir.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.status(200).json({
      data: mandirs,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMandirById = async (req, res) => {
  try {
    const mandir = await Mandir.findById(req.params.id);
    if (!mandir) {
      return res.status(404).json({ message: 'Mandir not found' });
    }
    res.status(200).json(mandir);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMandir = async (req, res) => {
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

    const updatedMandir = await Mandir.findByIdAndUpdate(
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

    if (!updatedMandir) return res.status(404).json({ message: 'Mandir not found' });
    
    res.status(200).json({ message: 'Mandir updated successfully', mandir: updatedMandir });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMandir = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMandir = await Mandir.findByIdAndDelete(id);
    if (!deletedMandir) return res.status(404).json({ message: 'Mandir not found' });
    res.status(200).json({ message: 'Mandir deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMandirFullDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const type = req.query.type || 'overview';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (type === 'overview') {
      const mandir = await Mandir.findById(id);
      if (!mandir) return res.status(404).json({ message: 'Mandir not found' });
      return res.status(200).json(mandir);
    }

    let ModelToFetch;
    let populateField = 'onboardedBy';
    let queryField = 'mandir';
    
    switch(type) {
      case 'hotels':
        ModelToFetch = (await import('../../models/directories/Hotel.js')).default;
        break;
      case 'restaurants':
        ModelToFetch = (await import('../../models/directories/Restaurant.js')).default;
        break;
      case 'ashrams':
        ModelToFetch = (await import('../../models/directories/Ashram.js')).default;
        break;
      case 'categories':
        ModelToFetch = (await import('../../models/ecommerce/Category.js')).default;
        populateField = 'onboardedBy';
        queryField = 'mandir_id';
        break;
      case 'products':
        ModelToFetch = (await import('../../models/ecommerce/Product.js')).default;
        populateField = [
          { path: 'category', select: 'name' },
          { path: 'onboardedBy', select: 'name contact' }
        ];
        queryField = 'mandir_id';
        break;
      default:
        return res.status(400).json({ message: 'Invalid type requested' });
    }

    const query = { [queryField]: id };
    const totalItems = await ModelToFetch.countDocuments(query);
    let itemsQuery = ModelToFetch.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    
    if (populateField) {
      if (Array.isArray(populateField)) {
        populateField.forEach(field => {
          itemsQuery = itemsQuery.populate(field.path, field.select);
        });
      } else {
        itemsQuery = itemsQuery.populate(populateField, 'name email contact');
      }
    }
    
    const items = await itemsQuery;

    res.status(200).json({
      data: items,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
