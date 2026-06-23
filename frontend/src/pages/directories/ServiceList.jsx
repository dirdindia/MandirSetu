import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Building, MapPin, Search, Star, Hotel, Store, Coffee } from 'lucide-react';
import api from '../../api';

export default function ServiceList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get('type') || 'hotels';
  const mandirId = searchParams.get('mandir');
  const dhamId = searchParams.get('dham');

  const tabs = [
    { id: 'hotels', label: 'Hotels', icon: <Hotel size={18} /> },
    { id: 'ashrams', label: 'Ashrams', icon: <Building size={18} /> },
    { id: 'restaurants', label: 'Restaurants', icon: <Coffee size={18} /> },
    { id: 'shops', label: 'Shops (E-commerce)', icon: <Store size={18} /> },
    { id: 'tours', label: 'Tours & Travels', icon: <MapPin size={18} />, disabled: true }
  ];

  const handleTabChange = (newType) => {
    const params = new URLSearchParams(searchParams);
    params.set('type', newType);
    setSearchParams(params);
    setPage(1);
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchData(page);
  }, [type, mandirId, dhamId, page]);

  const fetchData = async (pageNum) => {
    setLoading(true);
    try {
      let query = `?page=${pageNum}&limit=${limit}`;
      if (type === 'shops') {
        if (mandirId) query += `&mandir_id=${mandirId}`;
        if (dhamId) query += `&dham_id=${dhamId}`;
      } else {
        if (mandirId) query += `&mandir=${mandirId}`;
        if (dhamId) query += `&dham=${dhamId}`;
      }

      const endpoint = type === 'shops' ? '/ecommerce/products' : `/${type}`;
      const res = await api.get(`${endpoint}${query}`);
      
      if (res.data && res.data.data) {
        setData(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setData(Array.isArray(res.data) ? res.data : []);
        setTotalPages(1);
      }
    } catch (error) {
      console.error(`Failed to fetch ${type}`, error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

  return (
    <div className="container mx-auto px-4 py-8 mt-20 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Explore Services
        </h1>
        {mandirId && (
          <Link to={`/mandir/${mandirId}`} className="text-sm font-semibold text-orange-600 hover:text-orange-700">&larr; Back to Mandir</Link>
        )}
        {dhamId && (
          <Link to={`/dham/${dhamId}`} className="text-sm font-semibold text-orange-600 hover:text-orange-700">&larr; Back to Dham</Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 mb-8 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if(!tab.disabled) handleTabChange(tab.id);
            }}
            disabled={tab.disabled}
            className={`flex items-center space-x-2 px-5 py-3 rounded-t-xl font-bold transition-all whitespace-nowrap cursor-pointer
              ${type === tab.id 
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-2xl">
          <MapPin size={48} className="mb-4 opacity-50" />
          <p className="text-xl font-medium">No results found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((item) => (
            <Link to={`/${type}/${item._id}`} key={item._id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-4 hover:shadow-md transition-shadow group">
              <div className="w-full h-48 flex-shrink-0 relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                {item.profilePic || item.displayImage ? (
                  <img src={item.profilePic || item.displayImage} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Building size={48} />
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
                  {item.location && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin size={14} /> {item.location?.city}, {item.location?.state}
                    </p>
                  )}
                  
                  {type === 'hotels' && item.startingPrice && (
                    <p className="mt-2 text-sm font-semibold text-orange-600 dark:text-orange-400">Starts at ₹{item.startingPrice}</p>
                  )}
                  {type === 'restaurants' && item.averageCostForTwo && (
                    <p className="mt-2 text-sm font-semibold text-orange-600 dark:text-orange-400">Avg Cost: ₹{item.averageCostForTwo} for two</p>
                  )}
                  {type === 'shops' && item.sellingPrice && (
                    <p className="mt-2 text-sm font-semibold text-orange-600 dark:text-orange-400">Price: ₹{item.sellingPrice}</p>
                  )}
                </div>
                {type === 'shops' && (
                  <div className="mt-4">
                    <button className="w-full text-sm bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/20">
                      Buy Now
                    </button>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-12 gap-4">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:cursor-not-allowed cursor-pointer"
          >
            Previous
          </button>
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            Page {page} of {totalPages}
          </span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
