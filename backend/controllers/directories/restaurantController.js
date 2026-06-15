import Restaurant from '../../models/directories/Restaurant.js';
import Staff from '../../models/users/Staff.js';
import User from '../../models/users/User.js';
import { restaurantValidationSchema } from '../../validation/directoryValidation.js';

export const createRestaurant = async (req, res) => {
  try {
    const { error } = restaurantValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (req.user && req.user.role === 'staff') {
      const user = await User.findById(req.user._id);
      if (user) {
        const staffProfile = await Staff.findOne({
          $or: [{ 'contact.email': user.email }, { 'contact.phone': user.phone }]
        });
        if (staffProfile) {
          req.body.onboardedBy = staffProfile._id;
          if (staffProfile.employment) {
            if (staffProfile.employment.assignedMandir) req.body.mandir = staffProfile.employment.assignedMandir;
            if (staffProfile.employment.assignedDham) req.body.dham = staffProfile.employment.assignedDham;
          }
        }
      }
    }

    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    
    res.status(201).json({ message: 'Restaurant onboarded successfully', restaurant });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ message: 'Server error while onboarding restaurant' });
  }
};

export const getRestaurants = async (req, res) => {
  try {
    const { mandir, dham, page, limit } = req.query;
    const filter = {};
    if (mandir) filter.mandir = mandir;
    if (dham) filter.dham = dham;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const totalItems = await Restaurant.countDocuments(filter);
    const restaurants = await Restaurant.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      data: restaurants,
      totalPages: Math.ceil(totalItems / limitNum),
      currentPage: pageNum,
      totalItems
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Server error while fetching restaurants' });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('mandir', 'name location')
      .populate('dham', 'name location');
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.status(200).json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
    res.status(500).json({ message: 'Server error while fetching restaurant details' });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, req.body, { new: true });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.status(200).json({ message: 'Restaurant updated successfully', restaurant });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ message: 'Server error while updating restaurant' });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndDelete(id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ message: 'Server error while deleting restaurant' });
  }
};
