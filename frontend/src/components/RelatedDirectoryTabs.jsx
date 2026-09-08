import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Building, MapPin, Search, Star, Hotel, Store, Coffee, Landmark } from 'lucide-react';

export default function RelatedDirectoryTabs({ mandirId, dhamId }) {
  const [activeTab, setActiveTab] = useState(dhamId ? 'mandirs' : 'hotels'); // 'mandirs', 'hotels', 'ashrams', 'restaurants', 'shops', 'tours'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const baseTabs = [
    { id: 'hotels', label: 'Hotels', icon: <Hotel size={18} /> },
    { id: 'ashrams', label: 'Ashrams', icon: <Building size={18} /> },
    { id: 'restaurants', label: 'Restaurants', icon: <Coffee size={18} /> },
    { id: 'shops', label: 'Prasad & Shops', icon: <Store size={18} /> },
    { id: 'tours', label: 'Yatra & Tours', icon: <MapPin size={18} />, disabled: true }
  ];

  const tabs = dhamId 
    ? [{ id: 'mandirs', label: 'Mandirs', icon: <Landmark size={18} /> }, ...baseTabs]
    : baseTabs;

  useEffect(() => {
    fetchData(activeTab, 1);
  }, [activeTab, mandirId, dhamId]);

  const fetchData = async (tab, pageNum) => {
    if (tabs.find(t => t.id === tab)?.disabled) return;
    setLoading(true);
    try {
      let query = `?page=${pageNum}&limit=${limit}`;
      if (tab === 'shops') {
        if (mandirId) query += `&mandir_id=${mandirId}`;
        if (dhamId) query += `&dham_id=${dhamId}`;
      } else {
        if (mandirId) query += `&mandir=${mandirId}`;
        if (dhamId) query += `&dham=${dhamId}`;
      }

      const endpoint = tab === 'shops' ? '/ecommerce/products' : `/${tab}`;
      const res = await api.get(`${endpoint}${query}`);
      
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
    <div className="w-full">
      {/* Circular Tabs Row */}
      <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-12">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const colors = ['text-orange-600', 'text-yellow-600', 'text-red-600', 'text-blue-600', 'text-green-600', 'text-purple-600'];
          const colorClass = colors[tabs.indexOf(tab) % colors.length];
          
          return (
            <button
              key={tab.id}
              onClick={() => {
                if(!tab.disabled) {
                  setActiveTab(tab.id);
                  setPage(1);
                }
              }}
              disabled={tab.disabled}
              className={`flex flex-col items-center gap-4 group cursor-pointer ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* Ornate Circular Icon Container */}
              <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full p-1 shadow-xl transition-all duration-300 ${!tab.disabled ? 'group-hover:scale-110' : ''} ${isActive ? 'bg-gradient-to-br from-[#791916] to-[#5a1617] scale-105' : 'bg-gradient-to-br from-[#dfba6b] to-[#c09642]'}`}>
                <div className="w-full h-full bg-[#fdfbf7] rounded-full border-2 border-white flex items-center justify-center">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#fcf7ed] flex items-center justify-center ${isActive ? 'text-[#791916]' : colorClass} shadow-inner`}>
                     {React.cloneElement(tab.icon, { size: 32 })}
                  </div>
                </div>
              </div>
              <span className={`font-serif font-bold text-sm sm:text-lg uppercase tracking-wider ${isActive ? 'text-[#791916]' : 'text-[#5a1617]'}`}>
                {tab.label}
                {tab.disabled && <span className="block text-[10px] text-[#791916]/50 uppercase tracking-widest mt-1">Soon</span>}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end mb-4">
        {data.length > 0 && activeTab !== 'mandirs' && (
          <Link 
            to={`/services?type=${activeTab}${mandirId ? `&mandir=${mandirId}` : ''}${dhamId ? `&dham=${dhamId}` : ''}`} 
            className="text-[#d4af37] hover:text-[#791916] font-bold text-sm flex items-center gap-1 uppercase tracking-wider transition-colors"
          >
            View all {tabs.find(t => t.id === activeTab)?.label || activeTab} <span aria-hidden="true">&rarr;</span>
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#d4af37]"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-[#791916]/70 bg-white rounded-3xl border border-dashed border-[#d4af37]/30">
            <MapPin size={32} className="mb-2 opacity-50" />
            <p className="font-serif italic text-lg">No {activeTab} found for this location yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.map((item) => (
              <Link to={`/${activeTab === 'mandirs' ? 'mandir' : activeTab}/${item._id}`} key={item._id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-[#d4af37]/20 flex flex-col sm:flex-row gap-6 hover:shadow-xl hover:shadow-[#791916]/5 transition-all group">
                <div className="w-full sm:w-40 h-40 flex-shrink-0 relative overflow-hidden rounded-2xl bg-[#fdfbf7]">
                  {item.profilePic || item.displayImage ? (
                    <img src={item.profilePic || item.displayImage} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#d4af37]/50">
                      {activeTab === 'mandirs' ? <Landmark size={40} /> : <Building size={40} />}
                    </div>
                  )}
                  {item.starRating && (
                    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur text-[#791916] text-xs font-bold px-2 py-1 rounded-full shadow flex items-center gap-1">
                      {item.starRating} <Star size={10} fill="currentColor" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col flex-grow justify-center py-2">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#791916] line-clamp-1">{item.name}</h3>
                    {item.location && (
                      <p className="text-sm text-[#3a0d0a]/60 flex items-center gap-1 mt-1">
                        <MapPin size={14} /> {item.location?.city}, {item.location?.state}
                      </p>
                    )}
                    
                    {activeTab === 'hotels' && item.startingPrice && (
                      <p className="mt-3 text-sm font-semibold text-[#d4af37]">Starts at ₹{item.startingPrice}</p>
                    )}
                    {activeTab === 'restaurants' && item.averageCostForTwo && (
                      <p className="mt-3 text-sm font-semibold text-[#d4af37]">Avg Cost: ₹{item.averageCostForTwo} for two</p>
                    )}
                    {activeTab === 'shops' && item.sellingPrice && (
                      <p className="mt-3 text-sm font-semibold text-[#d4af37]">Price: ₹{item.sellingPrice}</p>
                    )}
                  </div>
                  
                  {item.contact?.phone && activeTab !== 'shops' && (
                    <div className="mt-4 flex items-center gap-2">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href=`tel:${item.contact.phone}`; }} className="text-xs uppercase tracking-wider bg-[#d4af37]/10 text-[#791916] px-4 py-2 rounded-full font-bold hover:bg-[#d4af37] hover:text-[#3a0d0a] transition-colors border border-[#d4af37]/20">
                        Call Now
                      </button>
                    </div>
                  )}
                  {activeTab === 'shops' && (
                    <div className="mt-4">
                      <button className="text-xs uppercase tracking-wider bg-[#791916] text-white px-6 py-2 rounded-full font-bold hover:bg-[#3a0d0a] transition-colors shadow-md">
                        Buy Now
                      </button>
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
        <div className="flex justify-center items-center mt-12 gap-4">
          <button 
            onClick={handlePrev} 
            disabled={page === 1}
            className="px-6 py-2.5 rounded-full bg-white border border-[#d4af37]/30 text-[#791916] font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d4af37]/10 transition-colors shadow-sm"
          >
            &larr; Prev
          </button>
          <span className="text-[#3a0d0a] font-serif font-medium">
            {page} / {totalPages}
          </span>
          <button 
            onClick={handleNext} 
            disabled={page === totalPages}
            className="px-6 py-2.5 rounded-full bg-white border border-[#d4af37]/30 text-[#791916] font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d4af37]/10 transition-colors shadow-sm"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
