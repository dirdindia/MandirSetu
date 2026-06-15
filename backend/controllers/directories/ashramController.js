import Ashram from '../../models/directories/Ashram.js';
import Staff from '../../models/users/Staff.js';
import User from '../../models/users/User.js';
import { ashramValidationSchema } from '../../validation/directoryValidation.js';

export const createAshram = async (req, res) => {
  try {
    const { error } = ashramValidationSchema.validate(req.body);
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

    const ashram = new Ashram(req.body);
    await ashram.save();
    
    res.status(201).json({ message: 'Ashram onboarded successfully', ashram });
  } catch (error) {
    console.error('Error creating ashram:', error);
    res.status(500).json({ message: 'Server error while onboarding ashram' });
  }
};

export const getAshrams = async (req, res) => {
  try {
    const { mandir, dham, page, limit } = req.query;
    const filter = {};
    if (mandir) filter.mandir = mandir;
    if (dham) filter.dham = dham;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const totalItems = await Ashram.countDocuments(filter);
    const ashrams = await Ashram.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      data: ashrams,
      totalPages: Math.ceil(totalItems / limitNum),
      currentPage: pageNum,
      totalItems
    });
  } catch (error) {
    console.error('Error fetching ashrams:', error);
    res.status(500).json({ message: 'Server error while fetching ashrams' });
  }
};

export const getAshramById = async (req, res) => {
  try {
    const ashram = await Ashram.findById(req.params.id)
      .populate('mandir', 'name location')
      .populate('dham', 'name location');
    if (!ashram) return res.status(404).json({ message: 'Ashram not found' });
    res.status(200).json(ashram);
  } catch (error) {
    console.error('Error fetching ashram details:', error);
    res.status(500).json({ message: 'Server error while fetching ashram details' });
  }
};

export const updateAshram = async (req, res) => {
  try {
    const { id } = req.params;
    const ashram = await Ashram.findByIdAndUpdate(id, req.body, { new: true });
    if (!ashram) return res.status(404).json({ message: 'Ashram not found' });
    res.status(200).json({ message: 'Ashram updated successfully', ashram });
  } catch (error) {
    console.error('Error updating ashram:', error);
    res.status(500).json({ message: 'Server error while updating ashram' });
  }
};

export const deleteAshram = async (req, res) => {
  try {
    const { id } = req.params;
    const ashram = await Ashram.findByIdAndDelete(id);
    if (!ashram) return res.status(404).json({ message: 'Ashram not found' });
    res.status(200).json({ message: 'Ashram deleted successfully' });
  } catch (error) {
    console.error('Error deleting ashram:', error);
    res.status(500).json({ message: 'Server error while deleting ashram' });
  }
};
