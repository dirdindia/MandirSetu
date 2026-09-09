import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark } from 'lucide-react';
import api from '../api/axiosInstance';
import Swal from 'sweetalert2';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    Swal.fire({
      title: 'Authenticating...',
      text: 'Please wait while we verify your credentials',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await api.post('/auth/login', { identifier, password });
      const data = response.data;

      localStorage.setItem('auth-token', data.token);
      localStorage.setItem('user-role', data.user.role);
      
      if (data.user.role === 'admin' || data.user.role === 'staff') {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Welcome to the Admin Portal',
          timer: 1500,
          showConfirmButton: false
        });
        navigate('/dashboard');
      } else {
        Swal.close();
        setError('Access Denied. Admins and Staff only.');
      }
    } catch (err) {
      Swal.close();
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Ensure the backend is running.');
      }
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
             Overseeing the divine journey for millions of devotees. Ensuring authentic and secure experiences.
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
              Admin Portal
            </h2>
            <p className="mt-3 text-sm text-maroon-darker/70 font-medium">
              Sign in to manage the MandirSetu platform.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center font-bold border border-red-200 shadow-sm">
              {error}
            </div>
          )}

          {/* Credentials Form */}
          <form className="mt-10 space-y-7" onSubmit={handleLogin}>
            <div className="space-y-5">
              {/* Identifier (Email or Phone) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gold uppercase tracking-widest pl-1">
                  Email or Mobile Number
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@gmail.com or 9876543210"
                  className="w-full px-4 py-3 bg-premium border border-gold/30 rounded-xl text-maroon-darker placeholder-maroon-darker/30 focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 text-sm transition-all shadow-inner"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gold uppercase tracking-widest pl-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-premium border border-gold/30 rounded-xl text-maroon-darker placeholder-maroon-darker/30 focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 text-sm transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-premium bg-gradient-to-r from-maroon to-maroon-dark hover:from-maroon-dark hover:to-maroon-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon active:scale-[0.98] shadow-xl shadow-maroon/20 transition-all cursor-pointer tracking-wider"
              >
                SIGN IN AS ADMIN
              </button>
            </div>
          </form>
        </div>

        {/* DIRD Branding */}
        <div className="mt-10 flex flex-col items-center justify-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-xs font-medium text-maroon-darker/70 tracking-wide uppercase">Developed by DIRD India Pvt Ltd</span>
        </div>
      </div>
    </div>
  );
}
