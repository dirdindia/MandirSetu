import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
  const [role, setRole] = useState('devotee');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert(`Mock Registration Success!\nName: ${name}\nEmail: ${email}\nRole: ${role.toUpperCase()}`);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-500/5 to-transparent">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-900 rounded-3xl shadow-lg">
        {/* Header Title */}
        <div className="text-center">
          <span className="text-2xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            MANDIRSETU
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign up to plan your yatras and order Prasad.
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl">
          <button
            type="button"
            onClick={() => setRole('devotee')}
            className={`py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
              role === 'devotee'
                ? 'bg-white dark:bg-slate-900 text-orange-650 dark:text-orange-455 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            I am a Devotee
          </button>
          <button
            type="button"
            onClick={() => setRole('agent')}
            className={`py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
              role === 'agent'
                ? 'bg-white dark:bg-slate-900 text-orange-655 dark:text-orange-455 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Apply as Agent
          </button>
        </div>

        {/* Registration Form */}
        <form className="mt-8 space-y-5" onSubmit={handleRegister}>
          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-955 border border-slate-300 dark:border-slate-850 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>

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
                placeholder="Enter email address"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-955 border border-slate-300 dark:border-slate-850 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm"
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
                placeholder="Create password"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-955 border border-slate-300 dark:border-slate-850 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-955 border border-slate-300 dark:border-slate-850 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start">
            <input
              id="agree-terms"
              type="checkbox"
              required
              className="mt-1 h-4 w-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500 cursor-pointer"
            />
            <label htmlFor="agree-terms" className="ml-2 block text-xs sm:text-sm text-slate-500 dark:text-slate-400 cursor-pointer">
              I agree to the{' '}
              <span className="font-semibold text-orange-655 hover:underline">
                Terms of Service
              </span>{' '}
              and{' '}
              <span className="font-semibold text-orange-655 hover:underline">
                Privacy Policy
              </span>.
            </label>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none active:scale-[0.98] shadow-md shadow-orange-500/10 transition-all cursor-pointer"
            >
              {role === 'devotee' ? 'Create Account' : 'Submit Agent Application'}
            </button>
          </div>
        </form>

        {/* Footer Redirect */}
        <div className="text-center text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-850">
          Already have an account?{' '}
          <Link to="/signin" className="font-bold text-orange-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
