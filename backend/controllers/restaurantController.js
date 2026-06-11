import Restaurant from '../models/Restaurant.js';
import { restaurantValidationSchema } from '../validation/directoryValidation.js';

export const createRestaurant = async (req, res) => {
  try {
    const { error } = restaurantValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
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
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Server error while fetching restaurants' });
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
