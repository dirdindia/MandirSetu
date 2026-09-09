import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

export default function Mandirs() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  useEffect(() => {
    const fetchTemples = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/mandirs?page=${currentPage}&limit=${limit}&independent=true`);
        setTemples(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error('Failed to fetch temples', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemples();
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-premium font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-maroon mb-4 drop-shadow-sm">
            Sacred <span className="text-gold">Temples</span>
          </h1>
          <p className="text-maroon-darker/70 text-lg max-w-2xl mx-auto font-medium">
            Explore and discover the most divine and historic temples across the country.
          </p>
          <div className="w-24 h-1 bg-gold/30 mx-auto mt-6"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {temples.map((temple) => (
                <div key={temple._id} className="bg-white border border-gold/20 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-maroon/10 transition-all duration-500 group flex flex-col">
                  <div className="h-56 overflow-hidden bg-premium relative shrink-0 border-b border-gold/10">
                    <img 
                      src={temple.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(temple.name)}&background=791916&color=fff`} 
                      alt={temple.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(temple.name)}&background=791916&color=fff` }}
                    />
                    <div className="absolute top-3 right-3 bg-premium/90 backdrop-blur-sm text-maroon text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-gold/30 uppercase tracking-wider">
                      {temple.status === 'active' ? 'Verified' : temple.status}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-2xl font-serif font-bold text-maroon mb-2 truncate group-hover:text-maroon-darker transition-colors" title={temple.name}>{temple.name}</h3>
                    <div className="flex items-center text-maroon-darker/70 font-medium text-sm mb-4">
                      <span className="mr-1.5 text-gold">📍</span> {temple.location?.city || 'Unknown'}, {temple.location?.state || 'India'}
                    </div>
                    
                    {temple.description && (
                      <p className="text-maroon-darker/60 text-sm mb-6 line-clamp-2 leading-relaxed">
                        {temple.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-5 border-t border-gold/20">
                      <div className="text-sm truncate mr-2">
                         <span className="text-gold font-bold block text-[10px] uppercase tracking-widest mb-1">Main Deity</span>
                         <span className="font-semibold text-maroon">{temple.mainDeity || 'N/A'}</span>
                      </div>
                      <Link to={`/mandir/${temple._id}`} className="px-5 py-2.5 bg-gradient-to-r from-maroon to-maroon-dark text-premium hover:shadow-lg hover:shadow-maroon/30 rounded-xl text-sm font-bold transition-all shrink-0">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
              {temples.length === 0 && (
                 <div className="col-span-full text-center py-20 text-maroon font-serif text-xl border border-gold/20 rounded-3xl bg-white shadow-sm">
                   No temples found.
                 </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-16">
                <button 
                  onClick={handlePrev} 
                  disabled={currentPage === 1}
                  className="px-6 py-2.5 rounded-xl bg-white border border-gold/30 text-maroon font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold/10 transition-all shadow-sm"
                >
                  Previous
                </button>
                <div className="text-maroon-darker/70 font-serif font-semibold bg-white px-5 py-2 rounded-xl border border-gold/20 shadow-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <button 
                  onClick={handleNext} 
                  disabled={currentPage === totalPages}
                  className="px-6 py-2.5 rounded-xl bg-white border border-gold/30 text-maroon font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold/10 transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
