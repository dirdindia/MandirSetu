import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api';

export default function Orders() {
  const [activeTab, setActiveTab] = useState('group'); // 'ecommerce', 'services', 'group'
  
  // Group Bookings State
  const [groupBookings, setGroupBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'group') {
      fetchGroupBookings();
    } else {
      setLoading(false);
    }
  }, [activeTab]);

  const fetchGroupBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/bulk-bookings/my-bookings', {
        headers: { 'auth-token': token }
      });
      setGroupBookings(res.data.data);
    } catch (error) {
      console.error('Error fetching bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayAdvance = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      
      const initRes = await api.post(`/bulk-bookings/${bookingId}/pay-advance`, {}, {
        headers: { 'auth-token': token }
      });
      
      const { order, booking } = initRes.data.data;

      const options = {
        key: 'dummy_key_id',
        amount: order.amount,
        currency: order.currency,
        name: "MandirSetu",
        description: `Advance for Group Yatra: ${booking.destination}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            await api.post(`/bulk-bookings/${bookingId}/verify-advance`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }, {
              headers: { 'auth-token': token }
            });
            alert('Payment Successful! Your booking is confirmed.');
            fetchGroupBookings();
          } catch (err) {
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: booking.contactDetails.name,
          email: booking.contactDetails.email,
          contact: booking.contactDetails.phone
        },
        theme: {
          color: "#ea580c" // orange-600
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error', error);
      alert('Failed to initialize payment.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-serif text-slate-900 mb-8">My Orders & Bookings</h1>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('ecommerce')}
            className={`py-3 px-6 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'ecommerce' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Product Orders
          </button>
          <button 
            onClick={() => setActiveTab('services')}
            className={`py-3 px-6 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'services' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Puja/Service Bookings
          </button>
          <button 
            onClick={() => setActiveTab('group')}
            className={`py-3 px-6 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'group' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Group Yatra Bookings
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500">Loading...</div>
        ) : (
          <>
            {/* E-Commerce Tab */}
            {activeTab === 'ecommerce' && (
              <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
                <span className="text-4xl block mb-4">🛍️</span>
                <p className="text-gray-500">You don't have any product orders yet.</p>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
                <span className="text-4xl block mb-4">🪔</span>
                <p className="text-gray-500">You don't have any Puja or Service bookings yet.</p>
              </div>
            )}

            {/* Group Bookings Tab */}
            {activeTab === 'group' && (
              groupBookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
                  <span className="text-4xl block mb-4">🚌</span>
                  <p className="text-gray-500">You don't have any group bookings yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {groupBookings.map(booking => (
                    <motion.div 
                      key={booking._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden"
                    >
                      <div className="bg-orange-50 p-6 border-b border-orange-100 flex flex-wrap justify-between items-center gap-4">
                        <div>
                          <h2 className="text-xl font-serif text-slate-900 font-bold">{booking.destination}</h2>
                          <p className="text-sm text-gray-600">Group of {booking.groupSize} Devotees</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2
                            ${booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                            ${booking.status === 'Quote Sent' ? 'bg-blue-100 text-blue-700' : ''}
                            ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : ''}
                          `}>
                            {booking.status}
                          </span>
                          <span className="text-xs text-gray-400">Requested on: {new Date(booking.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 border-b pb-2">Travel Details</h3>
                            <p className="text-sm mb-1"><span className="text-gray-500 w-24 inline-block">Start Date:</span> {new Date(booking.dateRange.startDate).toLocaleDateString()}</p>
                            <p className="text-sm mb-1"><span className="text-gray-500 w-24 inline-block">End Date:</span> {new Date(booking.dateRange.endDate).toLocaleDateString()}</p>
                            <p className="text-sm mt-4"><span className="text-gray-500 w-24 inline-block">Services:</span></p>
                            <ul className="list-disc list-inside text-sm text-gray-700 ml-2 mt-1 space-y-1">
                              {booking.requestedServices.map(srv => <li key={srv}>{srv}</li>)}
                            </ul>
                          </div>

                          {booking.status === 'Quote Sent' && booking.quoteDetails?.length > 0 && (
                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                              <h3 className="text-sm font-bold text-slate-800 uppercase mb-3 border-b border-gray-300 pb-2">Itemized Quote Received</h3>
                              <div className="space-y-2 mb-4">
                                {booking.quoteDetails.map((item, idx) => (
                                  <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-gray-700">{item.service}</span>
                                    <span className="font-semibold text-gray-900">₹{item.cost.toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="border-t border-gray-300 pt-3 flex justify-between items-center mb-2">
                                <span className="font-bold text-gray-900">Total Estimate</span>
                                <span className="font-bold text-orange-600 text-lg">₹{booking.totalAmount.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center mb-6 text-sm">
                                <span className="text-gray-600">Advance Required</span>
                                <span className="font-semibold text-blue-600">₹{booking.advanceRequired.toLocaleString()}</span>
                              </div>
                              <button 
                                onClick={() => handlePayAdvance(booking._id)}
                                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-md"
                              >
                                Pay Advance & Confirm Booking
                              </button>
                            </div>
                          )}
                          
                          {booking.status === 'Confirmed' && (
                            <div className="bg-green-50 p-5 rounded-2xl border border-green-200 flex flex-col justify-center items-center text-center">
                              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mb-3">✓</div>
                              <h3 className="text-lg font-bold text-green-800 mb-1">Booking Confirmed</h3>
                              <p className="text-sm text-green-700 mb-2">Advance of ₹{booking.advancePaid?.toLocaleString()} received.</p>
                              <p className="text-xs text-green-600">Our coordinator will contact you shortly with the final itinerary.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
