import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../api';

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [otp, setOtp] = useState('');

  // Extract redirect URL from query string
  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = queryParams.get('redirect') || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (loginMethod === 'password') {
        const res = await api.post('/auth/customer-login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        Swal.fire({
          icon: 'success',
          title: 'Welcome back!',
          text: 'Logged in successfully.',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          window.location.href = redirectUrl;
        });
      } else {
        // OTP verify
        const res = await api.post('/auth/verify-otp', { email, otp });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        Swal.fire({
          icon: 'success',
          title: 'Welcome back!',
          text: 'Logged in successfully.',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          window.location.href = redirectUrl;
        });
      }
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Login failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendOTP = async () => {
    if (!email) {
      return Swal.fire('Error', 'Please enter your email first', 'error');
    }
    setIsProcessing(true);
    try {
      const res = await api.post('/auth/generate-otp', { email });
      setOtpSent(true);
      Swal.fire('Success', res.data.message, 'success');
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to send OTP', 'error');
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
             Connecting devotees to the divine. Book your yatra, pujas, and accommodations seamlessly.
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
              Welcome Back
            </h2>
            <p className="mt-3 text-sm text-maroon-darker/70 font-medium">
              Sign in to access your bookings and spiritual orders.
            </p>
          </div>

          <div className="flex gap-4 mt-6 border-b border-gold/20 pb-2 justify-center">
            <button 
              type="button"
              onClick={() => setLoginMethod('password')}
              className={`text-sm font-semibold transition-colors cursor-pointer pb-2 px-2 ${loginMethod === 'password' ? 'text-maroon border-b-2 border-maroon' : 'text-maroon-darker/50'}`}
            >
              Password Login
            </button>
            <button 
              type="button"
              onClick={() => { setLoginMethod('otp'); setOtpSent(false); }}
              className={`text-sm font-semibold transition-colors cursor-pointer pb-2 px-2 ${loginMethod === 'otp' ? 'text-maroon border-b-2 border-maroon' : 'text-maroon-darker/50'}`}
            >
              OTP Login
            </button>
          </div>

          {/* Credentials Form */}
          <form className="mt-6 space-y-5" onSubmit={handleLogin}>
            <div className="space-y-4">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-premium border border-gold/30 rounded-xl text-sm focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {loginMethod === 'password' ? (
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
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-maroon-darker/60 uppercase tracking-wide">
                    One-Time Password (OTP)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-maroon-darker/40">
                        📱
                      </span>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required={otpSent}
                        disabled={!otpSent}
                        className="w-full pl-10 pr-4 py-3 bg-premium border border-gold/30 rounded-xl text-sm focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-all disabled:opacity-50"
                        placeholder="Enter 6-digit OTP"
                      />
                    </div>
                    {!otpSent && (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={isProcessing}
                        className="px-4 py-3 bg-gold/20 hover:bg-gold/30 text-maroon-darker font-bold rounded-xl text-sm transition-colors whitespace-nowrap"
                      >
                        Send OTP
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex justify-center py-3.5 px-4 bg-maroon hover:bg-maroon-darker text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none mt-6"
            >
              {isProcessing ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-maroon-darker/70 font-medium">
            Don't have an account?{' '}
            <Link to={`/signup${location.search}`} className="font-bold text-maroon hover:text-maroon-darker underline decoration-gold/50 underline-offset-4 transition-all">
              Sign up now
            </Link>
          </p>
        </div>
        
        {/* Footer text */}
        <p className="mt-12 text-center text-xs text-maroon-darker/50 font-medium">
          © {new Date().getFullYear()} MandirSetu. All rights reserved.
        </p>
      </div>
    </div>
  );
}
