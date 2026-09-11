import React, { useState, useEffect } from 'react';
import { CalendarDays, Users, MapPin, IndianRupee, FileText, Send, X, Plus, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api/axiosInstance';

export default function GroupBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Quote Modal State
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteItems, setQuoteItems] = useState([
    { service: 'Hotel/Ashram', cost: 0, description: '' }
  ]);
  const [advanceRequired, setAdvanceRequired] = useState(0);
  const [adminNotes, setAdminNotes] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bulk-bookings');
      setBookings(res.data.data);
    } catch (error) {
      console.error('Failed to fetch group bookings', error);
      Swal.fire('Error', 'Failed to load inquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenQuoteModal = (booking) => {
    setSelectedBooking(booking);
    
    // Pre-fill quote items based on requested services
    if (booking.requestedServices && booking.requestedServices.length > 0) {
      setQuoteItems(booking.requestedServices.map(srv => ({
        service: srv,
        cost: 0,
        description: ''
      })));
    } else {
      setQuoteItems([{ service: 'Other', cost: 0, description: '' }]);
    }
    
    setAdvanceRequired(0);
    setAdminNotes('');
    setShowQuoteModal(true);
  };

  const handleAddQuoteItem = () => {
    setQuoteItems([...quoteItems, { service: 'Other', cost: 0, description: '' }]);
  };

  const handleRemoveQuoteItem = (index) => {
    setQuoteItems(quoteItems.filter((_, idx) => idx !== index));
  };

  const handleQuoteItemChange = (index, field, value) => {
    const newItems = [...quoteItems];
    newItems[index][field] = value;
    setQuoteItems(newItems);
  };

  const handleSendQuote = async () => {
    try {
      const payload = {
        quoteDetails: quoteItems,
        advanceRequired: Number(advanceRequired),
        adminNotes
      };

      await api.patch(`/bulk-bookings/${selectedBooking._id}/quote`, payload);
      
      Swal.fire('Success', 'Quote has been sent to the devotee', 'success');
      setShowQuoteModal(false);
      fetchBookings(); // Refresh list
    } catch (error) {
      console.error('Failed to send quote', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to send quote', 'error');
    }
  };

  const totalQuoteCost = quoteItems.reduce((acc, item) => acc + Number(item.cost), 0);

  if (loading) return <div className="p-8">Loading Inquiries...</div>;

  return (
    <div className="p-8 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-maroon-darker font-bold">Group Yatra Bookings</h1>
          <p className="text-maroon-darker/60 mt-1">Manage large scale pilgrimage inquiries and send custom quotes.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gold/20 overflow-hidden">
        {bookings.length === 0 ? (
          <div className="p-10 text-center text-maroon-darker/50">No inquiries found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-premium border-b border-gold/20">
                  <th className="p-4 text-xs font-bold text-maroon-darker/70 uppercase tracking-wider">Devotee</th>
                  <th className="p-4 text-xs font-bold text-maroon-darker/70 uppercase tracking-wider">Destination</th>
                  <th className="p-4 text-xs font-bold text-maroon-darker/70 uppercase tracking-wider">Dates</th>
                  <th className="p-4 text-xs font-bold text-maroon-darker/70 uppercase tracking-wider">Group Size</th>
                  <th className="p-4 text-xs font-bold text-maroon-darker/70 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-maroon-darker/70 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {bookings.map(booking => (
                  <tr key={booking._id} className="hover:bg-gold/5 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-maroon-darker">{booking.contactDetails?.name || 'N/A'}</div>
                      <div className="text-xs text-maroon-darker/60">{booking.contactDetails?.email}</div>
                      <div className="text-xs text-maroon-darker/60">{booking.contactDetails?.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-semibold text-maroon-darker">
                        <MapPin size={16} className="text-maroon" /> {booking.destination}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-maroon-darker/80">
                      <div><span className="font-semibold">From:</span> {new Date(booking.dateRange.startDate).toLocaleDateString()}</div>
                      <div><span className="font-semibold">To:</span> {new Date(booking.dateRange.endDate).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-maroon-darker">
                        <Users size={16} className="text-gold" /> {booking.groupSize}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        ${booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${booking.status === 'Quote Sent' ? 'bg-maroon/10 text-blue-700' : ''}
                        ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : ''}
                      `}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {booking.status === 'Pending' && (
                        <button 
                          onClick={() => handleOpenQuoteModal(booking)}
                          className="px-4 py-2 bg-maroon hover:bg-maroon-darker text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 inline-flex"
                        >
                          <FileText size={16} /> Send Quote
                        </button>
                      )}
                      {booking.status === 'Quote Sent' && (
                        <span className="text-xs font-bold text-maroon">Awaiting Advance<br/>(₹{booking.advanceRequired})</span>
                      )}
                      {booking.status === 'Confirmed' && (
                        <span className="text-xs font-bold text-green-600">Advance Received<br/>(₹{booking.advancePaid})</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Send Quote Modal */}
      {showQuoteModal && selectedBooking && (
        <div className="fixed inset-0 bg-maroon-darker/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gold/20 flex justify-between items-center bg-premium">
              <h2 className="text-xl font-serif font-bold text-maroon-darker">
                Create Quote for {selectedBooking.destination}
              </h2>
              <button onClick={() => setShowQuoteModal(false)} className="p-2 hover:bg-gold/20 rounded-full transition-colors">
                <X size={20} className="text-maroon-darker" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-premium">
              
              {/* Inquiry Details Summary */}
              <div className="bg-white p-4 rounded-xl border border-gold/20 mb-6 shadow-sm">
                <h3 className="text-xs font-bold text-maroon uppercase tracking-wider mb-3">Inquiry Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="block text-gray-500">Devotee</span>
                    <span className="font-semibold text-gray-900">{selectedBooking.contactDetails.name}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500">Group Size</span>
                    <span className="font-semibold text-gray-900">{selectedBooking.groupSize} People</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-gray-500">Requested Services</span>
                    <span className="font-semibold text-gray-900">{selectedBooking.requestedServices.join(', ')}</span>
                  </div>
                </div>
                {selectedBooking.specialRequirements && (
                  <div className="mt-3 text-sm">
                    <span className="block text-gray-500">Special Notes from Devotee:</span>
                    <p className="font-medium text-red-700 bg-red-50 p-2 rounded-lg mt-1">{selectedBooking.specialRequirements}</p>
                  </div>
                )}
              </div>

              {/* Itemized Quote Form */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-maroon-darker uppercase tracking-wider">Itemized Cost Estimate</h3>
                  <button onClick={handleAddQuoteItem} className="text-xs font-bold text-maroon hover:text-maroon-darker flex items-center gap-1 bg-maroon/10 px-3 py-1.5 rounded-lg">
                    <Plus size={14} /> Add Service
                  </button>
                </div>
                
                <div className="space-y-3">
                  {quoteItems.map((item, idx) => (
                    <div key={idx} className="flex flex-wrap md:flex-nowrap gap-3 items-start bg-white p-3 rounded-xl border border-gold/20 shadow-sm">
                      <div className="w-full md:w-1/4">
                        <label className="text-xs text-gray-500 mb-1 block">Service Type</label>
                        <select 
                          value={item.service}
                          onChange={(e) => handleQuoteItemChange(idx, 'service', e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                        >
                          <option value="Hotel/Ashram">Hotel/Ashram</option>
                          <option value="Food/Bhandara">Food/Bhandara</option>
                          <option value="Local Transport">Local Transport</option>
                          <option value="Pandit/Puja">Pandit/Puja</option>
                          <option value="Prasad">Prasad</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="w-full md:w-1/2">
                        <label className="text-xs text-gray-500 mb-1 block">Description (Optional)</label>
                        <input 
                          type="text" 
                          value={item.description}
                          onChange={(e) => handleQuoteItemChange(idx, 'description', e.target.value)}
                          placeholder="e.g. 50 non-AC rooms for 2 nights"
                          className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                        />
                      </div>
                      <div className="w-full md:w-1/4">
                        <label className="text-xs text-gray-500 mb-1 block">Cost (₹)</label>
                        <div className="flex gap-2">
                          <input 
                            type="number" 
                            min="0"
                            value={item.cost}
                            onChange={(e) => handleQuoteItemChange(idx, 'cost', e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                          />
                          <button 
                            onClick={() => handleRemoveQuoteItem(idx)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            disabled={quoteItems.length === 1}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals & Advance */}
              <div className="bg-premium border border-gold/30 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-maroon-darker/70 uppercase tracking-wider block mb-2">Admin Notes to Devotee</label>
                  <textarea 
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows="3"
                    className="w-full p-3 rounded-xl border border-gold/30 text-sm focus:outline-none focus:border-maroon"
                    placeholder="Any specific terms or conditions..."
                  ></textarea>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-3 text-sm">
                    <span className="text-gray-600 font-semibold">Total Estimated Cost:</span>
                    <span className="text-xl font-bold text-gray-900">₹{totalQuoteCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gold/30 shadow-sm">
                    <span className="text-sm font-bold text-maroon">Required Advance (₹) *</span>
                    <input 
                      type="number"
                      min="0"
                      max={totalQuoteCost}
                      value={advanceRequired}
                      onChange={(e) => setAdvanceRequired(e.target.value)}
                      className="w-1/2 p-2 text-right font-bold text-maroon border-b border-gray-300 focus:outline-none focus:border-maroon"
                    />
                  </div>
                </div>
              </div>

            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-gold/20 bg-white flex justify-end gap-3">
              <button 
                onClick={() => setShowQuoteModal(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendQuote}
                disabled={totalQuoteCost === 0 || advanceRequired === 0}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-maroon hover:bg-maroon-darker transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Send size={16} /> Send Quote to Devotee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
