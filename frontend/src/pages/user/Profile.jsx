import { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Camera, Save, X, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../api';
// import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/signin');
      
      const res = await api.get('/users/profile', {
        headers: { 'auth-token': token }
      });
      setUser(res.data);
      setFormData({
        name: res.data.name || '',
        phone: res.data.phone || '',
        address: res.data.address || '',
        city: res.data.city || '',
        state: res.data.state || '',
        pincode: res.data.pincode || ''
      });
      // Sync local storage user
      const lsUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...lsUser, ...res.data }));
    } catch (error) {
      console.error('Failed to fetch profile', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/signin');
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.put('/users/profile', formData, {
        headers: { 'auth-token': token }
      });
      
      setUser(res.data.user);
      setIsEditing(false);
      Swal.fire('Success', 'Profile updated successfully', 'success');
      
      // Update local storage
      const lsUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...lsUser, ...res.data.user }));
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('files', file);

    setIsUploading(true);
    try {
      // 1. Upload to Cloudinary
      const uploadRes = await api.post('/upload/upload-files', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = uploadRes.data.urls[0];

      // 2. Update Profile
      const token = localStorage.getItem('token');
      const res = await api.put('/users/profile', { avatar: imageUrl }, {
        headers: { 'auth-token': token }
      });
      
      setUser(res.data.user);
      const lsUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...lsUser, ...res.data.user }));
      
      Swal.fire('Success', 'Profile picture updated', 'success');
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to upload image', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            My Profile
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-orange-500 to-amber-500 relative">
            <button className="absolute bottom-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-colors cursor-pointer">
              <Camera size={18} />
            </button>
          </div>
          
          {/* Avatar and Basic Info */}
          <div className="px-8 pb-8 relative">
            <div className="flex justify-between items-end -mt-12 mb-6">
              <div className="relative group">
                <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center p-1 border-4 border-white dark:border-slate-900 shadow-md">
                  <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 overflow-hidden relative">
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={40} />
                    )}
                  </div>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*"
                  className="hidden" 
                />
                
                <button 
                  onClick={() => fileInputRef.current.click()}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 bg-orange-500 text-white p-1.5 rounded-full border-2 border-white dark:border-slate-900 hover:bg-orange-600 transition-colors cursor-pointer group-hover:scale-110 disabled:opacity-50"
                  title="Upload profile picture"
                >
                  <Camera size={14} />
                </button>
              </div>
              
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-medium text-sm rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors cursor-pointer"
                >
                  <Edit2 size={16} /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setIsEditing(false); fetchProfile(); }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium text-sm rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <X size={16} /> Cancel
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-medium text-sm rounded-lg hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Save size={16} /> {isProcessing ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {user.name || user.email.split('@')[0]}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Devotee</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              {/* Form inside a standard div since we are handling submit manually on button */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400">
                    <User size={18} />
                  </div>
                  <div className="flex-1 w-full">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</p>
                    {isEditing ? (
                      <input 
                        type="text" name="name" value={formData.name} onChange={handleChange}
                        className="mt-1 w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-sm focus:border-orange-500 focus:outline-none" 
                        placeholder="Your full name"
                      />
                    ) : (
                      <p className="font-medium text-sm sm:text-base">{user.name || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400">
                    <Mail size={18} />
                  </div>
                  <div className="flex-1 w-full">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</p>
                    <p className="font-medium text-sm sm:text-base text-slate-500">{user.email} (Read-only)</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400">
                    <Phone size={18} />
                  </div>
                  <div className="flex-1 w-full">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone Number</p>
                    {isEditing ? (
                      <input 
                        type="text" name="phone" value={formData.phone} onChange={handleChange}
                        className="mt-1 w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-sm focus:border-orange-500 focus:outline-none" 
                        placeholder="Your phone number"
                      />
                    ) : (
                      <p className="font-medium text-sm sm:text-base">{user.phone || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400">
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1 w-full">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location Details</p>
                    {isEditing ? (
                      <div className="space-y-2 mt-1">
                        <input 
                          type="text" name="address" value={formData.address} onChange={handleChange}
                          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-sm focus:border-orange-500 focus:outline-none" 
                          placeholder="Street Address"
                        />
                        <div className="flex gap-2">
                          <input 
                            type="text" name="city" value={formData.city} onChange={handleChange}
                            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-sm focus:border-orange-500 focus:outline-none" 
                            placeholder="City"
                          />
                          <input 
                            type="text" name="state" value={formData.state} onChange={handleChange}
                            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-sm focus:border-orange-500 focus:outline-none" 
                            placeholder="State"
                          />
                        </div>
                        <input 
                          type="text" name="pincode" value={formData.pincode} onChange={handleChange}
                          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-sm focus:border-orange-500 focus:outline-none" 
                          placeholder="Pincode"
                        />
                      </div>
                    ) : (
                      <p className="font-medium text-sm sm:text-base text-slate-700 dark:text-slate-300">
                        {user.address || user.city || user.state ? (
                          <>
                            {user.address && <span className="block">{user.address}</span>}
                            <span className="block">
                              {[user.city, user.state, user.pincode].filter(Boolean).join(', ')}
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-400 italic">Add your location details</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 pt-2">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400">
                    <Calendar size={18} />
                  </div>
                  <div className="flex-1 w-full">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Joined</p>
                    <p className="font-medium text-sm sm:text-base">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
