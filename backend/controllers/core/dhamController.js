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

    const filter = {};
    if (req.query.sect) {
      filter.category = req.query.sect;
    }

    const totalItems = await Dham.countDocuments(filter);
    const dhams = await Dham.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

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

export const getDhamFullDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const type = req.query.type || 'overview';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (type === 'overview') {
      const dham = await Dham.findById(id);
      if (!dham) return res.status(404).json({ message: 'Dham not found' });
      return res.status(200).json(dham);
    }

    let ModelToFetch;
    let populateField = 'onboardedBy';
    let queryField = 'dham';
    
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
        queryField = 'dham_id';
        break;
      case 'products':
        ModelToFetch = (await import('../../models/ecommerce/Product.js')).default;
        populateField = [
          { path: 'category', select: 'name' },
          { path: 'onboardedBy', select: 'name contact' }
        ];
        queryField = 'dham_id';
        break;
      case 'orders':
        ModelToFetch = (await import('../../models/ecommerce/Order.js')).default;
        populateField = null;
        queryField = 'items.dham_id';
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
