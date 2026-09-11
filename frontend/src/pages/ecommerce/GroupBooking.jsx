import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api';

export default function GroupBooking() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    organization: '',
    destination: '',
    startDate: '',
    endDate: '',
    groupSize: 100,
    requestedServices: [],
    specialRequirements: ''
  });

  const [destinationType, setDestinationType] = useState('Mandir');
  const [mandirs, setMandirs] = useState([]);
  const [dhams, setDhams] = useState([]);

  useEffect(() => {
    // Fetch Mandirs and Dhams
    const fetchDestinations = async () => {
      try {
        const [mandirsRes, dhamsRes] = await Promise.all([
          api.get('/mandirs'),
          api.get('/dhams')
        ]);
        setMandirs(mandirsRes.data.data || []);
        setDhams(dhamsRes.data.data || []);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };
    fetchDestinations();
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    
    if (!token || !userString) {
      // Redirect to login if not authenticated
      navigate('/signin?redirect=/group-booking');
      return;
    }

    try {
      const user = JSON.parse(userString);
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    } catch (e) {
      console.error('Error parsing user data');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => {
      const services = [...prev.requestedServices];
      if (services.includes(service)) {
        return { ...prev, requestedServices: services.filter(s => s !== service) };
      } else {
        return { ...prev, requestedServices: [...services, service] };
      }
    });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      const payload = {
        contactDetails: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          organization: formData.organization
        },
        destination: formData.destination,
        dateRange: {
          startDate: formData.startDate,
          endDate: formData.endDate
        },
        groupSize: formData.groupSize,
        requestedServices: formData.requestedServices,
        specialRequirements: formData.specialRequirements
      };

      const res = await api.post('/bulk-bookings', payload);
      
      if (res.data.success) {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const servicesList = [
    { id: 'Hotel/Ashram', label: 'Accommodation (Hotels & Ashrams)', icon: '🏨' },
    { id: 'Food/Bhandara', label: 'Food & Bhandara Management', icon: '🍲' },
    { id: 'Local Transport', label: 'Local Transport & Buses', icon: '🚌' },
    { id: 'Pandit/Puja', label: 'Dedicated Pandit & Puja Services', icon: '🪔' },
    { id: 'Prasad', label: 'Bulk Prasad Delivery', icon: '📦' }
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-premium pt-32 pb-20 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full text-center border-t-4 border-maroon"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            ✓
          </div>
          <h2 className="text-3xl font-serif text-maroon mb-4">Request Received!</h2>
          <p className="text-maroon-darker/80 mb-8 leading-relaxed">
            Thank you for choosing MandirSetu for your Group Yatra. Our dedicated Dham Sevak will review your requirements and send a customized quote to your dashboard shortly.
          </p>
          <button 
            onClick={() => navigate('/profile')}
            className="px-8 py-3 bg-maroon hover:bg-maroon-darker text-white font-bold rounded-full transition-colors"
          >
            Go to My Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-premium pt-28 pb-20 font-sans">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-maroon mb-4">Group Yatra Booking</h1>
          <p className="text-maroon-darker/70 text-lg max-w-2xl mx-auto">
            Plan a seamless pilgrimage for 100+ devotees. Tell us your requirements, and we'll arrange everything from accommodation to VIP darshans.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center w-full max-w-md">
            {[1, 2, 3].map((step, idx) => (
              <React.Fragment key={step}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${currentStep >= step ? 'bg-maroon text-white' : 'bg-white border-2 border-gold/40 text-maroon-darker/50'}`}>
                  {step}
                </div>
                {idx < 2 && (
                  <div className={`flex-1 h-1 mx-2 transition-colors ${currentStep > step ? 'bg-maroon' : 'bg-gold/20'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-maroon/5 border border-gold/20 p-6 md:p-10">
          <form onSubmit={handleSubmit}>
            
            {/* STEP 1: Yatra & Basic Details */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-serif text-maroon mb-6 border-b border-gold/20 pb-3">Yatra Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-maroon-darker mb-2">Destination Type *</label>
                    <select 
                      value={destinationType} 
                      onChange={(e) => {
                        setDestinationType(e.target.value);
                        setFormData({ ...formData, destination: '' }); // reset destination when type changes
                      }} 
                      className="w-full bg-premium border border-gold/30 rounded-xl px-4 py-3 focus:outline-none focus:border-maroon"
                    >
                      <option value="Mandir">Mandir</option>
                      <option value="Dham">Dham</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-maroon-darker mb-2">Select {destinationType} *</label>
                    <select 
                      name="destination" 
                      value={formData.destination} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full bg-premium border border-gold/30 rounded-xl px-4 py-3 focus:outline-none focus:border-maroon"
                    >
                      <option value="">-- Choose {destinationType} --</option>
                      {destinationType === 'Mandir' ? (
                        mandirs.map(m => (
                          <option key={m._id} value={m.name}>{m.name}</option>
                        ))
                      ) : (
                        dhams.map(d => (
                          <option key={d._id} value={d.name}>{d.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-maroon-darker mb-2">Expected Number of Devotees *</label>
                    <input type="number" name="groupSize" min="10" value={formData.groupSize} onChange={handleInputChange} required className="w-full bg-premium border border-gold/30 rounded-xl px-4 py-3 focus:outline-none focus:border-maroon" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-maroon-darker mb-2">Start Date *</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required className="w-full bg-premium border border-gold/30 rounded-xl px-4 py-3 focus:outline-none focus:border-maroon" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-maroon-darker mb-2">End Date *</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} required className="w-full bg-premium border border-gold/30 rounded-xl px-4 py-3 focus:outline-none focus:border-maroon" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={nextStep} disabled={!formData.destination || !formData.startDate || !formData.endDate || !formData.groupSize} className="px-8 py-3 bg-maroon hover:bg-maroon-darker text-white font-bold rounded-full transition-colors disabled:opacity-50">
                    Next Step &rarr;
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Required Services */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-serif text-maroon mb-2">Required Services</h3>
                <p className="text-maroon-darker/70 text-sm mb-6 pb-3 border-b border-gold/20">Select all the services you need us to arrange for your group.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {servicesList.map(srv => (
                    <div 
                      key={srv.id} 
                      onClick={() => handleServiceToggle(srv.id)}
                      className={`cursor-pointer border rounded-2xl p-4 flex items-center gap-4 transition-all ${formData.requestedServices.includes(srv.id) ? 'border-maroon bg-maroon/5 shadow-md ring-1 ring-maroon' : 'border-gold/30 hover:border-gold hover:bg-premium'}`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${formData.requestedServices.includes(srv.id) ? 'bg-maroon text-white' : 'bg-white text-maroon'}`}>
                        {srv.icon}
                      </div>
                      <div className="flex-1 font-semibold text-maroon-darker">
                        {srv.label}
                      </div>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${formData.requestedServices.includes(srv.id) ? 'bg-maroon border-maroon' : 'border-gold/50'}`}>
                        {formData.requestedServices.includes(srv.id) && <span className="text-white text-xs">✓</span>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <button type="button" onClick={prevStep} className="px-8 py-3 bg-premium border border-gold/30 hover:bg-gold/10 text-maroon-darker font-bold rounded-full transition-colors">
                    &larr; Back
                  </button>
                  <button type="button" onClick={nextStep} disabled={formData.requestedServices.length === 0} className="px-8 py-3 bg-maroon hover:bg-maroon-darker text-white font-bold rounded-full transition-colors disabled:opacity-50">
                    Next Step &rarr;
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Contact Info & Submit */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-serif text-maroon mb-6 border-b border-gold/20 pb-3">Contact Details & Final Review</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-maroon-darker mb-2">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-premium border border-gold/30 rounded-xl px-4 py-3 focus:outline-none focus:border-maroon" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-maroon-darker mb-2">Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full bg-premium border border-gold/30 rounded-xl px-4 py-3 focus:outline-none focus:border-maroon" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-maroon-darker mb-2">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full bg-premium border border-gold/30 rounded-xl px-4 py-3 focus:outline-none focus:border-maroon" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-maroon-darker mb-2">Organization/Group Name (Optional)</label>
                    <input type="text" name="organization" value={formData.organization} onChange={handleInputChange} className="w-full bg-premium border border-gold/30 rounded-xl px-4 py-3 focus:outline-none focus:border-maroon" />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-bold text-maroon-darker mb-2">Special Requirements or Notes (Optional)</label>
                  <textarea name="specialRequirements" rows="4" value={formData.specialRequirements} onChange={handleInputChange} placeholder="Any specific needs for elderly devotees, VIP darshan requests, or dietary restrictions for Bhandara..." className="w-full bg-premium border border-gold/30 rounded-xl px-4 py-3 focus:outline-none focus:border-maroon resize-none"></textarea>
                </div>

                <div className="bg-gold/10 p-5 rounded-2xl mb-8 flex items-start gap-4">
                  <span className="text-2xl mt-1">ℹ️</span>
                  <p className="text-sm text-maroon-darker/80 leading-relaxed">
                    By submitting this inquiry, your details will be sent securely to our Yatra Coordinators. They will contact you shortly to confirm availability and provide a detailed quotation in your dashboard.
                  </p>
                </div>

                <div className="flex justify-between">
                  <button type="button" onClick={prevStep} className="px-8 py-3 bg-premium border border-gold/30 hover:bg-gold/10 text-maroon-darker font-bold rounded-full transition-colors">
                    &larr; Back
                  </button>
                  <button type="submit" disabled={isSubmitting || !formData.name || !formData.phone || !formData.email} className="px-8 py-3 bg-maroon hover:bg-maroon-darker text-white font-bold rounded-full transition-colors shadow-lg disabled:opacity-50 flex items-center">
                    {isSubmitting ? 'Submitting...' : 'Submit Inquiry Request'}
                  </button>
                </div>
              </motion.div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}
