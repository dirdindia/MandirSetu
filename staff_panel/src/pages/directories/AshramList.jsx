import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { Home, MapPin, Search, Phone, ExternalLink, Eye, Users, Trash2, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function AshramList() {
  const [ashrams, setAshrams] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchAshrams = async () => {
    try {
      const profileRes = await api.get('/staff/me');
      const profile = profileRes.data?.data;
      let query = '';
      if (profile?.employment?.assignedMandir) {
        query = `?mandir=${profile.employment.assignedMandir._id || profile.employment.assignedMandir}`;
      } else if (profile?.employment?.assignedDham) {
        query = `?dham=${profile.employment.assignedDham._id || profile.employment.assignedDham}`;
      }

      const res = await api.get(`/ashrams${query}`);
      if (res.data && res.data.data) {
        setAshrams(res.data.data);
      } else {
        setAshrams(Array.isArray(res.data) ? res.data : []);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAshrams();
  }, []);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ea580c',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`/ashrams/${id}`).then(() => {
          Swal.fire('Deleted!', 'Ashram has been deleted.', 'success');
          fetchAshrams();
        }).catch(err => {
          Swal.fire('Error!', 'Failed to delete ashram.', 'error');
        });
      }
    });
  };

  const handleEdit = (ashram, e) => {
    e.stopPropagation();
    navigate('/onboarding/ashram', { state: { editData: ashram } });
  };

  const showDetails = (ashram) => {
    const htmlContent = `
      <div class="text-left">
        <!-- Cover Image & Header Header -->
        <div class="relative -mt-6 -mx-6 mb-6">
          ${ashram.profilePic 
            ? `<img src="${ashram.profilePic}" alt="Ashram" class="w-full h-56 object-cover rounded-t-2xl"/>` 
            : `<div class="w-full h-56 bg-gradient-to-br from-orange-400 to-red-600 rounded-t-2xl flex items-center justify-center"><span class="text-white opacity-50"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></span></div>`
          }
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-t-2xl"></div>
          <div class="absolute bottom-0 left-0 w-full p-6">
            <div class="flex justify-between items-end">
              <div>
                <h3 class="text-3xl font-bold text-white mb-1 drop-shadow-md">${ashram.name}</h3>
                <p class="text-orange-100 font-medium text-sm drop-shadow flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  ${ashram.location?.city}, ${ashram.location?.state}
                </p>
              </div>
              ${ashram.associatedMandir ? `
                <div class="flex items-center gap-1 bg-white/20 text-white px-3 py-1.5 rounded-xl font-bold shadow-lg backdrop-blur-md border border-white/30 text-xs">
                  ${ashram.associatedMandir}
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="space-y-6 px-2">
          <!-- Founder & Capacity row -->
          <div class="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div>
              <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Founder / Guru</p>
              <p class="text-slate-800 dark:text-slate-200 font-bold text-sm">${ashram.founder || 'N/A'}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Capacity</p>
              <p class="text-slate-800 dark:text-slate-200 font-bold text-sm">${ashram.capacity ? ashram.capacity + ' pax' : 'N/A'}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Manager</p>
              <p class="text-slate-800 dark:text-slate-200 font-semibold text-sm">${ashram.contact?.managerName || 'N/A'}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Phone</p>
              <p class="text-slate-800 dark:text-slate-200 font-semibold text-sm">${ashram.contact?.phone || 'N/A'}</p>
            </div>
          </div>

          ${ashram.description ? `
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-2">About Ashram</p>
            <p class="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">${ashram.description}</p>
          </div>` : ''}

          <div class="bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-2xl border border-orange-100 dark:border-orange-800/50">
            <p class="text-xs text-orange-600 dark:text-orange-400 uppercase font-bold tracking-wider mb-2 flex items-center gap-2">
              Donations Accepted
            </p>
            <p class="text-slate-800 dark:text-slate-200 font-semibold text-sm">
              ${ashram.donationAccepted ? '<span class="text-green-600 dark:text-green-400 flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Yes, accepting donations</span>' : '<span class="text-slate-500">Not currently accepting</span>'}
            </p>
          </div>

          ${ashram.facilities && ashram.facilities.length > 0 ? `
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-2">Facilities Available</p>
            <div class="flex flex-wrap gap-2">
              ${ashram.facilities.map(f => `<span class="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-3 py-1.5 rounded-lg font-semibold text-xs border border-orange-100 dark:border-orange-800 shadow-sm">${f}</span>`).join('')}
            </div>
          </div>` : ''}

          ${ashram.rules ? `
          <div class="bg-red-50/50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-800/50">
            <p class="text-xs text-red-600 dark:text-red-400 uppercase font-bold tracking-wider mb-2 flex items-center gap-2">
              Rules & Guidelines
            </p>
            <p class="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">${ashram.rules}</p>
          </div>` : ''}

          ${ashram.geolocation && ashram.geolocation.latitude ? `
          <div class="mt-2 pt-2">
            <a href="https://www.google.com/maps/search/?api=1&query=${ashram.geolocation.latitude},${ashram.geolocation.longitude}" target="_blank" class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-4 rounded-xl font-bold shadow-md shadow-orange-500/20 transition-all hover:-translate-y-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              View on Google Maps
            </a>
          </div>` : ''}
        </div>
      </div>
    `;

    Swal.fire({
      html: htmlContent,
      showCloseButton: true,
      showConfirmButton: false,
      width: '550px',
      padding: '0',
      customClass: {
        popup: 'rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 dark:bg-slate-900',
        htmlContainer: 'p-0 m-0',
        closeButton: 'bg-black/20 hover:bg-black/40 text-white rounded-full m-3 backdrop-blur-sm transition-colors',
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Ashrams Directory</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage and view all registered ashrams.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search ashrams..." className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl w-full focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all shadow-sm" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                <th className="p-4">Ashram Name</th>
                <th className="p-4">City / State</th>
                <th className="p-4">Founder</th>
                <th className="p-4">Phone</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">Loading ashrams...</td>
                </tr>
              ) : ashrams.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">No data available</td>
                </tr>
              ) : (
                ashrams.map((ashram) => (
                  <tr key={ashram._id} className="hover:bg-orange-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => showDetails(ashram)}>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-3">
                      {ashram.profilePic ? (
                        <img src={ashram.profilePic} alt="" className="w-10 h-10 rounded-xl object-cover shadow-sm border border-slate-200 dark:border-slate-700" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 border border-orange-200 dark:border-orange-800">
                          <Home size={18} />
                        </div>
                      )}
                      <div>
                        <p className="font-bold">{ashram.name}</p>
                        {ashram.associatedMandir && <p className="text-xs text-orange-600 dark:text-orange-400">{ashram.associatedMandir}</p>}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {ashram.location?.city}, {ashram.location?.state}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{ashram.founder || 'N/A'}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{ashram.contact?.phone || 'N/A'}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); showDetails(ashram); }}
                          className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-flex justify-center items-center"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={(e) => handleEdit(ashram, e)}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-flex justify-center items-center"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(ashram._id, e)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-flex justify-center items-center"
                          title="Delete"
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
      </div>
    </div>
  );
}
