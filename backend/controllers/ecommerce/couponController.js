import Coupon from '../../models/ecommerce/Coupon.js';
import User from '../../models/users/User.js';
import Staff from '../../models/users/Staff.js';

// Create a Coupon
export const createCoupon = async (req, res) => {
  try {
    const { 
      code, discountType, discountValue, banner, isActive, 
      mandir_id, dham_id, applicabilityType, applicableCategories, applicableProducts 
    } = req.body;

    if (!mandir_id && !dham_id) {
      return res.status(400).json({ message: 'Either Mandir ID or Dham ID is compulsory to create a coupon' });
    }

    if (!code || !discountType || !discountValue) {
      return res.status(400).json({ message: 'Code, discount type, and discount value are required' });
    }

    // Check if code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    let staffId = null;
    if (req.user && req.user.role === 'staff') {
      const user = await User.findById(req.user._id);
      if (user) {
        const staffProfile = await Staff.findOne({
          $or: [{ 'contact.email': user.email }, { 'contact.phone': user.phone }]
        });
        if (staffProfile) {
          staffId = staffProfile._id;
        }
      }
    }

    if (!staffId) {
      return res.status(403).json({ message: 'Staff profile not found or unauthorized' });
    }

    const newCoupon = new Coupon({
      code,
      discountType,
      discountValue,
      banner,
      isActive: isActive !== undefined ? isActive : true,
      applicabilityType: applicabilityType || 'all',
      applicableCategories: applicabilityType === 'specific_categories' ? (applicableCategories || []) : [],
      applicableProducts: applicabilityType === 'specific_products' ? (applicableProducts || []) : [],
      mandir_id: mandir_id || undefined,
      dham_id: dham_id || undefined,
      onboardedBy: staffId
    });

    await newCoupon.save();
    res.status(201).json(newCoupon);
  } catch (error) {
    console.error('Error in createCoupon:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Coupons with Pagination and Filters
export const getCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', mandir_id, dham_id } = req.query;

    let query = {};
    if (mandir_id) query.mandir_id = mandir_id;
    if (dham_id) query.dham_id = dham_id;
    
    if (search) {
      query.code = { $regex: search, $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const coupons = await Coupon.find(query)
      .populate('applicableCategories', 'name')
      .populate('applicableProducts', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalItems = await Coupon.countDocuments(query);
    const totalPages = Math.ceil(totalItems / Number(limit));

    res.status(200).json({
      data: coupons,
      currentPage: Number(page),
      totalPages,
      totalItems,
    });
  } catch (error) {
    console.error('Error in getCoupons:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a Coupon
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, ...rest } = req.body;
    
    // If code is updated, check for duplicates
    if (code) {
      const existingCoupon = await Coupon.findOne({ code: code.toUpperCase(), _id: { $ne: id } });
      if (existingCoupon) {
        return res.status(400).json({ message: 'Coupon code already exists' });
      }
      rest.code = code.toUpperCase();
    }
    
    // Clean up arrays based on applicabilityType before saving
    if (rest.applicabilityType === 'all') {
      rest.applicableCategories = [];
      rest.applicableProducts = [];
    } else if (rest.applicabilityType === 'specific_categories') {
      rest.applicableProducts = [];
    } else if (rest.applicabilityType === 'specific_products') {
      rest.applicableCategories = [];
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(id, rest, { new: true })
      .populate('applicableCategories', 'name')
      .populate('applicableProducts', 'name');
    
    if (!updatedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    res.status(200).json(updatedCoupon);
  } catch (error) {
    console.error('Error in updateCoupon:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a Coupon
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    
    if (!deletedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCoupon:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle Visibility / Status
export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    
    res.status(200).json({ isActive: coupon.isActive });
  } catch (error) {
    console.error('Error in toggleStatus:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
