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
      <div className="min-h-screen pt-24 flex justify-center items-center bg-[#fdfbf7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37]"></div>
      </div>
    );
  }

  if (!temple) {
    return (
      <div className="min-h-screen pt-24 flex flex-col justify-center items-center bg-[#fdfbf7]">
        <h2 className="text-3xl font-serif text-[#791916] mb-4">Temple Not Found</h2>
        <Link to="/mandirs" className="text-[#d4af37] font-semibold hover:text-[#791916] transition-colors">Go back to all Temples</Link>
      </div>
    );
  }

  const gradient = 'from-[#3a0d0a]/90 via-[#791916]/70 to-[#fdfbf7]';

  return (
    <div className="bg-[#fdfbf7] min-h-screen text-[#3a0d0a] font-sans pb-20">
      
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[700px] flex flex-col justify-center items-center pt-16">
        <div className="absolute inset-0">
          <img 
            src={temple.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(temple.name)}&background=791916&color=d4af37&size=1024`} 
            alt={temple.name} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(temple.name)}&background=791916&color=d4af37&size=1024` }}
          />
        </div>
        <div className={`absolute inset-0 z-10 bg-gradient-to-b ${gradient} pointer-events-none`}></div>
        
        {/* Back button at top left */}
        <div className="absolute top-24 left-4 sm:left-8 z-30">
          <Link to="/mandirs" className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all text-sm font-semibold border border-white/20 flex items-center gap-2">
            &larr; Back to Temples
          </Link>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 w-full max-w-5xl mt-[-40px]">
          <h2 className="text-[#d4af37] text-lg sm:text-xl md:text-2xl font-serif tracking-widest mb-4">॥ जय श्री {temple.mainDeity || 'राम'} ॥</h2>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white mb-6 drop-shadow-xl uppercase tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            {temple.name}
          </h1>
          <p className="text-sm sm:text-lg text-[#fdfbf7] max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow-md font-light italic">
            Experience the divine presence at {temple.name}, a sacred abode of {temple.mainDeity || 'the divine'}.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
             <button onClick={() => window.scrollTo({top: 800, behavior: 'smooth'})} className="px-8 py-3 bg-[#d4af37] text-[#3a0d0a] rounded-full font-bold shadow-lg hover:bg-[#c29b26] transition-colors">Darshan Timings</button>
             <button onClick={() => window.scrollTo({top: 1400, behavior: 'smooth'})} className="px-8 py-3 bg-transparent border-2 border-white/70 text-white rounded-full font-bold hover:bg-white/10 transition-colors backdrop-blur-sm">Mandir Ki Suvidhayein</button>
          </div>
        </div>

        {/* Overlapping Info Cards */}
        <div className="absolute bottom-0 translate-y-1/2 left-0 right-0 z-30 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-[#791916]/10 border border-[#d4af37]/20 flex items-center gap-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-2xl border border-[#d4af37]/30 shrink-0 text-[#791916]">
                🌞
              </div>
              <div>
                <h4 className="font-serif font-bold text-[#791916] text-lg">Daily Darshan</h4>
                <p className="text-sm text-[#791916]/70 leading-tight mt-1">
                  {temple.schedule?.openTime ? `${temple.schedule.openTime} - ${temple.schedule.closeTime}` : 'Check timings online'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-[#791916]/10 border border-[#d4af37]/20 flex items-center gap-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-2xl border border-[#d4af37]/30 shrink-0 text-[#791916]">
                🌸
              </div>
              <div>
                <h4 className="font-serif font-bold text-[#791916] text-lg">Main Deity</h4>
                <p className="text-sm text-[#791916]/70 leading-tight mt-1">{temple.mainDeity || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-[#791916]/10 border border-[#d4af37]/20 flex items-center gap-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-2xl border border-[#d4af37]/30 shrink-0 text-[#791916]">
                📍
              </div>
              <div>
                <h4 className="font-serif font-bold text-[#791916] text-lg">Location</h4>
                <p className="text-sm text-[#791916]/70 leading-tight mt-1 truncate">{temple.location?.city}, {temple.location?.state}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="mt-40 mb-16 flex justify-center text-[#d4af37]">
         <span className="text-2xl">▲</span>
      </div>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
               <img src={temple.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(temple.name)}&background=791916&color=d4af37&size=1024`} alt={temple.name} className="w-full h-[500px] object-cover rounded-3xl shadow-2xl border border-[#d4af37]/20" />
               <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#d4af37] text-[#3a0d0a] rounded-full flex items-center justify-center text-4xl shadow-xl border-4 border-[#fdfbf7]">
                  ॐ
               </div>
            </div>
            <div>
               <h2 className="text-3xl sm:text-5xl font-serif text-[#791916] mb-6 uppercase tracking-wider">{temple.name} KA DIVYA DHAM</h2>
               <p className="text-[#3a0d0a]/80 leading-relaxed text-lg font-light mb-8">
                 {temple.description || 'No description available for this Temple.'}
               </p>
               <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#d4af37]/30">
                 <div>
                   <h4 className="text-sm uppercase tracking-widest text-[#791916]/60 font-bold mb-1">Established Year</h4>
                   <p className="text-xl font-serif text-[#791916]">{temple.establishedYear || 'Ancient'}</p>
                 </div>
                 <div>
                   <h4 className="text-sm uppercase tracking-widest text-[#791916]/60 font-bold mb-1">Status</h4>
                   <p className="text-xl font-serif text-[#791916] capitalize">{temple.status || 'Active'}</p>
                 </div>
               </div>
            </div>
         </div>
      </section>

      {/* Decorative Divider */}
      <div className="mb-16 flex justify-center text-[#d4af37]">
         <span className="text-2xl">▲</span>
      </div>

      {/* Sevayen Aur Anushthan Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
         <div className="text-center mb-12">
           <h2 className="text-3xl sm:text-5xl font-serif text-[#791916] mb-4 uppercase tracking-wider">Sevayen Aur Anushthan</h2>
           <p className="text-[#3a0d0a]/70 font-serif italic text-lg">Explore nearby services and offerings</p>
         </div>
         <RelatedDirectoryTabs mandirId={id} />
      </section>

      {/* Gallery Section */}
      {temple.gallery && temple.gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center mb-12">
             <h2 className="text-3xl sm:text-5xl font-serif text-[#791916] mb-4 uppercase tracking-wider">Gallery</h2>
             <p className="text-[#3a0d0a]/70 font-serif italic text-lg">Glimpses of the divine abode</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {temple.gallery.map((img, idx) => (
              <div key={idx} className="h-64 rounded-2xl overflow-hidden shadow-lg border border-[#d4af37]/20 group">
                 <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* How to Reach & Contact */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* How to Reach */}
          <div className="bg-white p-10 rounded-3xl border border-[#d4af37]/30 shadow-lg relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-2xl font-serif text-[#791916] mb-6 uppercase tracking-wider border-b border-[#d4af37]/20 pb-4">How To Reach</h3>
               <ul className="space-y-6 text-[#3a0d0a]/80">
                 {temple.howToReach?.air ? (
                   <li className="flex items-start gap-4">
                     <span className="text-2xl p-3 bg-[#fdfbf7] rounded-full text-[#791916] border border-[#d4af37]/20">✈️</span>
                     <div><h4 className="font-bold text-[#791916] mb-1">By Air</h4><p>{temple.howToReach.air}</p></div>
                   </li>
                 ) : null}
                 {temple.howToReach?.train ? (
                   <li className="flex items-start gap-4">
                     <span className="text-2xl p-3 bg-[#fdfbf7] rounded-full text-[#791916] border border-[#d4af37]/20">🚆</span>
                     <div><h4 className="font-bold text-[#791916] mb-1">By Train</h4><p>{temple.howToReach.train}</p></div>
                   </li>
                 ) : null}
                 {temple.howToReach?.bus ? (
                   <li className="flex items-start gap-4">
                     <span className="text-2xl p-3 bg-[#fdfbf7] rounded-full text-[#791916] border border-[#d4af37]/20">🚌</span>
                     <div><h4 className="font-bold text-[#791916] mb-1">By Road</h4><p>{temple.howToReach.bus}</p></div>
                   </li>
                 ) : null}
               </ul>
             </div>
             <div className="absolute -bottom-10 -right-10 text-9xl opacity-5">🗺️</div>
          </div>

          {/* Contact */}
          <div className="bg-[#791916] p-10 rounded-3xl border border-[#d4af37]/30 shadow-lg relative overflow-hidden text-white">
             <div className="relative z-10">
               <h3 className="text-2xl font-serif text-[#d4af37] mb-6 uppercase tracking-wider border-b border-[#d4af37]/20 pb-4">Contact Info</h3>
               <ul className="space-y-6 text-[#fdfbf7]/90">
                 {temple.contact?.phone ? (
                   <li className="flex items-center gap-4">
                     <span className="text-2xl p-3 bg-black/20 rounded-full text-[#d4af37] border border-[#d4af37]/20">📞</span>
                     <span className="text-lg">{temple.contact.phone}</span>
                   </li>
                 ) : null}
                 {temple.contact?.email ? (
                   <li className="flex items-center gap-4">
                     <span className="text-2xl p-3 bg-black/20 rounded-full text-[#d4af37] border border-[#d4af37]/20">✉️</span>
                     <span className="text-lg">{temple.contact.email}</span>
                   </li>
                 ) : null}
                 {temple.contact?.website ? (
                   <li className="flex items-center gap-4">
                     <span className="text-2xl p-3 bg-black/20 rounded-full text-[#d4af37] border border-[#d4af37]/20">🌐</span>
                     <a href={temple.contact.website} target="_blank" rel="noreferrer" className="text-lg text-[#d4af37] hover:underline">Visit Official Website</a>
                   </li>
                 ) : null}
               </ul>
             </div>
             <div className="absolute -bottom-10 -right-10 text-9xl opacity-5">📞</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="bg-[#791916] rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h3 className="text-[#d4af37] text-lg font-serif tracking-widest mb-2">॥ ॐ शिवाय नमः ॥</h3>
            <h2 className="text-3xl sm:text-5xl font-serif mb-6 leading-tight">Apni Yatra Ki Yojana Banayein</h2>
            <p className="text-[#fdfbf7]/80 leading-relaxed font-light mb-8">
              Darshan timings, online puja booking aur sampoorna yatra ki jankari yahan uplabdh hai.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link to="/gallery" className="px-8 py-3.5 bg-[#d4af37] hover:bg-[#c29b26] text-[#3a0d0a] font-bold rounded-full transition-all shadow-md active:scale-95 text-sm sm:text-base cursor-pointer">Yatra ki jankari len</Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
      </section>

    </div>
  );
}
