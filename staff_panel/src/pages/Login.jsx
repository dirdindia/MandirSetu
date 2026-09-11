import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import Swal from 'sweetalert2';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      const response = await api.post('/auth/login', { identifier, password });
      const data = response.data;

      localStorage.setItem('auth-token', data.token);
      localStorage.setItem('user-role', data.user.role);
      if (data.user.name) localStorage.setItem('user-name', data.user.name);
      if (data.user.email) localStorage.setItem('user-email', data.user.email);
      if (data.user.mandir_id) localStorage.setItem('mandir_id', data.user.mandir_id);
      if (data.user.dham_id) localStorage.setItem('dham_id', data.user.dham_id);
      
      if (data.user.role === 'staff') {
        Swal.fire({
          icon: 'success',
          title: 'Welcome Back!',
          text: 'Logged into the Staff Portal.',
          timer: 1500,
          showConfirmButton: false
        });
        navigate('/dashboard');
      } else {
        // Not a staff
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-role');
        localStorage.removeItem('user-name');
        localStorage.removeItem('user-email');
        localStorage.removeItem('mandir_id');
        localStorage.removeItem('dham_id');
        setError('Access Denied. Staff only.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Ensure the backend is running.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-premium">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-maroon-darker items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80&w=2000" 
          alt="Temple Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-darker via-maroon-darker/40 to-transparent"></div>
        <div className="relative z-10 p-12 text-center max-w-lg">
           <h2 className="text-4xl lg:text-5xl font-serif font-bold text-premium mb-6 tracking-wide leading-tight drop-shadow-lg">
             Mandir Setu
           </h2>
           <p className="text-lg text-premium/90 font-light drop-shadow-md">
             Dedicated Staff Portal. Manage daily operations, events, and bookings across Mandirs and Dhams.
           </p>
           <div className="w-24 h-1 bg-gold/50 mx-auto mt-8"></div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-12 xl:px-24 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-maroon/5 via-premium to-gold/10">
        <div className="w-full max-w-md space-y-8 bg-white p-10 border border-gold/20 rounded-[2rem] shadow-2xl shadow-maroon/5 relative overflow-hidden">
          
          {/* Top Decorative Border */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold via-[#fde08b] to-gold"></div>

          {/* Header Title */}
          <div className="text-center flex flex-col items-center pt-2">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white border border-gold/30 shadow-md p-2">
                <img src="/logo1.png" alt="MandirSetu Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <h2 className="mt-2 text-3xl font-serif font-bold text-maroon-darker">
              Staff Portal
            </h2>
            <p className="mt-3 text-sm text-maroon-darker/70 font-medium">
              Sign in to manage your tasks.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center font-medium border border-red-200 mt-4">
              {error}
            </div>
          )}

          {/* Credentials Form */}
          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            <div className="space-y-4">
              {/* Identifier */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-maroon-darker/60 uppercase tracking-wide">
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-maroon-darker/40">
                    👤
                  </span>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-premium border border-gold/30 rounded-xl text-sm focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all"
                    placeholder="Enter email or phone"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-maroon-darker/60 uppercase tracking-wide">
                    Password
                  </label>
                  <a href="#" className="text-xs font-semibold text-maroon hover:text-maroon-darker transition-colors">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-maroon-darker/40">
                    🔒
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-premium border border-gold/30 rounded-xl text-sm focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex justify-center py-3.5 px-4 bg-maroon hover:bg-maroon-darker text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none mt-6"
            >
              {isProcessing ? 'Authenticating...' : 'Sign In as Staff'}
            </button>
          </form>
        </div>
        
        {/* Footer text */}
        <p className="mt-12 text-center text-xs text-maroon-darker/50 font-medium">
          © {new Date().getFullYear()} MandirSetu. Authorized Personnel Only.
        </p>
      </div>
    </div>
  );
}
