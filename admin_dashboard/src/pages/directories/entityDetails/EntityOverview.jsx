import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Building, MapPin, Phone, Mail, Globe } from 'lucide-react';

export default function EntityOverview() {
  const { overview } = useOutletContext();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="xl:col-span-1 space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="h-48 sm:h-64 lg:h-48 bg-slate-200 dark:bg-slate-800 relative">
            {overview.profilePic ? (
              <img src={overview.profilePic} alt={overview.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Building size={48} />
              </div>
            )}
          </div>
          
          <div className="p-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">About</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{overview.description || 'No description provided.'}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <p>{overview.location?.address}, {overview.location?.city}, {overview.location?.state} {overview.location?.pincode}</p>
                  {(overview.geolocation?.latitude && overview.geolocation?.longitude) && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <p className="text-xs text-slate-500">
                        Geo: {overview.geolocation.latitude}, {overview.geolocation.longitude}
                      </p>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${overview.geolocation.latitude},${overview.geolocation.longitude}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 px-2 py-0.5 rounded transition-colors font-medium"
                      >
                        View on Map
                      </a>
                    </div>
                  )}
                </div>
              </div>
              {overview.contact?.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{overview.contact.phone}</span>
                </div>
              )}
              {overview.contact?.email && (
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{overview.contact.email}</span>
                </div>
              )}
              {overview.contact?.website && (
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-slate-400 shrink-0" />
                  <a href={overview.contact.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline truncate">
                    {overview.contact.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="xl:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Basic Info</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
                <div>
                  <span className="block text-slate-500 mb-1">Category</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{overview.category || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-slate-500 mb-1">Main Deity</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{overview.mainDeity || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-slate-500 mb-1">Established Year</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{overview.establishedYear || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-slate-500 mb-1">Timing</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {overview.schedule?.openTime || 'N/A'} - {overview.schedule?.closeTime || 'N/A'}
                  </span>
                </div>
            </div>
        </div>

        {overview.howToReach && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">How to Reach</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                <div>
                  <span className="block text-slate-500 mb-1 font-semibold">By Air</span>
                  <span className="text-slate-700 dark:text-slate-300">{overview.howToReach.air || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-slate-500 mb-1 font-semibold">By Train</span>
                  <span className="text-slate-700 dark:text-slate-300">{overview.howToReach.train || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-slate-500 mb-1 font-semibold">By Bus</span>
                  <span className="text-slate-700 dark:text-slate-300">{overview.howToReach.bus || 'N/A'}</span>
                </div>
            </div>
          </div>
        )}

        {overview.gallery && overview.gallery.length > 0 && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Gallery</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {overview.gallery.map((imgUrl, idx) => (
                <div key={idx} className="h-24 sm:h-32 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                  <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
