import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import Swal from 'sweetalert2';
import { User, Lock, Save, Camera, MapPin, Phone, Shield } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Other',
    address: '',
    city: '',
    state: '',
    pincode: '',
    emergencyContact: '',
    profilePic: ''
  });

  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/staff/me');
      if (res.data && res.data.data) {
        const p = res.data.data;
        setProfile({
          name: p.name || '',
          email: p.contact?.email || '',
          phone: p.contact?.phone || '',
          gender: p.gender || 'Other',
          address: p.address || '',
          city: p.city || '',
          state: p.state || '',
          pincode: p.pincode || '',
          emergencyContact: p.contact?.emergencyContact || '',
          profilePic: p.media?.profilePic || ''
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to fetch profile', 'error');
    }
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/staff/me', profile);
      Swal.fire({ icon: 'success', title: 'Success', text: 'Profile updated successfully!', confirmButtonColor: '#3b82f6' });
      localStorage.setItem('user-name', profile.name);
      localStorage.setItem('user-email', profile.email || profile.phone);
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return Swal.fire('Error', 'New passwords do not match!', 'error');
    }
    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      });
      Swal.fire({ icon: 'success', title: 'Success', text: 'Password changed successfully!', confirmButtonColor: '#3b82f6' });
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Account Settings</h2>
        <p className="text-slate-500 mt-1">Manage your staff profile details and account security.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-100">
          <button 
            className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-500'}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> Profile Information
          </button>
          <button 
            className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'security' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-500'}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={18} /> Security & Password
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'profile' && (
            <form onSubmit={saveProfile} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-40 h-40 rounded-full bg-slate-50 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center relative group">
                    {profile.profilePic ? (
                      <img src={profile.profilePic} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <User size={64} className="text-slate-300" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="text-white" size={32} />
                    </div>
                  </div>
                  <div className="text-center">
                    <label className="text-sm font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors bg-blue-50 px-4 py-2 rounded-xl inline-block">
                      Change Avatar
                      <input type="file" className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                    <input required type="text" name="name" value={profile.name} onChange={handleProfileChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="Enter your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Gender</label>
                    <select name="gender" value={profile.gender} onChange={handleProfileChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input type="email" name="email" value={profile.email} onChange={handleProfileChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="your.email@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label>
                    <input required type="text" name="phone" value={profile.phone} onChange={handleProfileChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="Enter phone number" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Emergency Contact</label>
                    <input type="text" name="emergencyContact" value={profile.emergencyContact} onChange={handleProfileChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="Emergency contact name & number" />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 mt-6">
                    <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                      <MapPin size={18} className="text-blue-500" /> Address Information
                    </h3>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Street Address</label>
                    <input type="text" name="address" value={profile.address} onChange={handleProfileChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="Full street address" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                    <input type="text" name="city" value={profile.city} onChange={handleProfileChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="e.g. Varanasi" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">State</label>
                    <input type="text" name="state" value={profile.state} onChange={handleProfileChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="e.g. Uttar Pradesh" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Pincode</label>
                    <input type="text" name="pincode" value={profile.pincode} onChange={handleProfileChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="e.g. 221001" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-6 border-t border-slate-100">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg shadow-blue-500/30 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Save size={18} /> {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={savePassword} className="space-y-6 max-w-md mx-auto py-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock size={32} className="text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Update Password</h3>
                <p className="text-sm text-slate-500 mt-1">Ensure your account uses a strong, secure password.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                  <input required type="password" name="oldPassword" value={passwords.oldPassword} onChange={handlePasswordChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                  <input required type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                  <input required type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="••••••••" />
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg shadow-blue-500/30 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Shield size={18} /> {loading ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
