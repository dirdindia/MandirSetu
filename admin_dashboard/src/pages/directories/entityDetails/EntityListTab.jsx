import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2, MapPin, Phone, Mail, Users, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import axiosInstance from '../../../api/axiosInstance';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function EntityListTab({ listType }) {
  const { endpointBase, type } = useOutletContext();
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchListData(page);
  }, [page, listType, endpointBase]);

  const fetchListData = async (targetPage) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`${endpointBase}/full-details?type=${listType}&page=${targetPage}&limit=10`);
      setListData(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);
      setPage(res.data.currentPage);
    } catch (error) {
      console.error(`Failed to fetch ${listType}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const showItemDetails = (item) => {
    let extraDetails = '';
    
    if (listType === 'hotels' || listType === 'ashrams') {
      extraDetails = `
        <div class="mt-3">
          <p class="text-xs text-maroon-darker/60 uppercase font-bold tracking-wider">Amenities</p>
          <div class="flex flex-wrap gap-2 mt-1">
            ${item.amenities?.map(a => `<span class="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">${a}</span>`).join('') || '<span class="text-sm text-maroon-darker/60">None</span>'}
          </div>
        </div>
        <div class="mt-3">
          <p class="text-xs text-maroon-darker/60 uppercase font-bold tracking-wider">Starting Price</p>
          <p class="text-sm text-maroon font-semibold mt-1">₹${item.startingPrice || 'N/A'}</p>
        </div>
      `;
    }

    const htmlContent = `
      <div class="text-left space-y-4">
        ${item.profilePic || item.image ? `<img src="${item.profilePic || item.image}" alt="Profile" class="w-full h-48 object-cover rounded-xl shadow-md mb-4"/>` : ''}
        
        <div>
          <p class="text-xs text-maroon-darker/60 uppercase font-bold tracking-wider">Name</p>
          <p class="text-maroon font-semibold text-lg">${item.name}</p>
        </div>

        <div>
          <p class="text-xs text-maroon-darker/60 uppercase font-bold tracking-wider">Location</p>
          <p class="text-maroon text-sm flex items-start gap-2 mt-1">
            <span class="mt-0.5"><MapPin size={16} class="text-blue-500"/></span>
            <span>${item.location?.address}, ${item.location?.city}, ${item.location?.state} - ${item.location?.pincode}</span>
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-maroon-darker/60 uppercase font-bold tracking-wider">Contact Phone</p>
            <p class="text-maroon text-sm flex items-center gap-1 mt-1"><Phone size={14}/> ${item.contact?.phone || 'N/A'}</p>
          </div>
          <div>
            <p class="text-xs text-maroon-darker/60 uppercase font-bold tracking-wider">Email</p>
            <p class="text-maroon text-sm flex items-center gap-1 mt-1"><Mail size={14}/> ${item.contact?.email || 'N/A'}</p>
          </div>
        </div>

        ${extraDetails}

        ${item.description ? `
        <div>
          <p class="text-xs text-maroon-darker/60 uppercase font-bold tracking-wider">Description</p>
          <p class="text-maroon-darker text-sm bg-premium p-3 rounded-lg border border-slate-100 mt-1">${item.description}</p>
        </div>` : ''}
        
        ${item.onboardedBy ? `
        <div class="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
          <span class="text-xs text-maroon-darker/60 uppercase font-bold tracking-wider">Added By:</span>
          <span class="text-sm font-semibold text-maroon-darker">${item.onboardedBy.name || item.onboardedBy.email || 'Staff'}</span>
        </div>` : ''}
      </div>
    `;

    Swal.fire({
      title: `<h3 class="text-xl font-bold text-blue-600 mb-2">${listType.charAt(0).toUpperCase() + listType.slice(1)} Details</h3>`,
      html: htmlContent,
      showCloseButton: true,
      showConfirmButton: false,
      width: '500px',
      customClass: {
        popup: 'rounded-2xl',
        title: 'border-b pb-4',
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gold/20 overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-4 sm:p-6 border-b border-gold/20 flex justify-between items-center">
        <h2 className="text-xl font-bold text-maroon-darker capitalize">{listType}</h2>
        <span className="px-3 py-1 bg-gold/10 text-maroon-darker/60 rounded-full text-xs font-medium">
            Total: {totalItems}
        </span>
      </div>

      <div className="p-0 flex-1">
        {isLoading ? (
          <div className="p-12 flex items-center justify-center text-maroon-darker/60">
            <Loader2 size={24} className="animate-spin text-blue-500" />
          </div>
        ) : listData.length > 0 ? (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {listData.map((item) => (
              <li 
                key={item._id} 
                className="p-4 sm:p-5 hover:bg-premium hover:bg-gold/10/30 transition-colors cursor-pointer"
                onClick={() => showItemDetails(item)}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-medium text-maroon-darker">{item.name}</h4>
                    <p className="text-sm text-gold mt-1 line-clamp-1">{item.description || 'No description'}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.onboardedBy && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gold/10 text-xs font-medium text-maroon-darker/70">
                          <Users size={12} />
                          Added by: {item.onboardedBy.name || item.onboardedBy.email || 'Staff'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 shrink-0">
                    <button className="text-slate-400 hover:text-blue-500 bg-white border border-gold/20 dark:border-slate-700 p-2 rounded-full shadow-sm">
                      <Eye size={16} />
                    </button>
                    {item.profilePic || item.image ? (
                      <img src={item.profilePic || item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-gold/20 dark:border-slate-700" />
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-12 text-center text-maroon-darker/60">
            <p>No {listType} found for this {type}.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="border-t border-gold/20 p-4 flex items-center justify-between bg-premium">
          <span className="text-sm text-maroon-darker/60">
            Showing page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="p-1.5 rounded-lg border border-gold/20 dark:border-slate-700 text-maroon-darker/60 hover:bg-slate-100 hover:bg-gold/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-medium text-maroon-darker/80 min-w-[3rem] text-center">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
              className="p-1.5 rounded-lg border border-gold/20 dark:border-slate-700 text-maroon-darker/60 hover:bg-slate-100 hover:bg-gold/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
