import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Building, MapPin, Search, Star, Hotel, Store, Coffee } from 'lucide-react';

export default function RelatedDirectoryTabs({ mandirId, dhamId }) {
  const [activeTab, setActiveTab] = useState('hotels'); // 'hotels', 'ashrams', 'restaurants', 'shops', 'tours'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const tabs = [
    { id: 'hotels', label: 'Hotels', icon: <Hotel size={18} /> },
    { id: 'ashrams', label: 'Ashrams', icon: <Building size={18} /> },
    { id: 'restaurants', label: 'Restaurants', icon: <Coffee size={18} /> },
    { id: 'shops', label: 'Shops (E-commerce)', icon: <Store size={18} />, disabled: true },
    { id: 'tours', label: 'Tours & Travels', icon: <MapPin size={18} />, disabled: true }
  ];

  useEffect(() => {
    fetchData(activeTab, 1);
  }, [activeTab, mandirId, dhamId]);

  const fetchData = async (tab, pageNum) => {
    if (tabs.find(t => t.id === tab)?.disabled) return;
    setLoading(true);
    try {
      let query = `?page=${pageNum}&limit=${limit}`;
      if (mandirId) query += `&mandir=${mandirId}`;
      if (dhamId) query += `&dham=${dhamId}`;

      const res = await api.get(`/${tab}${query}`);
      
      if (res.data && res.data.data) {
        setData(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setData(Array.isArray(res.data) ? res.data : []);
        setTotalPages(1);
      }
      setPage(pageNum);
    } catch (error) {
      console.error(`Failed to fetch ${tab}`, error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (page < totalPages) fetchData(activeTab, page + 1);
  };

  const handlePrev = () => {
    if (page > 1) fetchData(activeTab, page - 1);
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Explore Nearby Services</h2>
      
      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 mb-6 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if(!tab.disabled) {
                setActiveTab(tab.id);
                setPage(1);
              }
            }}
            disabled={tab.disabled}
            className={`flex items-center space-x-2 px-5 py-3 rounded-t-xl font-bold transition-all whitespace-nowrap
              ${activeTab === tab.id 
                ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 border-b-2 border-orange-500' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.disabled && <span className="ml-2 text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Soon</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <MapPin size={32} className="mb-2 opacity-50" />
            <p className="font-medium">No {activeTab} found for this location yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {data.map((item) => (
              <Link to={`/${activeTab}/${item._id}`} key={item._id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow group">
                <div className="w-full sm:w-32 h-32 flex-shrink-0 relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                  {item.profilePic ? (
                    <img src={item.profilePic} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Building size={32} />
                    </div>
                  )}
                  {item.starRating && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow flex items-center gap-1">
                      {item.starRating} <Star size={10} fill="currentColor" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin size={14} /> {item.location?.city}, {item.location?.state}
                    </p>
                    
                    {activeTab === 'hotels' && item.startingPrice && (
                      <p className="mt-2 text-sm font-semibold text-orange-600 dark:text-orange-400">Starts at ₹{item.startingPrice}</p>
                    )}
                    {activeTab === 'restaurants' && item.averageCostForTwo && (
                      <p className="mt-2 text-sm font-semibold text-orange-600 dark:text-orange-400">Avg Cost: ₹{item.averageCostForTwo} for two</p>
                    )}
                  </div>
                  
                  {item.contact?.phone && (
                    <div className="mt-4 flex items-center gap-2">
                      <a href={`tel:${item.contact.phone}`} className="text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                        Call {item.contact.phone}
                      </a>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 gap-4">
          <button 
            onClick={handlePrev} 
            disabled={page === 1}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Previous
          </button>
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            Page {page} of {totalPages}
          </span>
          <button 
            onClick={handleNext} 
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
