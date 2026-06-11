import React, { useState, useEffect } from 'react';
import { MapPin, Phone, User, ChevronLeft, ChevronRight, Eye, Briefcase, Mail, Calendar, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Swal from 'sweetalert2';

export default function StaffList() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  const fetchStaff = async (currentPage) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/staff?page=${currentPage}&limit=10`);
      if (response.data && response.data.data) {
        setStaff(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);
      } else {
        setStaff(Array.isArray(response.data) ? response.data : []);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load Staff list',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff(page);
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const showDetails = (person) => {
    const htmlContent = `
      <div class="text-left space-y-4">
        <div class="flex items-center gap-4 mb-6">
          ${person.media?.profilePic ? 
            `<img src="${person.media.profilePic}" alt="Profile" class="w-20 h-20 rounded-full object-cover shadow-sm border-2 border-blue-100"/>` : 
            `<div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><User size={32}/></div>`
          }
          <div>
            <h4 class="text-xl font-bold text-slate-800">${person.name}</h4>
            <p class="text-blue-600 font-semibold text-sm flex items-center gap-1 mt-1"><Briefcase size={14}/> ${person.employment?.role}</p>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-slate-500 uppercase font-bold tracking-wider">Phone</p>
            <p class="text-slate-800 text-sm flex items-center gap-1 mt-1"><Phone size={14}/> ${person.contact?.phone}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 uppercase font-bold tracking-wider">Email</p>
            <p class="text-slate-800 text-sm flex items-center gap-1 mt-1"><Mail size={14}/> ${person.contact?.email || 'N/A'}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 uppercase font-bold tracking-wider">Gender</p>
            <p class="text-slate-800 text-sm flex items-center gap-1 mt-1">${person.gender || 'N/A'}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 uppercase font-bold tracking-wider">Date of Birth</p>
            <p class="text-slate-800 text-sm flex items-center gap-1 mt-1"><Calendar size={14}/> ${person.dob ? new Date(person.dob).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>

        <div>
          <p class="text-xs text-slate-500 uppercase font-bold tracking-wider">Address</p>
          <p class="text-slate-800 text-sm flex items-start gap-2 mt-1">
            <span class="mt-0.5"><MapPin size={16} class="text-blue-500"/></span>
            <span>${person.address}, ${person.city}, ${person.state} - ${person.pincode}</span>
          </p>
        </div>

        <div class="pt-4 border-t border-slate-100 mt-4">
          <p class="text-xs text-slate-500 uppercase font-bold tracking-wider">Assigned Mandir</p>
          <p class="text-slate-800 font-medium text-sm mt-1">
            ${person.employment?.assignedMandir ? `${person.employment.assignedMandir.name} (${person.employment.assignedMandir.city})` : 'Unassigned'}
          </p>
        </div>

        ${person.media?.documentUrl ? `
        <div class="pt-4 border-t border-slate-100 mt-4">
          <p class="text-xs text-slate-500 uppercase font-bold tracking-wider">Document (${person.media.documentType})</p>
          <a href="${person.media.documentUrl}" target="_blank" class="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-2 mt-2 bg-blue-50 py-2 px-4 rounded-lg inline-flex transition-colors">
            View Uploaded Document <Eye size={16}/>
          </a>
        </div>` : ''}
      </div>
    `;

    Swal.fire({
      html: htmlContent,
      showCloseButton: true,
      showConfirmButton: false,
      width: '500px',
      customClass: {
        popup: 'rounded-2xl',
      }
    });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this! The staff member and their login access will be deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/staff/${id}`);
        Swal.fire('Deleted!', 'Staff member has been deleted.', 'success');
        fetchStaff(page);
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete staff member.', 'error');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Staff Directory</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage and view all registered staff and temple sevadars.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Assigned Mandir</th>
                <th className="p-4">Phone</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">Loading staff...</td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">No staff found.</td>
                </tr>
              ) : (
                staff.map((person) => (
                  <tr key={person._id} className="hover:bg-blue-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => showDetails(person)}>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-3">
                      {person.media?.profilePic ? (
                        <img src={person.media.profilePic} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                          <User size={16} />
                        </div>
                      )}
                      {person.name}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-md text-xs font-semibold">
                        {person.employment?.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {person.employment?.assignedMandir?.name || <span className="text-slate-400 italic">Unassigned</span>}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{person.contact?.phone}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); showDetails(person); }}
                          className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-flex justify-center items-center"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/edit-staff/${person._id}`); }}
                          className="p-2 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-flex justify-center items-center"
                          title="Edit Staff"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(person._id); }}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-flex justify-center items-center"
                          title="Delete Staff"
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
