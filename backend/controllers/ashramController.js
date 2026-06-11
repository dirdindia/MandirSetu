import Ashram from '../models/Ashram.js';
import { ashramValidationSchema } from '../validation/directoryValidation.js';

export const createAshram = async (req, res) => {
  try {
    const { error } = ashramValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
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
    const ashrams = await Ashram.find().sort({ createdAt: -1 });
    res.status(200).json(ashrams);
  } catch (error) {
    console.error('Error fetching ashrams:', error);
    res.status(500).json({ message: 'Server error while fetching ashrams' });
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
