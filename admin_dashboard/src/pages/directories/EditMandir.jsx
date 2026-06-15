import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import Swal from 'sweetalert2';
import { 
  Landmark, MapPin, Phone, Image as ImageIcon, 
  ChevronRight, ChevronLeft, Save, Map, UploadCloud, Loader2, Search, X
} from 'lucide-react';
import OpenLocationCode from 'open-location-code';

export default function EditMandir() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState("");
  const [quickLocationInput, setQuickLocationInput] = useState("");
  const [fetchedLocationDetails, setFetchedLocationDetails] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    establishedYear: '',
    mainDeity: '',
    description: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    phone: '',
    email: '',
    website: '',
    profilePic: '',
    gallery: [],
    category: '',
    schedule: { openTime: '', closeTime: '' },
    schedule: { openTime: '', closeTime: '' },
    howToReach: { bus: '', train: '', air: '' },
  });

  useEffect(() => {
    const fetchMandir = async () => {
      try {
        const response = await api.get(`/mandirs/${id}`);
        const mandir = response.data;
        setFormData({
          name: mandir.name || '',
          establishedYear: mandir.establishedYear || '',
          mainDeity: mandir.mainDeity || '',
          description: mandir.description || '',
          address: mandir.location?.address || '',
          city: mandir.location?.city || '',
          state: mandir.location?.state || '',
          pincode: mandir.location?.pincode || '',
          latitude: mandir.geolocation?.latitude || '',
          longitude: mandir.geolocation?.longitude || '',
          phone: mandir.contact?.phone || '',
          email: mandir.contact?.email || '',
          website: mandir.contact?.website || '',
          profilePic: mandir.profilePic || '',
          gallery: mandir.gallery || [],
          category: mandir.category || '',
          schedule: mandir.schedule || { openTime: '', closeTime: '' },
          howToReach: mandir.howToReach || { bus: '', train: '', air: '' },
        });
      } catch (err) {
        console.error('Failed to fetch mandir:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load Mandir details',
        });
      }
    };
    if (id) fetchMandir();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
        customClass: { confirmButton: 'bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer' }
      });
      return;
    }
    
    // Show loading alert
    Swal.fire({
      title: 'Detecting Location...',
      html: 'Please wait while we fetch your coordinates.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
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
          text: 'Latitude and Longitude have been filled automatically.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Location Error',
          text: 'Unable to retrieve your location. Please enter manually.',
          customClass: { confirmButton: 'bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer' }
        });
      }
    );
  };

  // Quick Location Fill via Lat/Lng or Plus Code
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

      // Check if input is lat,lng format
      const latLngMatch = quickLocationInput.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
      if (latLngMatch) {
        lat = parseFloat(latLngMatch[1]);
        lng = parseFloat(latLngMatch[3]);
      } else {
        // Assume it's a Plus Code
        try {
          const decoded = OpenLocationCode.decode(quickLocationInput.trim());
          lat = decoded.latitudeCenter;
          lng = decoded.longitudeCenter;
        } catch (e) {
          throw new Error("Invalid Plus Code or Coordinates format. Please use 'lat, lng' or a valid Plus Code.");
        }
      }

      // Reverse Geocoding using Nominatim
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();

      if (data.error) throw new Error("Could not find address for these coordinates.");

      const addressDetails = data.address || {};
      const fullAddress = data.display_name || '';
      const city = addressDetails.city || addressDetails.town || addressDetails.village || addressDetails.county || '';
      const state = addressDetails.state || '';
      const pincode = addressDetails.postcode || '';

      setFormData(prev => ({
        ...prev,
        latitude: lat.toString(),
        longitude: lng.toString(),
        address: fullAddress,
        city: city,
        state: state,
        pincode: pincode
      }));

      setFetchedLocationDetails({
        lat, lng, fullAddress, city, state, pincode
      });

      Swal.fire({
        icon: 'success',
        title: 'Location Resolved!',
        text: 'Address and coordinates auto-filled successfully.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Resolution Failed',
        text: error.message || 'Something went wrong fetching the location.',
        customClass: { confirmButton: 'bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer' }
      });
    }
  };

  // Upload handler based on user requirement
  const handleFileChange = async (e, fieldName) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadingField(fieldName);

    const data = new FormData();
    files.forEach((file) => data.append("files", file));

    try {
      const res = await api.post("/upload/upload-files", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData((prev) => ({
        ...prev,
        [fieldName]: fieldName === 'gallery' 
          ? [...prev.gallery, ...res.data.urls] 
          : res.data.urls[0],
      }));
      
      Swal.fire({
        icon: 'success',
        title: 'Uploaded!',
        text: `${fieldName === 'gallery' ? 'Gallery images' : 'Profile picture'} uploaded successfully.`,
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Upload failed:", error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Could not upload the images. Please check your Cloudinary config.',
        customClass: { confirmButton: 'bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer' }
      });
    } finally {
      setUploadingField("");
    }
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleRemoveProfilePic = () => {
    setFormData((prev) => ({ ...prev, profilePic: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    Swal.fire({
      title: 'Onboarding Mandir...',
      html: 'Please wait while we save the details.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      await api.put(`/mandirs/${id}`, formData);
      Swal.fire({
        icon: 'success',
        title: 'Mandir Updated!',
        text: 'The Mandir details have been successfully updated.',
        customClass: { confirmButton: 'bg-orange-500 text-white px-6 py-2 rounded-lg font-bold cursor-pointer' }
      });
      
      navigate('/mandirs');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.response?.data?.message || 'Failed to onboard mandir. Please try again.',
        customClass: { confirmButton: 'bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Mandir</h2>
        <p className="text-slate-500 mt-2">Update the details of the mandir.</p>
      </div>

      {/* Progress Tracker */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-10 rounded-full"></div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-orange-500 -z-10 rounded-full transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
        
        {[
          { num: 1, icon: <Landmark size={18} />, label: 'Basic Info' },
          { num: 2, icon: <MapPin size={18} />, label: 'Location & Geo' },
          { num: 3, icon: <ImageIcon size={18} />, label: 'Media' },
          { num: 4, icon: <Phone size={18} />, label: 'Contact' }
        ].map((s) => (
          <div 
            key={s.num} 
            onClick={() => setStep(s.num)}
            className="flex flex-col items-center gap-2 cursor-pointer group hover:scale-105 transition-transform"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-4 transition-colors ${step >= s.num ? 'bg-orange-500 border-orange-100 text-white' : 'bg-slate-100 border-white text-slate-400 dark:bg-slate-800 dark:border-slate-900 group-hover:border-orange-200'}`}>
              {s.icon}
            </div>
            <span className={`text-xs font-bold transition-colors ${step >= s.num ? 'text-orange-600' : 'text-slate-400 group-hover:text-orange-400'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden p-8">
        {/* STEP 1: BASIC INFO */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b pb-2">Basic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Mandir Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="e.g. Kashi Vishwanath Temple" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Main Deity (Bhagwan) *</label>
                <input type="text" name="mainDeity" value={formData.mainDeity} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="e.g. Lord Shiva" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none">
                  <option value="">Select Category</option>
                  <option value="Shiva">Shiva</option>
                  <option value="Vishnu">Vishnu</option>
                  <option value="Hanuman">Hanuman</option>
                  <option value="Devi">Devi (Durga/Kali/etc)</option>
                  <option value="Ganesha">Ganesha</option>
                  <option value="Krishna">Krishna</option>
                  <option value="Rama">Rama</option>
                  <option value="Swaminarayan">Swaminarayan</option>
                  <option value="Jain">Jain Temple</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Established Year</label>
                <input type="text" name="establishedYear" value={formData.establishedYear} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="e.g. 1780" />
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Opening Time</label>
                  <input type="time" name="schedule.openTime" value={formData.schedule.openTime} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Closing Time</label>
                  <input type="time" name="schedule.closeTime" value={formData.schedule.closeTime} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none" placeholder="Brief history or description of the temple..."></textarea>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION & GEO */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b pb-2">Location & Geolocation</h3>
            
            {/* Quick Location Fill Feature */}
            <div className="bg-orange-50 dark:bg-orange-900/10 p-5 rounded-2xl border border-orange-200 dark:border-orange-800/50 mb-6">
              <label className="block text-sm font-bold text-orange-900 dark:text-orange-400 mb-2">
                Quick Fill (Enter Lat, Lng OR Plus Code)
              </label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={quickLocationInput} 
                  onChange={(e) => setQuickLocationInput(e.target.value)} 
                  className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none" 
                  placeholder="e.g. 25.3109, 83.0107 OR 8JMP6M8X+28" 
                />
                <button 
                  onClick={handleQuickLocationFill} 
                  type="button" 
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-md shadow-orange-500/20 cursor-pointer transition-all active:scale-[0.98] flex items-center gap-2"
                >
                  <Search size={18} /> Find
                </button>
              </div>

              {fetchedLocationDetails && (
                <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-orange-100 dark:border-slate-700 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Fetched Details</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-1"><strong>Address:</strong> {fetchedLocationDetails.fullAddress}</p>
                  <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <p><strong>City:</strong> {fetchedLocationDetails.city}</p>
                    <p><strong>State:</strong> {fetchedLocationDetails.state}</p>
                    <p><strong>PIN:</strong> {fetchedLocationDetails.pincode}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Address *</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="Street address, locality..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">City *</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="e.g. Varanasi" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">State *</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="e.g. Uttar Pradesh" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pincode *</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="e.g. 221001" />
              </div>
              
              <div className="md:col-span-3 mt-4 p-5 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-orange-800 dark:text-orange-400 flex items-center gap-2"><Map size={18}/> Geolocation (Required)</h4>
                    <p className="text-xs text-orange-600 dark:text-orange-500 mt-1">Fetch coordinates to show Mandir on the map.</p>
                  </div>
                  <button onClick={handleGetLocation} type="button" className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 text-white text-sm font-bold rounded-lg cursor-pointer transition-all active:scale-[0.98]">
                    Detect My Location
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-orange-800/70 mb-1">Latitude</label>
                    <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-orange-200 rounded-lg focus:outline-none" placeholder="25.3109" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-orange-800/70 mb-1">Longitude</label>
                    <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-orange-200 rounded-lg focus:outline-none" placeholder="83.0107" />
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 mt-6 border-t border-slate-200 dark:border-slate-800 pt-6">
                <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4">How to Reach</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">By Bus</label>
                    <textarea name="howToReach.bus" rows="2" value={formData.howToReach.bus} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none" placeholder="Nearest bus stand and routes..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">By Train</label>
                    <textarea name="howToReach.train" rows="2" value={formData.howToReach.train} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none" placeholder="Nearest railway station..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">By Air</label>
                    <textarea name="howToReach.air" rows="2" value={formData.howToReach.air} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none" placeholder="Nearest airport..."></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: MEDIA UPLOADS */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b pb-2">Media Uploads</h3>
            
            {/* Profile Pic Upload */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors">
              <UploadCloud className="mx-auto text-orange-400 mb-3" size={32} />
              <label className="block text-sm font-bold text-slate-700 mb-1">Main Profile Picture</label>
              <p className="text-xs text-slate-500 mb-4">Upload the main image for the Mandir (JPEG, PNG)</p>
              
              <input type="file" accept="image/*" id="profilePic" className="hidden" onChange={(e) => handleFileChange(e, 'profilePic')} />
              <label htmlFor="profilePic" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 border border-orange-200 rounded-lg text-sm font-bold hover:bg-orange-200 transition-colors">
                {uploadingField === 'profilePic' ? <Loader2 size={16} className="animate-spin" /> : 'Select File'}
              </label>

              {formData.profilePic && (
                <div className="mt-4 flex justify-center">
                  <div className="relative group inline-block">
                    <img src={formData.profilePic} alt="Profile" className="w-24 h-24 object-cover rounded-xl shadow-sm border border-slate-200" />
                    <button 
                      type="button" 
                      onClick={handleRemoveProfilePic}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-md cursor-pointer scale-90 hover:scale-100"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Upload */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors">
              <UploadCloud className="mx-auto text-orange-400 mb-3" size={32} />
              <label className="block text-sm font-bold text-slate-700 mb-1">Gallery Images</label>
              <p className="text-xs text-slate-500 mb-4">Upload multiple images showcasing the temple</p>
              
              <input type="file" multiple accept="image/*" id="gallery" className="hidden" onChange={(e) => handleFileChange(e, 'gallery')} />
              <label htmlFor="gallery" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 border border-orange-200 rounded-lg text-sm font-bold hover:bg-orange-200 transition-colors">
                 {uploadingField === 'gallery' ? <Loader2 size={16} className="animate-spin" /> : 'Select Files'}
              </label>

              {formData.gallery.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  {formData.gallery.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt={`Gallery ${i}`} className="w-16 h-16 object-cover rounded-lg shadow-sm border border-slate-200" />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveGalleryImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-md cursor-pointer scale-90 hover:scale-100"
                      >
                        <X size={12} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="+91 9876543210" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="contact@temple.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Official Website</label>
                <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="https://www.temple.org" />
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-orange-50 text-orange-800 rounded-xl text-sm font-medium border border-orange-200">
              Please ensure all details, especially the Geolocation and Profile Picture, are correct before submitting.
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
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleSubmit}
              disabled={loading || uploadingField !== ""}
              className={`px-8 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 shadow-lg shadow-orange-500/30 transition-all ${loading || uploadingField !== "" ? 'bg-orange-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 cursor-pointer active:scale-[0.98]'}`}
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Update Mandir</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
