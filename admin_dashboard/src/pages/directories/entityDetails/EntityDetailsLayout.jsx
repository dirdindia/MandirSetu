import React, { useState, useEffect } from 'react';
import { useParams, Link, NavLink, Outlet } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { 
  Building, Hotel, Utensils, Box, ArrowLeft, Loader2, Info
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function EntityDetailsLayout({ type }) {
  const { id } = useParams();
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const endpointBase = type === 'mandir' ? `/mandirs/${id}` : `/dhams/${id}`;

  useEffect(() => {
    fetchOverview();
  }, [id, type]);

  const fetchOverview = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`${endpointBase}/full-details?type=overview`);
      setOverview(res.data);
    } catch (error) {
      console.error('Failed to fetch overview:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Could not fetch details.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Info size={18} />, path: 'overview' },
    { id: 'hotels', label: 'Hotels', icon: <Hotel size={18} />, path: 'hotels' },
    { id: 'restaurants', label: 'Restaurants', icon: <Utensils size={18} />, path: 'restaurants' },
    { id: 'ashrams', label: 'Ashrams', icon: <Building size={18} />, path: 'ashrams' },
    { id: 'ecommerce', label: 'E-Commerce', icon: <Box size={18} />, path: 'ecommerce' },
  ];

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <Loader2 size={32} className="animate-spin text-blue-500" />
          <p>Loading Details...</p>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Details not found.</p>
        <Link to={`/${type}s`} className="text-blue-500 hover:underline mt-4 inline-block">Go Back</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full relative pb-24">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4 mb-6 shrink-0">
        <Link 
          to={`/${type}s`}
          className="p-2 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{overview.name}</h1>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 uppercase tracking-wider">
              {type}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {overview.location?.city}, {overview.location?.state}
          </p>
        </div>
      </div>

      {/* Sub-Route Content */}
      <div className="flex-1">
        <Outlet context={{ overview, type, id, endpointBase }} />
      </div>

      {/* Fixed Bottom Tab Bar relative to the container */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 lg:w-[calc(100%-16rem)] max-w-[100vw] bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.1)] z-40">
        <div className="flex justify-around items-center h-16 px-2 sm:px-4">
          {tabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors relative ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {tab.icon}
                  <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">{tab.label}</span>
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 dark:bg-blue-400 rounded-b-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
