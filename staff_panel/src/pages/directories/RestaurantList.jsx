import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { Coffee, MapPin, Search, Phone, ExternalLink, Eye, Trash2, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchRestaurants = () => {
    api.get('/restaurants').then(res => {
      if (res.data && res.data.data) {
        setRestaurants(res.data.data);
      } else {
        setRestaurants(Array.isArray(res.data) ? res.data : []);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`/restaurants/${id}`).then(() => {
          Swal.fire('Deleted!', 'Restaurant has been deleted.', 'success');
          fetchRestaurants();
        }).catch(err => {
          Swal.fire('Error!', 'Failed to delete restaurant.', 'error');
        });
      }
    });
  };

  const handleEdit = (restaurant, e) => {
    e.stopPropagation();
    navigate('/onboarding/restaurant', { state: { editData: restaurant } });
  };

  const showDetails = (rest) => {
    const htmlContent = `
      <div class="text-left">
        <!-- Cover Image & Header Header -->
        <div class="relative -mt-6 -mx-6 mb-6">
          ${rest.profilePic 
            ? `<img src="${rest.profilePic}" alt="Restaurant" class="w-full h-56 object-cover rounded-t-2xl"/>` 
            : `<div class="w-full h-56 bg-gradient-to-br from-green-400 to-teal-600 rounded-t-2xl flex items-center justify-center"><span class="text-white opacity-50"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg></span></div>`
          }
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-t-2xl"></div>
          <div class="absolute bottom-0 left-0 w-full p-6">
            <div class="flex justify-between items-end">
              <div>
                <h3 class="text-3xl font-bold text-white mb-1 drop-shadow-md">${rest.name}</h3>
                <p class="text-green-100 font-medium text-sm drop-shadow flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  ${rest.location?.city}, ${rest.location?.state}
                </p>
              </div>
              <div class="flex items-center gap-1 ${rest.isVegetarianOnly ? 'bg-green-500' : 'bg-orange-500'} text-white px-3 py-1.5 rounded-xl font-bold shadow-lg backdrop-blur-sm text-xs uppercase tracking-wider">
                ${rest.isVegetarianOnly ? 'Pure Veg' : 'Mixed'}
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6 px-2">
          <!-- Timing & Contact row -->
          <div class="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div>
              <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Timing</p>
              <p class="text-slate-800 dark:text-slate-200 font-bold text-sm">${rest.timing?.open || 'N/A'} - ${rest.timing?.close || 'N/A'}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Contact</p>
              <p class="text-slate-800 dark:text-slate-200 font-bold text-sm">${rest.contact?.phone || 'N/A'}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Manager</p>
              <p class="text-slate-800 dark:text-slate-200 font-semibold text-sm">${rest.contact?.managerName || 'N/A'}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Seating Capacity</p>
              <p class="text-slate-800 dark:text-slate-200 font-semibold text-sm">${rest.seatingCapacity ? rest.seatingCapacity + ' pax' : 'N/A'}</p>
            </div>
          </div>

          ${rest.description ? `
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-2">About Restaurant</p>
            <p class="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">${rest.description}</p>
          </div>` : ''}

          ${rest.cuisineTypes && rest.cuisineTypes.length > 0 ? `
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-2">Cuisines Offered</p>
            <div class="flex flex-wrap gap-2">
              ${rest.cuisineTypes.map(c => `<span class="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-semibold text-xs border border-slate-200 dark:border-slate-700 shadow-sm">${c}</span>`).join('')}
            </div>
          </div>` : ''}

          ${rest.specialities && rest.specialities.length > 0 ? `
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-2">Specialities</p>
            <div class="flex flex-wrap gap-2">
              ${rest.specialities.map(s => `<span class="bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 px-3 py-1.5 rounded-lg font-semibold text-xs border border-teal-100 dark:border-teal-800">${s}</span>`).join('')}
            </div>
          </div>` : ''}

          ${rest.associatedMandir ? `
          <div class="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/50">
            <p class="text-xs text-amber-600 dark:text-amber-400 uppercase font-bold tracking-wider mb-1">Associated Mandir</p>
            <p class="text-slate-800 dark:text-slate-200 text-sm font-medium">${rest.associatedMandir}</p>
          </div>` : ''}

          ${rest.geolocation && rest.geolocation.latitude ? `
          <div class="mt-2 pt-2">
            <a href="https://www.google.com/maps/search/?api=1&query=${rest.geolocation.latitude},${rest.geolocation.longitude}" target="_blank" class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-3 px-4 rounded-xl font-bold shadow-md shadow-green-500/20 transition-all hover:-translate-y-0.5">
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
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Restaurants Directory</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage and view all registered restaurants.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search restaurants..." className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl w-full focus:ring-2 focus:ring-green-500 focus:outline-none transition-all shadow-sm" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                <th className="p-4">Restaurant Name</th>
                <th className="p-4">City / State</th>
                <th className="p-4">Type</th>
                <th className="p-4">Phone</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">Loading restaurants...</td>
                </tr>
              ) : restaurants.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">No data available</td>
                </tr>
              ) : (
                restaurants.map((rest) => (
                  <tr key={rest._id} className="hover:bg-green-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => showDetails(rest)}>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-3">
                      {rest.profilePic ? (
                        <img src={rest.profilePic} alt="" className="w-10 h-10 rounded-xl object-cover shadow-sm border border-slate-200 dark:border-slate-700" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500 border border-green-200 dark:border-green-800">
                          <Coffee size={18} />
                        </div>
                      )}
                      <div>
                        <p className="font-bold">{rest.name}</p>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {rest.location?.city}, {rest.location?.state}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      <span className={`px-2 py-1 rounded font-bold text-xs ${rest.isVegetarianOnly ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                        {rest.isVegetarianOnly ? 'Pure Veg' : 'Mixed'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{rest.contact?.phone || 'N/A'}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); showDetails(rest); }}
                          className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-flex justify-center items-center"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={(e) => handleEdit(rest, e)}
                          className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-flex justify-center items-center"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(rest._id, e)}
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
