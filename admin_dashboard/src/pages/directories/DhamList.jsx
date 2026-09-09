import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, User, ExternalLink, ChevronLeft, ChevronRight, Eye, Edit, Trash2 } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import Swal from 'sweetalert2';

export default function DhamList() {
  const [Dhams, setDhams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  const fetchDhams = async (currentPage) => {
    try {
      setLoading(true);
      // ?page=X&limit=10
      const response = await axiosInstance.get(`/dhams?page=${currentPage}&limit=10`);
      // Since backend was updated to return { data, totalItems, totalPages, currentPage }
      if (response.data && response.data.data) {
        setDhams(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);
      } else {
        // Fallback if backend hasn't restarted or returned raw array
        setDhams(Array.isArray(response.data) ? response.data : []);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Failed to fetch Dhams:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load Dham list',
        confirmButtonColor: '#f97316'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDhams(page);
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/dhams/${id}`);
          Swal.fire('Deleted!', 'Dham has been deleted.', 'success');
          fetchDhams(page);
        } catch (error) {
          Swal.fire('Error!', 'Failed to delete dham.', 'error');
        }
      }
    });
  };



  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-maroon">Dham Directory</h1>
          <p className="text-maroon-darker/70 mt-1">Manage and view all registered temples on the platform.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gold/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-premium /50 border-b border-gold/20 text-gold text-xs uppercase tracking-wider font-bold">
                <th className="p-4">Dham Name</th>
                <th className="p-4">City / State</th>
                <th className="p-4">Main Deity</th>
                <th className="p-4">Phone</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gold">Loading Dhams...</td>
                </tr>
              ) : Dhams.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gold">No Dhams found.</td>
                </tr>
              ) : (
                Dhams.map((dham) => (
                  <tr key={dham._id} className="hover:bg-gold/5 transition-colors cursor-pointer" onClick={() => navigate(`/dhams/${dham._id}/details`)}>
                    <td className="p-4 font-medium text-maroon-darker">{dham.name}</td>
                    <td className="p-4 text-maroon-darker/70">
                      {dham.location?.city}, {dham.location?.state}
                    </td>
                    <td className="p-4 text-maroon-darker/70">{dham.mainDeity}</td>
                    <td className="p-4 text-maroon-darker/70">{dham.contact?.phone}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/dhams/${dham._id}/details`); }}
                          className="p-2 text-maroon-darker/60 hover:text-indigo-600 hover:bg-indigo-100 hover:bg-gold/10 rounded-lg transition-colors"
                          title="View Full Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/edit-dham/${dham._id}`); }}
                          className="p-2 text-maroon-darker/60 hover:text-blue-600 hover:bg-blue-100 hover:bg-gold/10 rounded-lg transition-colors"
                          title="Edit Dham"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(dham._id); }}
                          className="p-2 text-maroon-darker/60 hover:text-red-600 hover:bg-red-100 hover:bg-gold/10 rounded-lg transition-colors"
                          title="Delete Dham"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="p-4 border-t border-gold/20 flex items-center justify-between bg-premium">
            <span className="text-sm text-maroon-darker/70">
              Showing page <span className="font-bold">{page}</span> of <span className="font-bold">{totalPages}</span> ({totalItems} total items)
            </span>
            <div className="flex gap-2">
              <button 
                onClick={handlePrevPage}
                disabled={page === 1}
                className="px-3 py-1 border border-gold/30 rounded-lg flex items-center justify-center text-maroon-darker/60 hover:bg-slate-100 hover:bg-gold/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} /> Prev
              </button>
              <button 
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="px-3 py-1 border border-gold/30 rounded-lg flex items-center justify-center text-maroon-darker/60 hover:bg-slate-100 hover:bg-gold/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
