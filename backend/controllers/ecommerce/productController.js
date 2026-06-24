import Product from '../../models/ecommerce/Product.js';
import User from '../../models/users/User.js';
import Staff from '../../models/users/Staff.js';

// Create a Product
export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, sellingPrice, stock, unit, displayImage, gallery, isVisible, mandir_id, dham_id } = req.body;

    if (!mandir_id && !dham_id) {
      return res.status(400).json({ message: 'Either Mandir ID or Dham ID is compulsory to create a product' });
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

    const newProduct = new Product({
      name,
      description,
      category,
      price,
      sellingPrice,
      stock,
      unit,
      displayImage,
      gallery,
      isVisible,
      mandir_id,
      dham_id,
      onboardedBy: staffId
    });

    await newProduct.save();
    
    // Populate category so frontend has the name immediately
    const populatedProduct = await Product.findById(newProduct._id).populate('category', 'name');
    res.status(201).json(populatedProduct);
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Products with Pagination and Filters
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', mandir_id, dham_id } = req.query;

    let query = {};
    if (mandir_id) query.mandir_id = mandir_id;
    if (dham_id) query.dham_id = dham_id;
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalItems = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalItems / Number(limit));

    res.status(200).json({
      data: products,
      currentPage: Number(page),
      totalPages,
      totalItems,
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate('category', 'name')
      .populate('mandir_id', 'name location')
      .populate('dham_id', 'name location');
      
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true }).populate('category', 'name');
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle Visibility
export const toggleVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product.isVisible = !product.isVisible;
    await product.save();
    
    res.status(200).json({ isVisible: product.isVisible });
  } catch (error) {
    console.error('Error in toggleVisibility:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
