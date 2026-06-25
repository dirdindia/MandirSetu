import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { MapPin, Phone, Mail, User, ShieldCheck, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

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

  const generateInvoice = (order, paymentId) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(249, 115, 22); // orange-500
    doc.text("MandirSetu", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Payment ID: ${paymentId}`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);
    
    // Customer Details
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text("Bill To:", 14, 45);
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(order.customerDetails.fullName, 14, 52);
    doc.text(order.customerDetails.mobile, 14, 57);
    doc.text(order.customerDetails.email, 14, 62);
    doc.text(`${order.customerDetails.address}, ${order.customerDetails.city}`, 14, 67);
    doc.text(`${order.customerDetails.state} - ${order.customerDetails.pincode}`, 14, 72);

    // Table
    const tableColumn = ["Item", "Quantity", "Price", "Total"];
    const tableRows = [];

    order.items.forEach(item => {
      const itemData = [
        item.name,
        item.quantity.toString(),
        `Rs. ${item.price}`,
        `Rs. ${item.price * item.quantity}`
      ];
      tableRows.push(itemData);
    });

    autoTable(doc, {
      startY: 85,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [249, 115, 22] }, // orange header
      styles: { fontSize: 10 },
      margin: { top: 10 },
    });

    // Total Amount
    const finalY = doc.lastAutoTable.finalY || 85;
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text(`Total Amount: Rs. ${order.totalAmount}`, 14, finalY + 15);
    
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Thank you for shopping with MandirSetu!", 14, finalY + 30);

    // Download
    doc.save(`Invoice_${paymentId}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
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

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      Swal.fire('Error', 'Razorpay SDK failed to load. Are you online?', 'error');
      setIsProcessing(false);
      return;
    }

    try {
      // Create order from backend
      const result = await api.post('/ecommerce/payment/create-order', { amount: cartTotal });
      if (!result.data) {
        Swal.fire('Error', 'Server error. Are you online?', 'error');
        setIsProcessing(false);
        return;
      }

      const { amount, id: order_id, currency } = result.data;

      const options = {
        key: 'rzp_test_T5QCR3Ba0l8d1E', // Provided Test Key
        amount: amount.toString(),
        currency: currency,
        name: 'MandirSetu',
        description: 'E-commerce Purchase',
        order_id: order_id,
        handler: async function (response) {
          const data = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            orderPayload: orderPayload
          };

          try {
            const verifyRes = await api.post('/ecommerce/payment/verify-payment', data);
            if (verifyRes.data.message === 'Payment verified successfully') {
              Swal.fire({
                title: 'Order Placed Successfully!',
                html: `Thank you, ${formData.fullName}!<br/>Your Payment ID is: <b>${response.razorpay_payment_id}</b>`,
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#f97316',
                confirmButtonText: 'Great!',
                cancelButtonText: 'Download Invoice',
                allowOutsideClick: false
              }).then((result) => {
                if (result.dismiss === Swal.DismissReason.cancel) {
                  generateInvoice(orderPayload, response.razorpay_payment_id);
                }
                clearCart();
                navigate('/');
              });
            } else {
              Swal.fire('Error', 'Payment Verification Failed!', 'error');
            }
          } catch (error) {
            Swal.fire('Error', 'Payment Verification Failed due to server error!', 'error');
            console.error(error);
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: '#f97316', // orange-500
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment Error:', error);
      Swal.fire('Error', 'Something went wrong during payment initialization.', 'error');
      setIsProcessing(false);
    }
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
                  <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-orange-500/20 text-lg flex justify-center items-center gap-2"
                  >
                    {isProcessing ? (
                      <><Loader2 className="animate-spin" size={24} /> Processing...</>
                    ) : (
                      <><ShieldCheck size={24} /> Place Order Securely</>
                    )}
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
                <button 
                  disabled={isProcessing}
                  onClick={() => {
                    const form = document.querySelector('form');
                    if (form.checkValidity()) {
                      form.requestSubmit();
                    } else {
                      form.reportValidity();
                    }
                  }} 
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-orange-500/20 text-lg flex justify-center items-center gap-2"
                >
                  {isProcessing ? (
                    <><Loader2 className="animate-spin" size={24} /> Processing...</>
                  ) : (
                    <><ShieldCheck size={24} /> Place Order Securely</>
                  )}
                </button>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
