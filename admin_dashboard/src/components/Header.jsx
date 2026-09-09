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
      text: "You will be logged out of the Admin Portal.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ea580c',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, log out'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-role');
        navigate('/login');
      }
    });
  };

  return (
    <header className="bg-premium border-b border-gold/20 h-16 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0 transition-colors font-sans">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 mr-4 rounded-lg text-maroon-darker/70 hover:bg-gold/10 hover:text-maroon lg:hidden focus:outline-none transition-colors"
        >
          <Menu size={24} />
        </button>
        {/* <h2 className="text-xl font-serif font-bold text-maroon hidden sm:block">Admin Overview</h2> */}
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-maroon-darker/50 hover:text-gold rounded-full hover:bg-gold/10 transition cursor-pointer"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="p-2 text-maroon-darker/50 hover:text-gold rounded-full hover:bg-gold/10 transition cursor-pointer">
          <Bell size={20} />
        </button>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white hover:bg-red-50 text-maroon-darker/70 hover:text-red-600 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-gold/30 hover:border-red-200 shadow-sm cursor-pointer"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
