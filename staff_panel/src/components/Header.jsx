import React from 'react';
import { Menu, LogOut, Bell, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Swal from 'sweetalert2';

export default function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    Swal.fire({
      title: 'Ready to Leave?',
      text: "You will be logged out of the Staff Portal.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, log out'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-role');
        if (localStorage.getItem('user-name')) localStorage.removeItem('user-name');
        if (localStorage.getItem('user-email')) localStorage.removeItem('user-email');
        if (localStorage.getItem('mandir_id')) localStorage.removeItem('mandir_id');
        if (localStorage.getItem('dham_id')) localStorage.removeItem('dham_id');
        navigate('/login');
      }
    });
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0 transition-colors">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 mr-4 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none transition-colors cursor-pointer"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white hidden sm:block">Staff Portal</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-400 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="p-2 text-slate-400 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer">
          <Bell size={20} />
        </button>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800 shadow-sm cursor-pointer"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
