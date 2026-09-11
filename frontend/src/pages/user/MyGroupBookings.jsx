import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api';

export default function MyGroupBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/bulk-bookings/my-bookings', {
        headers: { 'auth-token': token }
      });
      setBookings(res.data.data);
    } catch (error) {
      console.error('Error fetching bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayAdvance = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      
      // 1. Initialize payment
      const initRes = await api.post(`/bulk-bookings/${bookingId}/pay-advance`, {}, {
        headers: { 'auth-token': token }
      });
      
      const { order, booking } = initRes.data.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: 'dummy_key_id', // Replace with real Razorpay key in production
        amount: order.amount,
        currency: order.currency,
        name: "MandirSetu",
        description: `Advance for Group Yatra: ${booking.destination}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            await api.post(`/bulk-bookings/${bookingId}/verify-advance`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }, {
              headers: { 'auth-token': token }
            });
            alert('Payment Successful! Your booking is confirmed.');
            fetchBookings();
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
          color: "#791916" // Maroon
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error', error);
      alert('Failed to initialize payment.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-serif text-maroon mb-8">My Group Yatra Bookings</h1>
        
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <p className="text-gray-500 mb-4">You don't have any group bookings yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <motion.div 
                key={booking._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden"
              >
                <div className="bg-maroon/5 p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <h2 className="text-xl font-serif text-maroon font-bold">{booking.destination}</h2>
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
                        <h3 className="text-sm font-bold text-maroon uppercase mb-3 border-b border-gray-300 pb-2">Itemized Quote Received</h3>
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
                          <span className="font-bold text-maroon text-lg">₹{booking.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 text-sm">
                          <span className="text-gray-600">Advance Required</span>
                          <span className="font-semibold text-blue-600">₹{booking.advanceRequired.toLocaleString()}</span>
                        </div>
                        <button 
                          onClick={() => handlePayAdvance(booking._id)}
                          className="w-full py-3 bg-maroon hover:bg-maroon-dark text-white font-bold rounded-xl transition-colors shadow-md"
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
        )}
      </div>
    </div>
  );
}
