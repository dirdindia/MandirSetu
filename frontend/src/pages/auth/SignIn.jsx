import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SignIn() {
  const [role, setRole] = useState('devotee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'admin') {
      window.location.href = 'http://localhost:5174/login';
      return;
    }
    alert(`Mock Login Success!\nRole: ${role.toUpperCase()}\nEmail: ${email}`);
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

        {/* Role Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl">
          {['devotee', 'agent', 'admin'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                role === r
                  ? 'bg-white dark:bg-slate-900 text-orange-650 dark:text-orange-450 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
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
          </div>

          {/* Remember me & Forget */}
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

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none active:scale-[0.98] shadow-md shadow-orange-500/10 transition-all cursor-pointer"
            >
              Sign In as {role.toUpperCase()}
            </button>
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
