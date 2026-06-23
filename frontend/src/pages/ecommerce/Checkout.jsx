import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { MapPin, Phone, Mail, User, ShieldCheck } from 'lucide-react';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare order payload for future API integration
    // Including mandir_id and dham_id so staff can filter orders
    const orderItems = cart.map(item => ({
      product_id: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.sellingPrice || item.product.price,
      mandir_id: item.product.mandir_id?._id || item.product.mandir_id || null,
      dham_id: item.product.dham_id?._id || item.product.dham_id || null,
    }));

    const orderPayload = {
      customerDetails: formData,
      items: orderItems,
      totalAmount: cartTotal
    };

    console.log("Prepared Order Payload for backend:", orderPayload);

    // Simulate successful order
    alert(`Order Placed Successfully for ${formData.fullName}!\n\nPayload prepared in console. Includes mandir/dham IDs for staff categorization.`);
    clearCart();
    navigate('/');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-950">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">Your Cart is Empty</h2>
        <Link to="/services?type=shops" className="text-orange-500 hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-8 border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">Shipping Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        type="text" 
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Mobile Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        type="tel" 
                        name="mobile"
                        required
                        value={formData.mobile}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Complete Address</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-400" />
                    </div>
                    <textarea 
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="pl-10 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
                      placeholder="House No, Street, Landmark"
                    ></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">City</label>
                    <input 
                      type="text" 
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
                      placeholder="City Name"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">State</label>
                    <input 
                      type="text" 
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
                      placeholder="State"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Pincode</label>
                    <input 
                      type="text" 
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"
                      placeholder="Pincode"
                    />
                  </div>
                </div>
                
                <div className="pt-6 hidden lg:block">
                  <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-orange-500/20 text-lg flex justify-center items-center gap-2">
                    <ShieldCheck size={24} /> Place Order Securely
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 border border-slate-100 dark:border-slate-800 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
                {cart.map((item) => (
                  <div key={item.product._id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                        <img src={item.product.displayImage} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">
                      ₹{(item.product.sellingPrice || item.product.price) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Free</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-lg font-black text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 pt-4 mb-8">
                <span>Total</span>
                <span className="text-orange-600 dark:text-orange-500">₹{cartTotal}</span>
              </div>
              
              <div className="lg:hidden">
                <button onClick={() => {
                  const form = document.querySelector('form');
                  if (form.checkValidity()) {
                    form.requestSubmit();
                  } else {
                    form.reportValidity();
                  }
                }} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-orange-500/20 text-lg flex justify-center items-center gap-2">
                  <ShieldCheck size={24} /> Place Order Securely
                </button>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
