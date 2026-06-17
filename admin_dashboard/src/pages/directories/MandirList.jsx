import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, User, ExternalLink, ChevronLeft, ChevronRight, Eye, Edit, Trash2 } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import Swal from 'sweetalert2';

export default function MandirList() {
  const [mandirs, setMandirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  const fetchMandirs = async (currentPage) => {
    try {
      setLoading(true);
      // ?page=X&limit=10
      const response = await axiosInstance.get(`/mandirs?page=${currentPage}&limit=10`);
      // Since backend was updated to return { data, totalItems, totalPages, currentPage }
      if (response.data && response.data.data) {
        setMandirs(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);
      } else {
        // Fallback if backend hasn't restarted or returned raw array
        setMandirs(Array.isArray(response.data) ? response.data : []);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Failed to fetch mandirs:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load Mandir list',
        confirmButtonColor: '#f97316'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMandirs(page);
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
          await axiosInstance.delete(`/mandirs/${id}`);
          Swal.fire('Deleted!', 'Mandir has been deleted.', 'success');
          fetchMandirs(page);
        } catch (error) {
          Swal.fire('Error!', 'Failed to delete mandir.', 'error');
        }
      }
    });
  };



  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Mandir Directory</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage and view all registered temples on the platform.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                <th className="p-4">Mandir Name</th>
                <th className="p-4">City / State</th>
                <th className="p-4">Main Deity</th>
                <th className="p-4">Phone</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">Loading mandirs...</td>
                </tr>
              ) : mandirs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">No mandirs found.</td>
                </tr>
              ) : (
                mandirs.map((mandir) => (
                  <tr key={mandir._id} className="hover:bg-orange-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => navigate(`/mandirs/${mandir._id}/details`)}>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{mandir.name}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {mandir.location?.city}, {mandir.location?.state}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{mandir.mainDeity}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{mandir.contact?.phone}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/mandirs/${mandir._id}/details`); }}
                          className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="View Full Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/edit-mandir/${mandir._id}`); }}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Mandir"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(mandir._id); }}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete Mandir"
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
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Showing page <span className="font-bold">{page}</span> of <span className="font-bold">{totalPages}</span> ({totalItems} total items)
            </span>
            <div className="flex gap-2">
              <button 
                onClick={handlePrevPage}
                disabled={page === 1}
                className="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} /> Prev
              </button>
              <button 
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
