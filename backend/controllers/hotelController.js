import Hotel from '../models/Hotel.js';
import { hotelValidationSchema } from '../validation/directoryValidation.js';

export const createHotel = async (req, res) => {
  try {
    const { error } = hotelValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const hotel = new Hotel(req.body);
    await hotel.save();
    
    res.status(201).json({ message: 'Hotel onboarded successfully', hotel });
  } catch (error) {
    console.error('Error creating hotel:', error);
    res.status(500).json({ message: 'Server error while onboarding hotel' });
  }
};

export const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    res.status(200).json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ message: 'Server error while fetching hotels' });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findByIdAndUpdate(id, req.body, { new: true });
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.status(200).json({ message: 'Hotel updated successfully', hotel });
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({ message: 'Server error while updating hotel' });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findByIdAndDelete(id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.status(200).json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({ message: 'Server error while deleting hotel' });
  }
};
