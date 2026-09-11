import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../api';

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Extract redirect URL from query string
  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = queryParams.get('redirect') || '/';

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire('Error', 'Passwords do not match!', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      // Calling the actual customer register endpoint
      const res = await api.post('/auth/customer-register', { name, email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'Welcome to MandirSetu.',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        window.location.href = redirectUrl;
      });
    } catch (error) {
      // Fallback if endpoint doesn't exist yet, we just simulate for now based on original code
      if (error.response?.status === 404) {
         Swal.fire({
          icon: 'success',
          title: 'Account Created!',
          text: 'Mock Registration Successful. Welcome to MandirSetu.',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          navigate(redirectUrl);
        });
      } else {
        Swal.fire('Error', error.response?.data?.message || 'Registration failed', 'error');
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
             Connecting devotees to the divine. Plan your yatras, book pujas, and order Prasad seamlessly.
           </p>
           <div className="w-24 h-1 bg-gold/50 mx-auto mt-8"></div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-12 xl:px-24 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-maroon/5 via-premium to-gold/10 overflow-y-auto">
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
              Create Account
            </h2>
            <p className="mt-3 text-sm text-maroon-darker/70 font-medium">
              Join as a Devotee to plan your spiritual journey.
            </p>
          </div>

          {/* Registration Form */}
          <form className="mt-8 space-y-5" onSubmit={handleRegister}>
            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-maroon-darker/60 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-maroon-darker/40">
                    👤
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-premium border border-gold/30 rounded-xl text-sm focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-maroon-darker/60 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-maroon-darker/40">
                    📧
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-premium border border-gold/30 rounded-xl text-sm focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-maroon-darker/60 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-maroon-darker/40">
                    🔒
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-premium border border-gold/30 rounded-xl text-sm focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all"
                    placeholder="Create password"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-maroon-darker/60 uppercase tracking-wide">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-maroon-darker/40">
                    🔐
                  </span>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-premium border border-gold/30 rounded-xl text-sm focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start mt-6">
              <input
                id="agree-terms"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 text-maroon border-gold/30 rounded focus:ring-maroon cursor-pointer"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-xs sm:text-sm text-maroon-darker/70 cursor-pointer">
                I agree to the{' '}
                <span className="font-bold text-maroon hover:underline">
                  Terms of Service
                </span>{' '}
                and{' '}
                <span className="font-bold text-maroon hover:underline">
                  Privacy Policy
                </span>.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex justify-center py-3.5 px-4 bg-maroon hover:bg-maroon-darker text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none mt-6"
            >
              {isProcessing ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-maroon-darker/70 font-medium">
            Already have an account?{' '}
            <Link to={`/signin${location.search}`} className="font-bold text-maroon hover:text-maroon-darker underline decoration-gold/50 underline-offset-4 transition-all">
              Sign in here
            </Link>
          </p>
        </div>
        
        {/* Footer text */}
        <p className="mt-8 text-center text-xs text-maroon-darker/50 font-medium">
          © {new Date().getFullYear()} MandirSetu. All rights reserved.
        </p>
      </div>
    </div>
  );
}
