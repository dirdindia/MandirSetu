import React, { useState } from 'react';
import api from '../../api/axiosInstance';
import Swal from 'sweetalert2';
import { 
  Coffee, MapPin, Phone, Image as ImageIcon, CheckSquare,
  ChevronRight, ChevronLeft, Save, Map, UploadCloud, Loader2, Search, X
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import OpenLocationCode from 'open-location-code';

const CUISINE_OPTIONS = ["North Indian", "South Indian", "Chinese", "Italian", "Fast Food", "Continental", "Street Food", "Desserts", "Beverages"];
const AMENITY_OPTIONS = ["AC Seating", "Outdoor Seating", "Parking", "WiFi", "Home Delivery", "Takeaway", "Family Friendly", "Live Music"];

export default function OnboardRestaurant() {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editData;
  const isEditMode = !!editData;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState("");
  const [quickLocationInput, setQuickLocationInput] = useState("");
  const [fetchedLocationDetails, setFetchedLocationDetails] = useState(null);

  const [formData, setFormData] = useState({
    name: editData?.name || '',
    description: editData?.description || '',
    cuisine: editData?.cuisine || [],
    amenities: editData?.amenities || [],
    isVegetarianOnly: editData?.isVegetarianOnly || false,
    averageCostForTwo: editData?.averageCostForTwo || '',
    seatingCapacity: editData?.seatingCapacity || '',
    fssaiLicense: editData?.fssaiLicense || '',
    openTime: editData?.schedule?.openTime || '',
    closeTime: editData?.schedule?.closeTime || '',
    alwaysOpen: editData?.schedule?.alwaysOpen || false,
    address: editData?.location?.address || '',
    city: editData?.location?.city || '',
    state: editData?.location?.state || '',
    pincode: editData?.location?.pincode || '',
    latitude: editData?.geolocation?.latitude || '',
    longitude: editData?.geolocation?.longitude || '',
    managerName: editData?.contact?.managerName || '',
    phone: editData?.contact?.phone || '',
    email: editData?.contact?.email || '',
    website: editData?.contact?.website || '',
    profilePic: editData?.profilePic || '',
    gallery: editData?.gallery || []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => {
      const currentArr = prev[field];
      if (currentArr.includes(value)) {
        return { ...prev, [field]: currentArr.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...currentArr, value] };
      }
    });
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Geolocation is not supported', customClass: { confirmButton: 'bg-green-600 text-white rounded-xl' } });
      return;
    }
    
    Swal.fire({ title: 'Detecting Location...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData({ ...formData, latitude: pos.coords.latitude.toString(), longitude: pos.coords.longitude.toString() });
        Swal.fire({ icon: 'success', title: 'Location Fetched!', timer: 1500, showConfirmButton: false });
      },
      () => Swal.fire({ icon: 'error', title: 'Error', text: 'Unable to retrieve location.', customClass: { confirmButton: 'bg-green-600 text-white rounded-xl' } })
    );
  };

  const handleQuickLocationFill = async () => {
    if (!quickLocationInput.trim()) return;
    Swal.fire({ title: 'Resolving Location...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    try {
      let lat, lng;
      const match = quickLocationInput.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
      if (match) { lat = parseFloat(match[1]); lng = parseFloat(match[3]); } 
      else { const decoded = OpenLocationCode.decode(quickLocationInput.trim()); lat = decoded.latitudeCenter; lng = decoded.longitudeCenter; }

      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data.error) throw new Error("Could not find address.");

      setFormData(prev => ({
        ...prev, latitude: lat.toString(), longitude: lng.toString(),
        address: data.display_name || '', city: data.address?.city || data.address?.town || data.address?.village || '',
        state: data.address?.state || '', pincode: data.address?.postcode || ''
      }));
      setFetchedLocationDetails({ fullAddress: data.display_name, city: data.address?.city || data.address?.town, state: data.address?.state, pincode: data.address?.postcode });
      Swal.fire({ icon: 'success', title: 'Location Resolved!', timer: 2000, showConfirmButton: false });
    } catch (error) { Swal.fire({ icon: 'error', title: 'Failed', text: error.message, customClass: { confirmButton: 'bg-green-600 text-white rounded-xl' } }); }
  };

  const handleFileChange = async (e, fieldName) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingField(fieldName);
    const data = new FormData();
    files.forEach((file) => data.append("files", file));

    try {
      const res = await api.post("/upload/upload-files", data, { headers: { "Content-Type": "multipart/form-data" } });
      setFormData((prev) => ({
        ...prev, [fieldName]: fieldName === 'gallery' ? [...prev.gallery, ...res.data.urls] : res.data.urls[0],
      }));
      Swal.fire({ icon: 'success', title: 'Uploaded!', text: 'Image uploaded successfully.', timer: 1500, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Upload Failed', text: 'Error uploading image.', customClass: { confirmButton: 'bg-green-600 text-white rounded-xl' } });
    } finally { setUploadingField(""); }
  };

  const handleRemoveGalleryImage = (index) => {
    setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    Swal.fire({ title: isEditMode ? 'Updating Restaurant...' : 'Onboarding Restaurant...', html: 'Please wait...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    try {
      const payload = {
        name: formData.name, description: formData.description,
        cuisine: formData.cuisine, amenities: formData.amenities,
        isVegetarianOnly: formData.isVegetarianOnly,
        averageCostForTwo: formData.averageCostForTwo ? Number(formData.averageCostForTwo) : undefined,
        seatingCapacity: formData.seatingCapacity ? Number(formData.seatingCapacity) : undefined,
        fssaiLicense: formData.fssaiLicense,
        schedule: { openTime: formData.openTime, closeTime: formData.closeTime, alwaysOpen: formData.alwaysOpen },
        location: { address: formData.address, city: formData.city, state: formData.state, pincode: formData.pincode },
        contact: { managerName: formData.managerName, phone: formData.phone, email: formData.email, website: formData.website },
        geolocation: { latitude: formData.latitude, longitude: formData.longitude },
        profilePic: formData.profilePic, gallery: formData.gallery
      };

      if (isEditMode) {
        await api.put(`/restaurants/${editData._id}`, payload);
        Swal.fire({ icon: 'success', title: 'Updated!', text: 'Restaurant successfully updated.', customClass: { confirmButton: 'bg-green-600 text-white rounded-xl' } });
        navigate('/directories/restaurants');
      } else {
        await api.post('/restaurants', payload);
        Swal.fire({ icon: 'success', title: 'Onboarded!', text: 'Restaurant successfully added.', customClass: { confirmButton: 'bg-green-600 text-white rounded-xl' } });
        setFormData({ name: '', description: '', cuisine: [], amenities: [], isVegetarianOnly: false, averageCostForTwo: '', seatingCapacity: '', fssaiLicense: '', openTime: '', closeTime: '', alwaysOpen: false, address: '', city: '', state: '', pincode: '', latitude: '', longitude: '', managerName: '', phone: '', email: '', website: '', profilePic: '', gallery: [] });
        setStep(1);
      }
    } catch (err) { Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Error occurred.', customClass: { confirmButton: 'bg-green-600 text-white rounded-xl' } }); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{isEditMode ? 'Edit Restaurant' : 'Onboard New Restaurant'}</h2>
        <p className="text-slate-500 mt-2">{isEditMode ? 'Update the details of the restaurant.' : 'Fill out the details step-by-step to register a new dining place.'}</p>
      </div>

      <div className="flex items-center justify-between mb-10 relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1.5 bg-slate-200 dark:bg-slate-800 -z-10 rounded-full"></div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1.5 bg-green-500 -z-10 rounded-full transition-all duration-500 ease-out" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
        
        {[
          { num: 1, icon: <Coffee size={18} />, label: 'Basic Info' },
          { num: 2, icon: <CheckSquare size={18} />, label: 'Cuisine' },
          { num: 3, icon: <MapPin size={18} />, label: 'Location' },
          { num: 4, icon: <ImageIcon size={18} />, label: 'Media' },
          { num: 5, icon: <Phone size={18} />, label: 'Contact' }
        ].map((s) => (
          <div key={s.num} onClick={() => setStep(s.num)} className="flex flex-col items-center gap-2 cursor-pointer group hover:scale-105 transition-transform">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-4 transition-all duration-300 ${step >= s.num ? 'bg-green-500 border-green-100 text-white shadow-md shadow-green-500/30' : 'bg-slate-100 border-white text-slate-400 dark:bg-slate-800 dark:border-slate-900 group-hover:border-green-200'}`}>
              {s.icon}
            </div>
            <span className={`text-xs font-bold transition-colors ${step >= s.num ? 'text-green-600' : 'text-slate-400 group-hover:text-green-500'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden p-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b pb-2">Basic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Restaurant Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all" placeholder="e.g. Annapurna Bhojnalaya" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Average Cost For Two (₹)</label>
                <input type="number" name="averageCostForTwo" value={formData.averageCostForTwo} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all" placeholder="e.g. 500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Seating Capacity</label>
                <input type="number" name="seatingCapacity" value={formData.seatingCapacity} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all" placeholder="e.g. 50" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">FSSAI License No.</label>
                <input type="text" name="fssaiLicense" value={formData.fssaiLicense} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all" placeholder="e.g. 10012013000..." />
              </div>
              <div className="md:col-span-2 pt-2">
                <label className="flex items-center gap-3 font-bold text-slate-700 dark:text-slate-300 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/50 px-5 py-4 rounded-2xl w-full cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                  <input type="checkbox" name="isVegetarianOnly" checked={formData.isVegetarianOnly} onChange={handleChange} className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500" /> 
                  <span className="text-emerald-800 dark:text-emerald-400">Pure Vegetarian Restaurant</span>
                </label>
              </div>
              <div className="md:col-span-2">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-xl text-sm font-medium border border-green-200 dark:border-green-800/50">
                  <p><strong>Note:</strong> This Restaurant will be automatically associated with your assigned Mandir or Dham.</p>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all resize-none" placeholder="Brief description of the restaurant..."></textarea>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b pb-2">Cuisines & Amenities</h3>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Cuisines Offered</label>
              <div className="flex flex-wrap gap-3">
                {CUISINE_OPTIONS.map(cu => (
                  <label key={cu} className={`px-4 py-2 rounded-xl border cursor-pointer font-bold text-sm transition-all active:scale-95 ${formData.cuisine.includes(cu) ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-green-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'}`}>
                    <input type="checkbox" className="hidden" checked={formData.cuisine.includes(cu)} onChange={() => handleArrayToggle('cuisine', cu)} />
                    {cu}
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Amenities & Facilities</label>
              <div className="flex flex-wrap gap-3">
                {AMENITY_OPTIONS.map(am => (
                  <label key={am} className={`px-4 py-2 rounded-xl border cursor-pointer font-bold text-sm transition-all active:scale-95 ${formData.amenities.includes(am) ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-green-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'}`}>
                    <input type="checkbox" className="hidden" checked={formData.amenities.includes(am)} onChange={() => handleArrayToggle('amenities', am)} />
                    {am}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b pb-2">Schedule & Location</h3>
            
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6">
              <label className="flex items-center gap-3 font-bold text-slate-700 dark:text-slate-300 mb-4 cursor-pointer">
                <input type="checkbox" name="alwaysOpen" checked={formData.alwaysOpen} onChange={handleChange} className="w-5 h-5 rounded text-green-600 focus:ring-green-500" /> 
                <span>24/7 Open</span>
              </label>
              {!formData.alwaysOpen && (
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Open Time</label>
                    <input type="time" name="openTime" value={formData.openTime} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Close Time</label>
                    <input type="time" name="closeTime" value={formData.closeTime} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all" />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-green-50 dark:bg-green-900/10 p-5 rounded-2xl border border-green-200 dark:border-green-800/50 mb-6">
              <label className="block text-sm font-bold text-green-900 dark:text-green-400 mb-2">
                Quick Fill (Enter Lat, Lng OR Plus Code)
              </label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={quickLocationInput} 
                  onChange={(e) => setQuickLocationInput(e.target.value)} 
                  className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-green-200 dark:border-green-800 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all" 
                  placeholder="e.g. 25.3109, 83.0107 OR 8JMP6M8X+28" 
                />
                <button 
                  onClick={handleQuickLocationFill} 
                  type="button" 
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-md shadow-green-500/20 cursor-pointer transition-all active:scale-[0.98] flex items-center gap-2"
                >
                  <Search size={18} /> Find
                </button>
              </div>
              
              {fetchedLocationDetails && (
                <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-green-100 dark:border-slate-700 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Fetched Details</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-1"><strong>Address:</strong> {fetchedLocationDetails.fullAddress}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Address *</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all" placeholder="Street address..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">City *</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all" placeholder="e.g. Varanasi" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">State *</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all" placeholder="e.g. UP" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pincode *</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all" placeholder="e.g. 221001" />
              </div>
              
              <div className="md:col-span-3 mt-2 p-5 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/50 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-teal-900 dark:text-teal-400 flex items-center gap-2"><Map size={18}/> Geolocation (Required)</h4>
                    <p className="text-xs text-teal-700 dark:text-teal-500 mt-1">Fetch coordinates to show restaurant on the map.</p>
                  </div>
                  <button onClick={handleGetLocation} type="button" className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 shadow-md shadow-teal-500/20 text-white text-sm font-bold rounded-xl cursor-pointer transition-all active:scale-[0.98]">
                    Detect My Location
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-teal-800/70 dark:text-teal-500 mb-1">Latitude</label>
                    <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 rounded-lg focus:outline-none transition-all" placeholder="25.3109" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-teal-800/70 dark:text-teal-500 mb-1">Longitude</label>
                    <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 rounded-lg focus:outline-none transition-all" placeholder="83.0107" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b pb-2">Media Uploads</h3>
            
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <UploadCloud className="mx-auto text-green-400 mb-3" size={40} />
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Main Profile Picture</label>
              <p className="text-xs text-slate-500 mb-4">Upload the main cover image (JPEG, PNG)</p>
              
              <input type="file" accept="image/*" id="profilePic" className="hidden" onChange={(e) => handleFileChange(e, 'profilePic')} />
              <label htmlFor="profilePic" className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl text-sm font-bold hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                {uploadingField === 'profilePic' ? <Loader2 size={16} className="animate-spin" /> : 'Select File'}
              </label>

              {formData.profilePic && (
                <div className="mt-6 flex justify-center">
                  <div className="relative group inline-block">
                    <img src={formData.profilePic} alt="Profile" className="w-32 h-32 object-cover rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700" />
                    <button 
                      type="button" 
                      onClick={() => setFormData(p => ({...p, profilePic: ''}))}
                      className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-md cursor-pointer scale-90 hover:scale-100"
                    >
                      <X size={16} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <UploadCloud className="mx-auto text-green-400 mb-3" size={40} />
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Gallery Images</label>
              <p className="text-xs text-slate-500 mb-4">Upload multiple images showcasing the ambience and food</p>
              
              <input type="file" multiple accept="image/*" id="gallery" className="hidden" onChange={(e) => handleFileChange(e, 'gallery')} />
              <label htmlFor="gallery" className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl text-sm font-bold hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                 {uploadingField === 'gallery' ? <Loader2 size={16} className="animate-spin" /> : 'Select Files'}
              </label>

              {formData.gallery.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  {formData.gallery.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt={`Gallery ${i}`} className="w-20 h-20 object-cover rounded-xl shadow-sm border border-slate-200 dark:border-slate-700" />
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

        {step === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b pb-2">Contact Info & Review</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Manager / Contact Person</label>
                <input type="text" name="managerName" value={formData.managerName} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Phone Number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all" placeholder="+91 9876543210" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all" placeholder="restaurant@example.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Official Website</label>
                <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all" placeholder="https://www.restaurant.com" />
              </div>
            </div>
            
            <div className="mt-8 p-5 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-xl text-sm font-bold border border-green-200 dark:border-green-800/50">
              Please review all details before submitting. Geolocation is required.
            </div>
          </div>
        )}

        <div className="flex justify-between mt-10 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button 
            type="button" 
            onClick={handlePrev}
            disabled={step === 1 || loading}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${step === 1 ? 'opacity-0 cursor-default' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 cursor-pointer'}`}
          >
            <ChevronLeft size={18} /> Back
          </button>

          {step < 5 ? (
            <button 
              type="button" 
              onClick={handleNext}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md shadow-green-500/20 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleSubmit}
              disabled={loading || uploadingField !== ""}
              className={`px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2 shadow-lg transition-all ${loading || uploadingField !== "" ? 'bg-green-400 shadow-none cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-green-500/30 cursor-pointer active:scale-[0.98]'}`}
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> {isEditMode ? 'Update Restaurant' : 'Submit Restaurant'}</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
