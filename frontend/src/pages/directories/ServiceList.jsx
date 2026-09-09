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
    { id: 'shops', label: 'Shops', icon: <Store size={18} /> },
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
    <div className="min-h-screen bg-premium pt-24 pb-12 font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gold/30 pb-6">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-maroon">
            Explore Services
          </h1>
          <div className="flex gap-4 mt-4 md:mt-0">
            {mandirId && (
              <Link to={`/mandir/${mandirId}`} className="text-sm font-semibold text-gold hover:text-maroon transition-colors">&larr; Back to Mandir</Link>
            )}
            {dhamId && (
              <Link to={`/dham/${dhamId}`} className="text-sm font-semibold text-gold hover:text-maroon transition-colors">&larr; Back to Dham</Link>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar Categories */}
          <div className="w-full lg:w-1/4 flex-shrink-0">
            <div className="sticky top-28 bg-white p-6 rounded-3xl shadow-xl shadow-maroon/5 border border-gold/20">
              <h3 className="text-2xl font-serif font-bold text-maroon mb-4 pb-4 border-b border-gold/20">Services</h3>
              <div className="flex flex-col space-y-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if(!tab.disabled) handleTabChange(tab.id);
                    }}
                    disabled={tab.disabled}
                    className={`group relative flex items-center justify-between px-5 py-4 rounded-2xl font-bold transition-all duration-300 w-full text-left cursor-pointer
                      ${type === tab.id 
                        ? 'bg-gradient-to-br from-maroon to-[#4a0f0d] text-premium shadow-lg shadow-maroon/20 ring-1 ring-maroon/50 transform scale-[1.02]' 
                        : 'bg-premium text-maroon-darker/70 hover:text-maroon hover:bg-white hover:shadow-md hover:shadow-gold/10 border border-gold/20'
                      }
                      ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2.5 rounded-xl transition-colors duration-300 ${type === tab.id ? 'bg-white/20 text-gold' : 'bg-maroon/5 text-maroon group-hover:bg-maroon/10'}`}>
                        {tab.icon}
                      </div>
                      <span className="font-serif text-lg">{tab.label}</span>
                    </div>
                    {tab.disabled && (
                      <span className="text-[10px] bg-gold/20 text-maroon px-2.5 py-1 rounded-full uppercase tracking-wider font-sans">
                        Soon
                      </span>
                    )}
                    
                    {/* Active Indicator Dot */}
                    {type === tab.id && (
                      <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-gold rounded-full border-2 border-white shadow-sm"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="w-full lg:w-3/4 flex-grow">
            {loading ? (
              <div className="flex justify-center items-center h-64 bg-white rounded-3xl border border-gold/20 shadow-sm">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
              </div>
            ) : data.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-maroon/70 bg-white border border-gold/20 rounded-3xl shadow-sm">
                <MapPin size={48} className="mb-4 opacity-50 text-gold" />
                <p className="text-xl font-serif font-medium">No results found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.map((item) => (
                  <Link to={`/${type}/${item._id}`} key={item._id} className="bg-white rounded-2xl p-5 shadow-lg shadow-maroon/5 border border-gold/20 flex flex-col gap-4 hover:shadow-xl hover:shadow-gold/20 transition-all group relative overflow-hidden">
                    <div className="w-full h-48 flex-shrink-0 relative overflow-hidden rounded-xl bg-premium border border-gold/10">
                      {item.profilePic || item.displayImage ? (
                        <img src={item.profilePic || item.displayImage} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gold/40">
                          <Building size={48} />
                        </div>
                      )}
                      {item.starRating && (
                        <div className="absolute top-3 left-3 bg-premium/90 backdrop-blur-sm text-maroon text-xs font-bold px-2 py-1.5 rounded-lg shadow-sm border border-gold/30 flex items-center gap-1">
                          {item.starRating} <Star size={12} className="text-gold fill-gold" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col flex-grow justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-xl text-maroon line-clamp-1">{item.name}</h3>
                        {item.location && (
                          <p className="text-sm text-maroon-darker/70 flex items-center gap-1.5 mt-2 font-medium">
                            <MapPin size={14} className="text-gold" /> {item.location?.city}, {item.location?.state}
                          </p>
                        )}
                        
                        {type === 'hotels' && item.startingPrice && (
                          <p className="mt-3 text-sm font-bold text-gold bg-maroon/5 inline-block px-3 py-1 rounded-full">Starts at ₹{item.startingPrice}</p>
                        )}
                        {type === 'restaurants' && item.averageCostForTwo && (
                          <p className="mt-3 text-sm font-bold text-gold bg-maroon/5 inline-block px-3 py-1 rounded-full">Avg Cost: ₹{item.averageCostForTwo} for two</p>
                        )}
                        {type === 'shops' && item.sellingPrice && (
                          <p className="mt-3 text-sm font-bold text-gold bg-maroon/5 inline-block px-3 py-1 rounded-full">Price: ₹{item.sellingPrice}</p>
                        )}
                      </div>
                      {type === 'shops' && (
                        <div className="mt-5">
                          <button className="w-full text-sm bg-gradient-to-r from-maroon to-maroon-dark text-premium px-4 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-maroon/30 transition-all duration-300">
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
                  className="px-5 py-2.5 rounded-xl bg-white border border-gold/30 text-maroon font-bold disabled:opacity-50 hover:bg-gold/10 transition-all disabled:cursor-not-allowed shadow-sm hover:shadow"
                >
                  Previous
                </button>
                <span className="text-maroon-darker/70 font-serif font-semibold bg-white px-4 py-2 rounded-xl border border-gold/20 shadow-sm">
                  Page {page} of {totalPages}
                </span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                  disabled={page === totalPages}
                  className="px-5 py-2.5 rounded-xl bg-white border border-gold/30 text-maroon font-bold disabled:opacity-50 hover:bg-gold/10 transition-all disabled:cursor-not-allowed shadow-sm hover:shadow"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
