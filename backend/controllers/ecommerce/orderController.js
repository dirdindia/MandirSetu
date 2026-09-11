import Order from '../../models/ecommerce/Order.js';
import User from '../../models/users/User.js';
import Staff from '../../models/users/Staff.js';
import jwt from 'jsonwebtoken';

export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { mandir_id, dham_id, status } = req.query;

    const query = {};

    if (mandir_id) {
      query['items.mandir_id'] = mandir_id;
    }
    if (dham_id) {
      query['items.dham_id'] = dham_id;
    }

    // Secure staff filtering - lookup Staff model (not User) for employment data
    const token = req.header('auth-token') || req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey123');
        if (verified.role === 'staff') {
          const user = await User.findById(verified._id);
          if (user) {
            const staffProfile = await Staff.findOne({
              $or: [{ 'contact.email': user.email }, { 'contact.phone': user.phone }]
            }).populate('employment.assignedMandir employment.assignedDham');
            if (staffProfile?.employment?.assignedMandir) {
              query['items.mandir_id'] = staffProfile.employment.assignedMandir._id;
            } else if (staffProfile?.employment?.assignedDham) {
              query['items.dham_id'] = staffProfile.employment.assignedDham._id;
            }
            // If neither is set (global staff), query stays empty → returns ALL orders
          }
        }
      } catch (err) {
        // Fallback to query params if not logged in
      }
    }
    if (status) {
      query.status = status;
    }

    const totalItems = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('items.product_id')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: orders,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error updating status' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Server error deleting order' });
  }
};
