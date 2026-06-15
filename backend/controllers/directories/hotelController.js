import Hotel from '../../models/directories/Hotel.js';
import Staff from '../../models/users/Staff.js';
import User from '../../models/users/User.js';
import { hotelValidationSchema } from '../../validation/directoryValidation.js';

export const createHotel = async (req, res) => {
  try {
    const { error } = hotelValidationSchema.validate(req.body);
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
    const { mandir, dham, page, limit } = req.query;
    const filter = {};
    if (mandir) filter.mandir = mandir;
    if (dham) filter.dham = dham;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const totalItems = await Hotel.countDocuments(filter);
    const hotels = await Hotel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      data: hotels,
      totalPages: Math.ceil(totalItems / limitNum),
      currentPage: pageNum,
      totalItems
    });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ message: 'Server error while fetching hotels' });
  }
};

export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('mandir', 'name location')
      .populate('dham', 'name location');
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.status(200).json(hotel);
  } catch (error) {
    console.error('Error fetching hotel details:', error);
    res.status(500).json({ message: 'Server error while fetching hotel details' });
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
