import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../api';

export default function SignIn() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [otp, setOtp] = useState('');


  const handleLogin = async (e) => {
    e.preventDefault();

    // Customer Login
    setIsProcessing(true);
    try {
      if (loginMethod === 'password') {
        const res = await api.post('/auth/customer-login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        Swal.fire('Success', 'Logged in successfully', 'success').then(() => {
          window.location.href = '/';
        });
      } else {
        // OTP verify
        const res = await api.post('/auth/verify-otp', { email, otp });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        Swal.fire('Success', 'Logged in successfully', 'success').then(() => {
          window.location.href = '/';
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
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-500/5 to-transparent">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-900 rounded-3xl shadow-lg">
        {/* Header Title */}
        <div className="text-center">
          <span className="text-2xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            MANDIRSETU
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your bookings and spiritual orders.
          </p>
        </div>

        <div className="flex gap-4 mt-4 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button 
            type="button"
            onClick={() => setLoginMethod('password')}
            className={`text-sm font-semibold transition-colors cursor-pointer ${loginMethod === 'password' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-slate-500'}`}
          >
            Password Login
          </button>
          <button 
            type="button"
            onClick={() => { setLoginMethod('otp'); setOtpSent(false); }}
            className={`text-sm font-semibold transition-colors cursor-pointer ${loginMethod === 'otp' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-slate-500'}`}
          >
            OTP Login
          </button>
        </div>

        {/* Credentials Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-850 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>

            {/* Password */}
            {loginMethod === 'password' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-850 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>
            )}

            {/* OTP Section */}
            {loginMethod === 'otp' && (
              <div className="space-y-4">
                {!otpSent ? (
                  <button 
                    type="button" 
                    onClick={handleSendOTP}
                    disabled={isProcessing}
                    className="w-full py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl font-medium hover:bg-slate-300 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Send OTP
                  </button>
                ) : (
                  <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="6-digit OTP"
                      maxLength={6}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-850 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm tracking-widest text-center font-bold"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Remember me & Forget */}
          {loginMethod === 'password' && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500 cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-slate-500 dark:text-slate-400 cursor-pointer">
                  Remember me
                </label>
              </div>

              <button type="button" className="font-semibold text-orange-655 hover:text-orange-500 dark:text-orange-455 cursor-pointer">
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit */}
          <div>
            {!(loginMethod === 'otp' && !otpSent) && (
              <button
                type="submit"
                disabled={isProcessing}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none active:scale-[0.98] shadow-md shadow-orange-500/10 transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : `Sign In`}
              </button>
            )}
          </div>
        </form>

        {/* Footer Redirect */}
        <div className="text-center text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-850">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-orange-600 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
