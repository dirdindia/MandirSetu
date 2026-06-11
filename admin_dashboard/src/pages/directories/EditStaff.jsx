import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import Swal from 'sweetalert2';
import { 
  User, Briefcase, FileText, Phone, 
  ChevronRight, ChevronLeft, Save, UploadCloud, Loader2, X, Map, Search
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditStaff() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState("");
  const [mandirs, setMandirs] = useState([]);
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
    phone: '',
    email: '',
    emergencyContact: '',
    profilePic: '',
    documentType: 'Aadhar Card',
    documentUrl: '',
  });

  useEffect(() => {
    // Fetch mandirs to populate the assignment dropdown
    const fetchMandirs = async () => {
      try {
        const res = await api.get('/mandirs');
        setMandirs(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch mandirs:", err);
      }
    };
    fetchMandirs();
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchStaffDetails = async () => {
      try {
        const res = await api.get(`/staff/${id}`);
        const staff = res.data.data;
        if (staff) {
          setFormData({
            name: staff.name || '',
            gender: staff.gender || 'Male',
            dob: staff.dob ? staff.dob.split('T')[0] : '',
            address: staff.address || '',
            city: staff.city || '',
            state: staff.state || '',
            pincode: staff.pincode || '',
            latitude: staff.geolocation?.coordinates?.[1]?.toString() || '',
            longitude: staff.geolocation?.coordinates?.[0]?.toString() || '',
            role: staff.employment?.role || 'Temple Sevadar',
            assignedMandir: staff.employment?.assignedMandir?._id || '',
            phone: staff.contact?.phone || '',
            email: staff.contact?.email || '',
            emergencyContact: staff.contact?.emergencyContact || '',
            profilePic: staff.media?.profilePic || '',
            documentType: staff.media?.documentType || 'Aadhar Card',
            documentUrl: staff.media?.documentUrl || '',
          });
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to fetch staff details', 'error');
      }
    };
    fetchStaffDetails();
  }, [id]);

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
        customClass: { confirmButton: 'bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer' }
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
          customClass: { confirmButton: 'bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer' }
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
        customClass: { confirmButton: 'bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer' }
      });
    }
  };

  // Upload handler for Cloudinary
  const handleFileChange = async (e, fieldName) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadingField(fieldName);
    // Clear previous URL while uploading to show loader cleanly
    setFormData((prev) => ({ ...prev, [fieldName]: '' }));

    const data = new FormData();
    files.forEach((file) => data.append("files", file));

    try {
      const res = await api.post("/upload/upload-files", data, {
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
        text: 'Could not upload the file. Please check your config.',
        customClass: { confirmButton: 'bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer' }
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

    Swal.fire({
      title: 'Updating Staff...',
      html: 'Please wait while we save the details.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      await api.put(`/staff/${id}`, formData);
      Swal.fire({
        icon: 'success',
        title: 'Staff Updated!',
        text: 'The staff member details have been updated.',
        customClass: { confirmButton: 'bg-orange-500 text-white px-6 py-2 rounded-lg font-bold cursor-pointer' }
      }).then(() => {
        navigate('/staff');
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.message || 'Failed to update staff. Please try again.',
        customClass: { confirmButton: 'bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Staff Details</h2>
        <p className="text-slate-500 mt-2">Update the information for this staff member or temple sevadar.</p>
      </div>

      {/* Progress Tracker */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-10 rounded-full"></div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-500 -z-10 rounded-full transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
        
        {[
          { num: 1, icon: <User size={18} />, label: 'Personal' },
          { num: 2, icon: <Briefcase size={18} />, label: 'Employment' },
          { num: 3, icon: <FileText size={18} />, label: 'Documents' },
          { num: 4, icon: <Phone size={18} />, label: 'Contact' }
        ].map((s) => (
          <div 
            key={s.num} 
            onClick={() => setStep(s.num)}
            className="flex flex-col items-center gap-2 cursor-pointer group hover:scale-105 transition-transform"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-4 transition-colors ${step >= s.num ? 'bg-blue-500 border-blue-100 text-white' : 'bg-slate-100 border-white text-slate-400 dark:bg-slate-800 dark:border-slate-900 group-hover:border-blue-200'}`}>
              {s.icon}
            </div>
            <span className={`text-xs font-bold transition-colors ${step >= s.num ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-400'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden p-8">
        {/* STEP 1: PERSONAL DETAILS */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b pb-2">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Ramesh Kumar" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Address *</label>
                <textarea name="address" rows="2" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" placeholder="Full residential address..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pincode</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>
              
              <div className="md:col-span-2 mt-2 p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-2xl">
                <label className="block text-sm font-bold text-blue-900 dark:text-blue-400 mb-2">
                  Quick Fill Location (Enter Lat, Lng OR Plus Code)
                </label>
                <div className="flex gap-3 mb-6">
                  <input 
                    type="text" 
                    value={quickLocationInput} 
                    onChange={(e) => setQuickLocationInput(e.target.value)} 
                    className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                    placeholder="e.g. 25.3109, 83.0107 OR 8JMP6M8X+28" 
                  />
                  <button 
                    onClick={handleQuickLocationFill} 
                    type="button" 
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <Search size={18} /> Find
                  </button>
                </div>

                {fetchedLocationDetails && (
                  <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Fetched Details</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-1"><strong>Address:</strong> {fetchedLocationDetails.fullAddress}</p>
                    <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <p><strong>City:</strong> {fetchedLocationDetails.city}</p>
                      <p><strong>State:</strong> {fetchedLocationDetails.state}</p>
                      <p><strong>PIN:</strong> {fetchedLocationDetails.pincode}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2"><Map size={18}/> Geolocation</h4>
                    <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">Fetch coordinates to mark home location on map.</p>
                  </div>
                  <button onClick={handleGetLocation} type="button" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 shadow-md text-white text-sm font-bold rounded-lg transition-all cursor-pointer">
                    Detect Location
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-blue-800/70 dark:text-blue-400/70 mb-1">Latitude</label>
                    <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="25.3109" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-blue-800/70 dark:text-blue-400/70 mb-1">Longitude</label>
                    <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="83.0107" />
                  </div>
                </div>
                </div>
              </div>
            </div>
         
        )}

        {/* STEP 2: EMPLOYMENT */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b pb-2">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Role / Designation *</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="Temple Sevadar">Temple Sevadar (Agent)</option>
                  <option value="Manager">Platform Manager</option>
                  <option value="Global Admin">Global Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Assigned Mandir (Optional)</label>
                <select name="assignedMandir" value={formData.assignedMandir} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="">Global / Not Assigned to specific Mandir</option>
                  {mandirs?.map(m => (
                    <option key={m._id} value={m._id}>{m.name} - {m.location.city}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-2">If left blank, the staff member will have global access.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DOCUMENTS */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b pb-2">Identity & Documents</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Pic Upload */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <UploadCloud className="mx-auto text-blue-400 mb-3" size={32} />
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Profile Picture</label>
                <p className="text-xs text-slate-500 mb-4">Upload passport size photo</p>
                
                <input type="file" accept="image/*" id="profilePic" className="hidden" onChange={(e) => handleFileChange(e, 'profilePic')} />
                <label htmlFor="profilePic" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-sm font-bold hover:bg-blue-200 transition-colors">
                  {uploadingField === 'profilePic' ? <Loader2 size={16} className="animate-spin" /> : 'Select File'}
                </label>

                {formData.profilePic && (
                  <div className="mt-4 flex justify-center">
                    <div className="relative inline-block">
                      <img src={formData.profilePic} alt="Profile" className="w-24 h-24 object-cover rounded-xl shadow-sm border border-slate-200" />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveFile('profilePic')}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md cursor-pointer"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Identity Document Upload */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <UploadCloud className="mx-auto text-blue-400 mb-3" size={32} />
                
                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Document Type</label>
                  <select name="documentType" value={formData.documentType} onChange={handleChange} className="w-full text-center px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none text-sm font-medium">
                    <option value="Aadhar Card">Aadhar Card</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="Passport">Passport</option>
                  </select>
                </div>
                
                <input type="file" accept="image/*,application/pdf" id="documentUrl" className="hidden" onChange={(e) => handleFileChange(e, 'documentUrl')} />
                <label htmlFor="documentUrl" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-sm font-bold hover:bg-blue-200 transition-colors">
                   {uploadingField === 'documentUrl' ? <Loader2 size={16} className="animate-spin" /> : 'Select Document'}
                </label>

                {formData.documentUrl && (
                  <div className="mt-4 flex justify-center">
                    <div className="relative inline-block bg-slate-100 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                      {formData.documentUrl.includes('/raw/') || formData.documentUrl.toLowerCase().endsWith('.pdf') ? (
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 line-clamp-1 max-w-[120px]">Document Uploaded</span>
                      ) : (
                        <img 
                          src={formData.documentUrl} 
                          alt="Document" 
                          className="w-32 h-24 object-cover rounded-lg shadow-sm" 
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x96/e2e8f0/475569?text=Preview+Not+Available'; }}
                        />
                      )}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveFile('documentUrl')}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md cursor-pointer"
                      >
                        <X size={14} strokeWidth={3} />
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
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b pb-2">Contact Info & Review</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Phone Number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="+91 9876543210" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="staff@mandirsetu.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Emergency Contact</label>
                <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="+91 9123456789" />
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-xl text-sm font-medium border border-blue-200">
              Please verify the document and profile details before finalizing the hire.
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-10 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button 
            type="button" 
            onClick={handlePrev}
            disabled={step === 1 || loading}
            className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${step === 1 ? 'opacity-0 cursor-default' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer'}`}
          >
            <ChevronLeft size={18} /> Back
          </button>

          {step < 4 ? (
            <button 
              type="button" 
              onClick={handleNext}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md shadow-blue-500/20 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleSubmit}
              disabled={loading || uploadingField !== ""}
              className={`px-8 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all ${loading || uploadingField !== "" ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 cursor-pointer active:scale-[0.98]'}`}
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Changes</>}
            </button>
          )}
        </div>
      </div>
    </div>
    
  );
}
