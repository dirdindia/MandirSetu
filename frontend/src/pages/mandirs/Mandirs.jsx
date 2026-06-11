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
        const res = await api.get(`/mandirs?page=${currentPage}&limit=${limit}`);
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
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">
          Sacred <span className="text-orange-500">Temples</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          Explore and discover the most divine and historic temples across the country.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {temples.map((temple) => (
              <div key={temple._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all group flex flex-col">
                <div className="h-56 overflow-hidden bg-slate-100 dark:bg-slate-800 relative shrink-0">
                  <img 
                    src={temple.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(temple.name)}&background=f97316&color=fff`} 
                    alt={temple.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(temple.name)}&background=f97316&color=fff` }}
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    {temple.status === 'active' ? 'Verified' : temple.status}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 truncate" title={temple.name}>{temple.name}</h3>
                  <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-4">
                    <span className="mr-1">📍</span> {temple.location?.city || 'Unknown'}, {temple.location?.state || 'India'}
                  </div>
                  
                  {temple.description && (
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 line-clamp-2">
                      {temple.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-sm truncate mr-2">
                       <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">Main Deity</span>
                       <span className="font-semibold text-slate-700 dark:text-slate-300">{temple.mainDeity || 'N/A'}</span>
                    </div>
                    <Link to={`/mandir/${temple._id}`} className="px-5 py-2.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 hover:bg-orange-500 hover:text-white rounded-xl text-sm font-bold transition-colors shrink-0 shadow-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {temples.length === 0 && (
               <div className="col-span-full text-center py-20 text-slate-500 text-xl">
                 No temples found.
               </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-12">
              <button 
                onClick={handlePrev} 
                disabled={currentPage === 1}
                className="px-6 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
              >
                Previous
              </button>
              <div className="text-slate-600 dark:text-slate-400 font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <button 
                onClick={handleNext} 
                disabled={currentPage === totalPages}
                className="px-6 py-2 rounded-xl bg-orange-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/20"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
