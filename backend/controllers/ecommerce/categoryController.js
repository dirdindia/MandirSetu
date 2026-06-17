import Category from '../../models/ecommerce/Category.js';
import User from '../../models/users/User.js';
import Staff from '../../models/users/Staff.js';

// @desc    Get all categories (filtered by mandir or dham)
// @route   GET /api/ecommerce/categories
// @access  Private/Staff
export const getCategories = async (req, res) => {
  try {
    const { mandir_id, dham_id } = req.query;
    
    // Build query based on provided context
    let query = {};
    if (mandir_id) query.mandir_id = mandir_id;
    if (dham_id) query.dham_id = dham_id;

    const categories = await Category.find(query).sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new category
// @route   POST /api/ecommerce/categories
// @access  Private/Staff
export const createCategory = async (req, res) => {
  try {
    const { name, description, image, isVisible, mandir_id, dham_id } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    if (!mandir_id && !dham_id) {
      return res.status(400).json({ message: 'Either Mandir ID or Dham ID is compulsory to create a category' });
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
      return res.status(403).json({ message: 'Staff profile not found' });
    }

    const newCategory = new Category({
      name,
      description,
      image,
      isVisible: isVisible !== undefined ? isVisible : true,
      mandir_id: mandir_id || undefined,
      dham_id: dham_id || undefined,
      onboardedBy: staffId
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an existing category
// @route   PUT /api/ecommerce/categories/:id
// @access  Private/Staff
export const updateCategory = async (req, res) => {
  try {
    const { name, description, image, isVisible } = req.body;
    
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.name = name || category.name;
    category.description = description !== undefined ? description : category.description;
    category.image = image !== undefined ? image : category.image;
    category.isVisible = isVisible !== undefined ? isVisible : category.isVisible;

    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/ecommerce/categories/:id
// @access  Private/Staff
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.deleteOne();
    res.status(200).json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle category visibility
// @route   PATCH /api/ecommerce/categories/:id/toggle-visibility
// @access  Private/Staff
export const toggleVisibility = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.isVisible = !category.isVisible;
    const updatedCategory = await category.save();
    
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
