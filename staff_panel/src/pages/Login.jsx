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

    try {
      const response = await api.post('/auth/login', { identifier, password });
      const data = response.data;

      localStorage.setItem('auth-token', data.token);
      localStorage.setItem('user-role', data.user.role);
      if (data.user.name) localStorage.setItem('user-name', data.user.name);
      if (data.user.email) localStorage.setItem('user-email', data.user.email);
      
      if (data.user.role === 'staff') {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Welcome to the Staff Portal',
          timer: 1500,
          showConfirmButton: false
        });
        navigate('/dashboard');
      } else {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-role');
        localStorage.removeItem('user-name');
        localStorage.removeItem('user-email');
        setError('Access Denied. Staff only.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Ensure the backend is running.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-500/5 to-transparent">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-900 rounded-3xl shadow-lg">
        {/* Header Title */}
        <div className="text-center flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Landmark size={24} strokeWidth={2.5} />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent tracking-wide">
              MANDIRSETU
            </span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
            Staff Portal
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to manage your tasks.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center font-medium border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            {/* Identifier (Email or Phone) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Email or Mobile Number
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="staff@gmail.com or 9876543210"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-850 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-850 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
              />
            </div>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:scale-[0.98] shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              Sign In as STAFF
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
