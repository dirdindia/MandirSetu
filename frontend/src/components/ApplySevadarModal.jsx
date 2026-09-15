import React, { useState, useEffect } from 'react';
import api from '../api';
import Swal from 'sweetalert2';
import { 
  User, Briefcase, FileText, Phone, 
  ChevronRight, ChevronLeft, Save, UploadCloud, Loader2, X, Map, Search
} from 'lucide-react';
import OpenLocationCode from 'open-location-code';

export default function ApplySevadarModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState("");
  const [mandirs, setMandirs] = useState([]);
  const [dhams, setDhams] = useState([]);
  const [quickLocationInput, setQuickLocationInput] = useState("");
  const [fetchedLocationDetails, setFetchedLocationDetails] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    dob: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    role: 'Temple Sevadar',
    assignedMandir: '',
    assignedDham: '',
    phone: '',
    email: '',
    emergencyContact: '',
    profilePic: '',
    documentType: 'Aadhar Card',
    documentUrl: '',
    password: '',
  });

  useEffect(() => {
    if (isOpen) {
      const fetchEntities = async () => {
        try {
          const [mandirsRes, dhamsRes] = await Promise.all([
            api.get('/mandirs'),
            api.get('/dhams')
          ]);
          setMandirs(mandirsRes.data.data || []);
          setDhams(dhamsRes.data.data || []);
        } catch (err) {
          console.error("Failed to fetch entities:", err);
        }
      };
      fetchEntities();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  // Get Geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Geolocation is not supported by your browser',
        customClass: { confirmButton: 'bg-maroon text-white px-4 py-2 rounded-lg cursor-pointer' }
      });
      return;
    }
    
    Swal.fire({
      title: 'Detecting Location...',
      html: 'Please wait while we fetch your coordinates.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        });
        Swal.fire({
          icon: 'success',
          title: 'Location Fetched!',
          text: 'Latitude and Longitude auto-filled.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Location Error',
          text: 'Unable to retrieve location.',
          customClass: { confirmButton: 'bg-maroon text-white px-4 py-2 rounded-lg cursor-pointer' }
        });
      }
    );
  };

  // Quick Location Fill
  const handleQuickLocationFill = async () => {
    if (!quickLocationInput.trim()) return;

    Swal.fire({
      title: 'Resolving Location...',
      html: 'Fetching details from map...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      let lat, lng;
      const latLngMatch = quickLocationInput.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
      if (latLngMatch) {
        lat = parseFloat(latLngMatch[1]);
        lng = parseFloat(latLngMatch[3]);
      } else {
        try {
          const decoded = OpenLocationCode.decode(quickLocationInput.trim());
          lat = decoded.latitudeCenter;
          lng = decoded.longitudeCenter;
        } catch (e) {
          throw new Error("Invalid Plus Code or Coordinates format.");
        }
      }

      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data.error) throw new Error("Could not find address.");

      const addressDetails = data.address || {};
      const fullAddress = data.display_name || '';
      
      setFormData(prev => ({
        ...prev,
        latitude: lat.toString(),
        longitude: lng.toString(),
        address: fullAddress,
        city: addressDetails.city || addressDetails.town || addressDetails.county || '',
        state: addressDetails.state || '',
        pincode: addressDetails.postcode || ''
      }));

      setFetchedLocationDetails({
        lat, lng, fullAddress, 
        city: addressDetails.city || '', 
        state: addressDetails.state || '', 
        pincode: addressDetails.postcode || ''
      });

      Swal.fire({
        icon: 'success', title: 'Location Resolved!', text: 'Address auto-filled.', timer: 2000, showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error', title: 'Resolution Failed', text: error.message,
        customClass: { confirmButton: 'bg-maroon text-white px-4 py-2 rounded-lg cursor-pointer' }
      });
    }
  };

  const handleFileChange = async (e, fieldName) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadingField(fieldName);
    setFormData((prev) => ({ ...prev, [fieldName]: '' }));

    const data = new FormData();
    files.forEach((file) => data.append("files", file));

    try {
      const res = await api.post("/system/upload/upload-files", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData((prev) => ({
        ...prev,
        [fieldName]: res.data.urls[0],
      }));
      
      Swal.fire({
        icon: 'success',
        title: 'Uploaded!',
        text: 'File uploaded successfully.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Upload failed:", error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Could not upload the file.',
        customClass: { confirmButton: 'bg-maroon text-white px-4 py-2 rounded-lg cursor-pointer' }
      });
    } finally {
      setUploadingField("");
    }
  };

  const handleRemoveFile = (fieldName) => {
    setFormData((prev) => ({ ...prev, [fieldName]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/staff', formData);
      Swal.fire({
        icon: 'success',
        title: 'Application Submitted!',
        text: 'Your application for Sevadar has been submitted and is pending admin approval.',
        customClass: { confirmButton: 'bg-maroon text-white px-6 py-2 rounded-lg font-bold cursor-pointer' }
      });
      
      setFormData({
        name: '', gender: 'Male', dob: '', address: '', city: '', state: '', pincode: '', latitude: '', longitude: '',
        role: 'Temple Sevadar', assignedMandir: '', assignedDham: '',
        phone: '', email: '', emergencyContact: '', profilePic: '', documentType: 'Aadhar Card', documentUrl: '', password: ''
      });
      setStep(1);
      onClose();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.response?.data?.message || 'Failed to submit application. Please try again.',
        customClass: { confirmButton: 'bg-maroon text-white px-4 py-2 rounded-lg cursor-pointer' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gold/20 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-maroon">Apply for Sevadar</h2>
            <p className="text-xs text-maroon-darker/60 mt-1">Join our team and serve the community.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-maroon hover:bg-gold/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Progress Tracker */}
          <div className="flex items-center justify-between mb-8 relative px-4">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-[calc(100%-2rem)] h-1 bg-slate-200 -z-10 rounded-full"></div>
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 h-1 bg-maroon -z-10 rounded-full transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
            
            {[
              { num: 1, icon: <User size={16} />, label: 'Personal' },
              { num: 2, icon: <Briefcase size={16} />, label: 'Employment' },
              { num: 3, icon: <FileText size={16} />, label: 'Documents' },
              { num: 4, icon: <Phone size={16} />, label: 'Contact' }
            ].map((s) => (
              <div key={s.num} onClick={() => setStep(s.num)} className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-colors ${step >= s.num ? 'bg-maroon border-gold/20 text-white' : 'bg-slate-100 border-white text-slate-400'}`}>
                  {s.icon}
                </div>
                <span className={`text-[10px] font-bold uppercase ${step >= s.num ? 'text-maroon' : 'text-slate-400'}`}>{s.label}</span>
              </div>
            ))}
          </div>

          <div className="min-h-[300px]">
            {/* STEP 1: PERSONAL DETAILS */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-maroon-darker/80 mb-1">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none" placeholder="e.g. Ramesh Kumar" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-maroon-darker/80 mb-1">Gender *</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-maroon-darker/80 mb-1">Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-maroon-darker/80 mb-1">Full Address *</label>
                    <textarea name="address" rows="2" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none resize-none" placeholder="Full residential address..."></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-maroon-darker/80 mb-1">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-maroon-darker/80 mb-1">State</label>
                      <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-maroon-darker/80 mb-1">Pincode</label>
                      <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none" />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 mt-2 p-4 bg-maroon/5 border border-maroon/20 rounded-xl">
                    <label className="block text-xs font-bold text-maroon mb-2">
                      Quick Fill Location (Enter Lat, Lng OR Plus Code)
                    </label>
                    <div className="flex gap-2 mb-4">
                      <input 
                        type="text" 
                        value={quickLocationInput} 
                        onChange={(e) => setQuickLocationInput(e.target.value)} 
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none text-xs" 
                        placeholder="e.g. 25.3109, 83.0107 OR 8JMP6M8X+28" 
                      />
                      <button 
                        onClick={handleQuickLocationFill} 
                        type="button" 
                        className="px-4 py-2 bg-maroon hover:bg-maroon-dark text-white font-bold rounded-lg shadow-sm transition-all flex items-center gap-1 text-xs cursor-pointer"
                      >
                        <Search size={14} /> Find
                      </button>
                    </div>

                    {fetchedLocationDetails && (
                      <div className="mb-4 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fetched Details</h4>
                        <p className="text-xs text-maroon-darker/80 mb-1"><strong>Address:</strong> {fetchedLocationDetails.fullAddress}</p>
                        <div className="flex gap-3 text-xs text-maroon-darker/70">
                          <p><strong>City:</strong> {fetchedLocationDetails.city}</p>
                          <p><strong>State:</strong> {fetchedLocationDetails.state}</p>
                          <p><strong>PIN:</strong> {fetchedLocationDetails.pincode}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-maroon text-xs flex items-center gap-1"><Map size={14}/> Geolocation</h4>
                        <p className="text-[10px] text-maroon/80 mt-0.5">Fetch coordinates to mark home location on map.</p>
                      </div>
                      <button onClick={handleGetLocation} type="button" className="px-3 py-1.5 bg-maroon hover:bg-maroon-dark text-white text-xs font-bold rounded-md transition-all cursor-pointer">
                        Detect
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-maroon-darker/70 mb-1">Latitude</label>
                        <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-maroon text-xs" placeholder="25.3109" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-maroon-darker/70 mb-1">Longitude</label>
                        <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-maroon text-xs" placeholder="83.0107" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: EMPLOYMENT */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-maroon-darker/80 mb-1">Role / Designation *</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none">
                      <option value="Temple Sevadar">Temple Sevadar (Agent)</option>
                      <option value="Dham Sevadar">Dham Sevadar (Agent)</option>
                    </select>
                  </div>
                  {formData.role === 'Temple Sevadar' ? (
                    <div>
                      <label className="block text-xs font-bold text-maroon-darker/80 mb-1">Select Mandir *</label>
                      <select name="assignedMandir" value={formData.assignedMandir} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none">
                        <option value="">-- Choose Mandir --</option>
                        {mandirs?.map(m => (
                          <option key={m._id} value={m._id}>{m.name} - {m.location?.city || m.city}</option>
                        ))}
                      </select>
                    </div>
                  ) : formData.role === 'Dham Sevadar' ? (
                    <div>
                      <label className="block text-xs font-bold text-maroon-darker/80 mb-1">Select Dham *</label>
                      <select name="assignedDham" value={formData.assignedDham} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none">
                        <option value="">-- Choose Dham --</option>
                        {dhams?.map(d => (
                          <option key={d._id} value={d._id}>{d.name} - {d.location?.city || d.city}</option>
                        ))}
                      </select>
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {/* STEP 3: DOCUMENTS */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
                    <UploadCloud className="mx-auto text-maroon mb-2" size={24} />
                    <label className="block text-xs font-bold text-maroon-darker/80 mb-1">Profile Picture</label>
                    <p className="text-[10px] text-maroon-darker/60 mb-2">Upload passport size photo</p>
                    
                    <input type="file" accept="image/*" id="profilePicModal" className="hidden" onChange={(e) => handleFileChange(e, 'profilePic')} />
                    <label htmlFor="profilePicModal" className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-maroon/10 text-maroon rounded-md text-xs font-bold hover:bg-maroon/20 transition-colors">
                      {uploadingField === 'profilePic' ? <Loader2 size={14} className="animate-spin" /> : 'Select File'}
                    </label>

                    {formData.profilePic && (
                      <div className="mt-3 flex justify-center">
                        <div className="relative inline-block">
                          <img src={formData.profilePic} alt="Profile" className="w-16 h-16 object-cover rounded-lg shadow-sm border border-slate-200" />
                          <button type="button" onClick={() => handleRemoveFile('profilePic')} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 shadow-md">
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
                    <UploadCloud className="mx-auto text-maroon mb-2" size={24} />
                    <div className="mb-2">
                      <label className="block text-xs font-bold text-maroon-darker/80 mb-1">Document Type</label>
                      <select name="documentType" value={formData.documentType} onChange={handleChange} className="w-full text-center px-3 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none text-xs">
                        <option value="Aadhar Card">Aadhar Card</option>
                        <option value="PAN Card">PAN Card</option>
                        <option value="Voter ID">Voter ID</option>
                      </select>
                    </div>
                    
                    <input type="file" accept="image/*,application/pdf" id="documentUrlModal" className="hidden" onChange={(e) => handleFileChange(e, 'documentUrl')} />
                    <label htmlFor="documentUrlModal" className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-maroon/10 text-maroon rounded-md text-xs font-bold hover:bg-maroon/20 transition-colors">
                       {uploadingField === 'documentUrl' ? <Loader2 size={14} className="animate-spin" /> : 'Select Document'}
                    </label>

                    {formData.documentUrl && (
                      <div className="mt-3 flex justify-center">
                        <div className="relative inline-block bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                          {formData.documentUrl.toLowerCase().endsWith('.pdf') ? (
                            <span className="text-[10px] font-bold text-maroon line-clamp-1 max-w-[100px]">Document Uploaded</span>
                          ) : (
                            <img src={formData.documentUrl} alt="Document" className="w-20 h-16 object-cover rounded-md shadow-sm" />
                          )}
                          <button type="button" onClick={() => handleRemoveFile('documentUrl')} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 shadow-md">
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: CONTACT & REVIEW */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-maroon-darker/80 mb-1">Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none" placeholder="+91 9876543210" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-maroon-darker/80 mb-1">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none" placeholder="staff@mandirsetu.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-maroon-darker/80 mb-1">Emergency Contact</label>
                    <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none" placeholder="+91 9123456789" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-maroon-darker/80 mb-1">Create Password *</label>
                    <input type="text" name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-maroon focus:outline-none" placeholder="For your future staff login" />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer Buttons */}
          <div className="flex justify-between mt-6 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={handlePrev}
              disabled={step === 1 || loading}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 transition-all ${step === 1 ? 'opacity-0 cursor-default' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer'}`}
            >
              <ChevronLeft size={16} /> Back
            </button>

            {step < 4 ? (
              <button 
                type="button" 
                onClick={handleNext}
                className="px-5 py-2 bg-maroon hover:bg-maroon-dark text-white rounded-lg text-sm font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleSubmit}
                disabled={loading || uploadingField !== ""}
                className={`px-6 py-2 rounded-lg text-sm font-bold text-white flex items-center gap-2 shadow-md transition-colors ${loading || uploadingField !== "" ? 'bg-maroon/80 cursor-not-allowed' : 'bg-maroon hover:bg-maroon-dark cursor-pointer'}`}
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <><Save size={16} /> Submit Application</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
