import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Order from '../../models/ecommerce/Order.js';
import User from '../../models/users/User.js';
import bcrypt from 'bcryptjs';
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_T5QCR3Ba0l8d1E',
  key_secret: process.env.RAZORPAY_SECRET || 'GxIHwXd0smw8Eho5cDiOnbDr',
});

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).json({ message: 'Error creating order' });
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Error creating razorpay order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderPayload } = req.body;

    const secret = process.env.RAZORPAY_SECRET || 'GxIHwXd0smw8Eho5cDiOnbDr';
    
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment is successful, save the order
      if (orderPayload) {
        let user_id = req.user ? req.user._id : undefined;
        
        // Find or create customer account if not logged in
        if (!user_id && orderPayload.customerDetails && orderPayload.customerDetails.email) {
          let user = await User.findOne({ email: orderPayload.customerDetails.email });
          
          if (!user) {
            const mobile = orderPayload.customerDetails.mobile || '0000000000';
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(mobile, salt);
            
            user = new User({
              email: orderPayload.customerDetails.email,
              phone: mobile,
              password: hashedPassword,
              role: 'user'
            });
            await user.save();
          }
          user_id = user._id;
        }

        const newOrder = new Order({
          user_id: user_id,
          customerDetails: orderPayload.customerDetails,
          items: orderPayload.items,
          totalAmount: orderPayload.totalAmount,
          paymentDetails: {
            razorpay_order_id,
            razorpay_payment_id,
            status: 'Success'
          },
          status: 'Processing'
        });
        await newOrder.save();
      }

      return res.status(200).json({ message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Error verifying razorpay payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
