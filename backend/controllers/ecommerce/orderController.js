import Order from '../../models/ecommerce/Order.js';

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
