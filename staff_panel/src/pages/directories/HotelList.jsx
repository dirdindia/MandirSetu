import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { Building, MapPin, Search, Phone, ExternalLink, Eye, Star, Trash2, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchHotels = async () => {
    try {
      const profileRes = await api.get('/staff/me');
      const profile = profileRes.data?.data;
      let query = '';
      if (profile?.employment?.assignedMandir) {
        query = `?mandir=${profile.employment.assignedMandir._id || profile.employment.assignedMandir}`;
      } else if (profile?.employment?.assignedDham) {
        query = `?dham=${profile.employment.assignedDham._id || profile.employment.assignedDham}`;
      }

      const res = await api.get(`/hotels${query}`);
      if (res.data && res.data.data) {
        setHotels(res.data.data);
      } else {
        setHotels(Array.isArray(res.data) ? res.data : []);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`/hotels/${id}`).then(() => {
          Swal.fire('Deleted!', 'Hotel has been deleted.', 'success');
          fetchHotels();
        }).catch(err => {
          Swal.fire('Error!', 'Failed to delete hotel.', 'error');
        });
      }
    });
  };

  const handleEdit = (hotel, e) => {
    e.stopPropagation();
    navigate('/onboarding/hotel', { state: { editData: hotel } });
  };

  const showDetails = (hotel) => {
    const htmlContent = `
      <div class="text-left">
        <!-- Cover Image & Header Header -->
        <div class="relative -mt-6 -mx-6 mb-6">
          ${hotel.profilePic 
            ? `<img src="${hotel.profilePic}" alt="Hotel" class="w-full h-56 object-cover rounded-t-2xl"/>` 
            : `<div class="w-full h-56 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-t-2xl flex items-center justify-center"><span class="text-white opacity-50"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg></span></div>`
          }
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-t-2xl"></div>
          <div class="absolute bottom-0 left-0 w-full p-6">
            <div class="flex justify-between items-end">
              <div>
                <h3 class="text-3xl font-bold text-white mb-1 drop-shadow-md">${hotel.name}</h3>
                <p class="text-blue-100 font-medium text-sm drop-shadow flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  ${hotel.location?.city}, ${hotel.location?.state}
                </p>
              </div>
              ${hotel.starRating ? `
                <div class="flex items-center gap-1 bg-yellow-400/90 text-yellow-900 px-3 py-1.5 rounded-xl font-bold shadow-lg backdrop-blur-sm">
                  ${hotel.starRating} <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="space-y-6 px-2">
          <!-- Price & Contact row -->
          <div class="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div>
              <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Starting Price</p>
              <p class="text-slate-800 dark:text-slate-200 font-bold text-lg">₹${hotel.startingPrice || 'N/A'}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Contact</p>
              <p class="text-slate-800 dark:text-slate-200 font-bold text-sm">${hotel.contact?.phone || 'N/A'}</p>
            </div>
          </div>

          ${hotel.description ? `
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-2">About Hotel</p>
            <p class="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">${hotel.description}</p>
          </div>` : ''}

          <div class="grid grid-cols-2 gap-6">
            <div class="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50">
              <p class="text-xs text-blue-600 dark:text-blue-400 uppercase font-bold tracking-wider mb-2 flex items-center gap-2">
                Banquet / Hall
              </p>
              <p class="text-slate-800 dark:text-slate-200 font-semibold text-sm">
                ${hotel.hasHall ? '<span class="text-green-600 dark:text-green-400 flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Available</span>' : '<span class="text-slate-500">Not Available</span>'}
              </p>
            </div>
            <div class="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
              <p class="text-xs text-indigo-600 dark:text-indigo-400 uppercase font-bold tracking-wider mb-2 flex items-center gap-2">
                Restaurant
              </p>
              <p class="text-slate-800 dark:text-slate-200 font-semibold text-sm">
                ${hotel.foodAvailable ? '<span class="text-green-600 dark:text-green-400 flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Available</span>' : '<span class="text-slate-500">Not Available</span>'}
              </p>
            </div>
          </div>

          ${hotel.roomTypes && hotel.roomTypes.length > 0 ? `
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-2">Room Types</p>
            <div class="flex flex-wrap gap-2">
              ${hotel.roomTypes.map(r => `<span class="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-semibold text-xs border border-slate-200 dark:border-slate-700 shadow-sm">${r}</span>`).join('')}
            </div>
          </div>` : ''}

          ${hotel.amenities && hotel.amenities.length > 0 ? `
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-2">Amenities</p>
            <div class="flex flex-wrap gap-2">
              ${hotel.amenities.map(a => `<span class="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg font-semibold text-xs border border-blue-100 dark:border-blue-800">${a}</span>`).join('')}
            </div>
          </div>` : ''}

          ${hotel.distanceFromNearestMandir ? `
          <div class="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/50">
            <p class="text-xs text-amber-600 dark:text-amber-400 uppercase font-bold tracking-wider mb-1">Distance from Mandir</p>
            <p class="text-slate-800 dark:text-slate-200 text-sm font-medium">${hotel.distanceFromNearestMandir}</p>
          </div>` : ''}

          ${hotel.geolocation && hotel.geolocation.latitude ? `
          <div class="mt-2 pt-2">
            <a href="https://www.google.com/maps/search/?api=1&query=${hotel.geolocation.latitude},${hotel.geolocation.longitude}" target="_blank" class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 px-4 rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5">
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
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Hotels Directory</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage and view all registered hotels.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search hotels..." className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-sm" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                <th className="p-4">Hotel Name</th>
                <th className="p-4">City / State</th>
                <th className="p-4">Star Rating</th>
                <th className="p-4">Phone</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">Loading hotels...</td>
                </tr>
              ) : hotels.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">No data available</td>
                </tr>
              ) : (
                hotels.map((hotel) => (
                  <tr key={hotel._id} className="hover:bg-blue-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => showDetails(hotel)}>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-3">
                      {hotel.profilePic ? (
                        <img src={hotel.profilePic} alt="" className="w-10 h-10 rounded-xl object-cover shadow-sm border border-slate-200 dark:border-slate-700" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 border border-blue-200 dark:border-blue-800">
                          <Building size={18} />
                        </div>
                      )}
                      <div>
                        <p className="font-bold">{hotel.name}</p>
                        {hotel.starRating && <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1"><Star size={10} fill="currentColor"/> {hotel.starRating} Star</p>}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {hotel.location?.city}, {hotel.location?.state}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {hotel.starRating ? (
                        <span className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-50 px-2 py-1 rounded text-xs w-max">
                          {hotel.starRating} <Star size={12} fill="currentColor" />
                        </span>
                      ) : 'N/A'}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{hotel.contact?.phone || 'N/A'}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); showDetails(hotel); }}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-flex justify-center items-center"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={(e) => handleEdit(hotel, e)}
                          className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-flex justify-center items-center"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(hotel._id, e)}
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
