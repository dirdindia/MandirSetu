import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import RelatedDirectoryTabs from '../../components/RelatedDirectoryTabs';

export default function MandirDetail() {
  const { id } = useParams();
  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTempleDetail = async () => {
      try {
        const res = await api.get(`/mandirs/${id}`);
        setTemple(res.data);
      } catch (err) {
        console.error('Failed to fetch temple details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTempleDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!temple) {
    return (
      <div className="min-h-screen pt-24 flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">Temple Not Found</h2>
        <Link to="/mandirs" className="text-orange-500 hover:underline">Go back to all temples</Link>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/mandirs" className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold mb-6 transition-colors">
          &larr; Back to Temples
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800">
          {/* Header Image */}
          <div className="h-64 sm:h-96 w-full relative">
             <img 
                src={temple.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(temple.name)}&background=f97316&color=fff&size=512`} 
                alt={temple.name} 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(temple.name)}&background=f97316&color=fff&size=512` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                 <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {temple.category || 'Temple'}
                    </span>
                    {temple.status === 'active' && (
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                 </div>
                 <h1 className="text-4xl sm:text-6xl font-black text-white mb-2">{temple.name}</h1>
                 <p className="text-slate-200 text-lg flex items-center">
                   <span className="mr-2">📍</span> {temple.location?.address}, {temple.location?.city}, {temple.location?.state} {temple.location?.pincode}
                 </p>
              </div>
          </div>

          {/* Content */}
          <div className="p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-500 flex items-center justify-center mr-3 text-sm">🕉️</span>
                  About the Temple
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                  {temple.description || 'No description available for this temple.'}
                </p>
              </section>

              {temple.gallery && temple.gallery.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {temple.gallery.map((img, idx) => (
                      <img key={idx} src={img} alt={`Gallery ${idx}`} className="w-full h-32 object-cover rounded-xl shadow-sm border border-slate-200 dark:border-slate-700" />
                    ))}
                  </div>
                </section>
              )}
              
              <RelatedDirectoryTabs mandirId={id} />
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Key Details</h3>
                <ul className="space-y-4">
                  <li>
                    <span className="block text-sm text-slate-500 dark:text-slate-400">Main Deity</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{temple.mainDeity || 'N/A'}</span>
                  </li>
                  <li>
                    <span className="block text-sm text-slate-500 dark:text-slate-400">Established Year</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{temple.establishedYear || 'Unknown'}</span>
                  </li>
                </ul>
              </div>

              {(temple.schedule?.openTime || temple.schedule?.closeTime) && (
                <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl border border-orange-100 dark:border-orange-900/50">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4 border-b border-orange-200 dark:border-orange-800/50 pb-2">Temple Timings</h3>
                  <div className="flex justify-between items-center text-orange-800 dark:text-orange-200">
                    <div className="text-center">
                      <span className="block text-xs uppercase font-bold opacity-70 mb-1">Opens</span>
                      <span className="text-xl font-black">{temple.schedule.openTime || '-'}</span>
                    </div>
                    <div className="w-px h-8 bg-orange-200 dark:bg-orange-800"></div>
                    <div className="text-center">
                      <span className="block text-xs uppercase font-bold opacity-70 mb-1">Closes</span>
                      <span className="text-xl font-black">{temple.schedule.closeTime || '-'}</span>
                    </div>
                  </div>
                </div>
              )}

              {(temple.howToReach?.air || temple.howToReach?.train || temple.howToReach?.bus) && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">How to Reach</h3>
                  <ul className="space-y-4 text-sm">
                    {temple.howToReach.air && (
                      <li className="flex items-start">
                        <span className="mr-3 text-lg">✈️</span>
                        <span className="text-slate-600 dark:text-slate-300">{temple.howToReach.air}</span>
                      </li>
                    )}
                    {temple.howToReach.train && (
                      <li className="flex items-start">
                        <span className="mr-3 text-lg">🚆</span>
                        <span className="text-slate-600 dark:text-slate-300">{temple.howToReach.train}</span>
                      </li>
                    )}
                    {temple.howToReach.bus && (
                      <li className="flex items-start">
                        <span className="mr-3 text-lg">🚌</span>
                        <span className="text-slate-600 dark:text-slate-300">{temple.howToReach.bus}</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}
              
              {(temple.contact?.phone || temple.contact?.email) && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Contact</h3>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {temple.contact.phone && <li>📞 {temple.contact.phone}</li>}
                    {temple.contact.email && <li>✉️ {temple.contact.email}</li>}
                    {temple.contact.website && <li>🌐 <a href={temple.contact.website} target="_blank" rel="noreferrer" className="text-orange-500 hover:underline">Website</a></li>}
                  </ul>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
