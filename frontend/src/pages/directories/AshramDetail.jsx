import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';

export default function AshramDetail() {
  const { id } = useParams();
  const [ashram, setAshram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/ashrams/${id}`);
        setAshram(res.data);
      } catch (err) {
        console.error('Failed to fetch ashram details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!ashram) {
    return (
      <div className="min-h-screen pt-24 flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">Ashram Not Found</h2>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => window.history.back()} className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold mb-6 transition-colors">
          &larr; Back
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800">
          <div className="h-64 sm:h-96 w-full relative">
             <img 
                src={ashram.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(ashram.name)}&background=f97316&color=fff&size=512`} 
                alt={ashram.name} 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(ashram.name)}&background=f97316&color=fff&size=512` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                 <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Ashram
                    </span>
                 </div>
                 <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">{ashram.name}</h1>
                 <p className="text-slate-200 text-lg flex items-center">
                   <span className="mr-2">📍</span> {ashram.location?.city}, {ashram.location?.state}
                 </p>
              </div>
          </div>

          <div className="p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">About the Ashram</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                  {ashram.description || 'No description available.'}
                </p>
              </section>

              {ashram.rules && (
                <section className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/30">
                  <h2 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Rules & Guidelines</h2>
                  <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap">{ashram.rules}</p>
                </section>
              )}

              {ashram.facilities && ashram.facilities.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Facilities</h2>
                  <div className="flex flex-wrap gap-2">
                    {ashram.facilities.map((fac, idx) => (
                      <span key={idx} className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-4 py-2 rounded-xl text-sm font-semibold border border-orange-100 dark:border-orange-800/50">
                        {fac}
                      </span>
                    ))}
                  </div>
                </section>
              )}
              
              <section className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-sm font-bold text-slate-500 uppercase">Accommodation</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-1">{ashram.accommodationAvailable ? 'Available' : 'Not Available'}</p>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-sm font-bold text-slate-500 uppercase">Donation</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-1">{ashram.donationAccepted ? 'Accepted' : 'Not Specified'}</p>
                 </div>
              </section>
            </div>

            <div className="space-y-6">

              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Location</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">{ashram.location?.address}, {ashram.location?.city}, {ashram.location?.state} {ashram.location?.pincode}</p>
                {ashram.geolocation?.latitude && (
                  <a href={`https://www.google.com/maps/search/?api=1&query=${ashram.geolocation.latitude},${ashram.geolocation.longitude}`} target="_blank" rel="noreferrer" className="block w-full text-center bg-slate-900 hover:bg-slate-800 dark:bg-orange-500 dark:hover:bg-orange-600 text-white py-2 rounded-xl font-bold transition-colors">
                    View on Maps
                  </a>
                )}
              </div>

              {(ashram.contact?.phone || ashram.contact?.email) && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Contact</h3>
                  <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    {ashram.contact.managerName && <li><strong className="text-slate-800 dark:text-slate-200">Manager:</strong> {ashram.contact.managerName}</li>}
                    {ashram.contact.phone && <li>📞 {ashram.contact.phone}</li>}
                    {ashram.contact.email && <li>✉️ {ashram.contact.email}</li>}
                    {ashram.contact.website && <li>🌐 <a href={ashram.contact.website} target="_blank" rel="noreferrer" className="text-orange-500 hover:underline">Website</a></li>}
                  </ul>
                  {ashram.contact.phone && (
                    <a href={`tel:${ashram.contact.phone}`} className="mt-4 block w-full text-center bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-orange-500/30">
                      Call Ashram
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
