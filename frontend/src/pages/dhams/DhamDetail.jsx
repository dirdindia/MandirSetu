import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import { Sparkles, Lightbulb, Clock, Calendar, Navigation } from 'lucide-react';
import RelatedDirectoryTabs from '../../components/RelatedDirectoryTabs';

export default function DhamDetail() {
  const { id } = useParams();
  const [dham, setDham] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDhamDetail = async () => {
      try {
        const res = await api.get(`/dhams/${id}`);
        setDham(res.data);
      } catch (err) {
        console.error('Failed to fetch Dham details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDhamDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center bg-premium">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!dham) {
    return (
      <div className="min-h-screen pt-24 flex flex-col justify-center items-center bg-premium">
        <h2 className="text-3xl font-serif text-maroon mb-4">Dham Not Found</h2>
        <Link to="/dhams" className="text-gold font-semibold hover:text-maroon transition-colors">Go back to all Dhams</Link>
      </div>
    );
  }

  const gradient = 'from-maroon-darker/90 via-maroon/70 to-premium';

  return (
    <div className="bg-premium min-h-screen text-maroon-darker font-sans pb-20 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[700px] flex flex-col justify-center items-center pt-16">
        <div className="absolute inset-0">
          <img 
            src={dham.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(dham.name)}&background=791916&color=d4af37&size=1024`} 
            alt={dham.name} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dham.name)}&background=791916&color=d4af37&size=1024` }}
          />
        </div>
        <div className={`absolute inset-0 z-10 bg-gradient-to-b ${gradient} pointer-events-none`}></div>
        
        {/* Back button at top left */}
        <div className="absolute top-24 left-4 sm:left-8 z-30">
          <Link to="/dhams" className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all text-sm font-semibold border border-white/20 flex items-center gap-2">
            &larr; Back to Dhams
          </Link>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 w-full max-w-5xl mt-[-40px]">
          <h2 className="text-gold text-lg sm:text-xl md:text-2xl font-serif tracking-widest mb-4">॥ जय श्री {dham.mainDeity || 'राम'} ॥</h2>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white mb-6 drop-shadow-xl uppercase tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            {dham.name}
          </h1>
          <p className="text-sm sm:text-lg text-premium max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow-md font-light italic">
            Experience the divine presence at {dham.name}, a sacred abode of {dham.mainDeity || 'the divine'}.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
             <button onClick={() => window.scrollTo({top: 800, behavior: 'smooth'})} className="px-8 py-3 bg-gold text-maroon-darker rounded-full font-bold shadow-lg hover:bg-[#c29b26] transition-colors">Darshan Timings</button>
             <button onClick={() => window.scrollTo({top: 1400, behavior: 'smooth'})} className="px-8 py-3 bg-transparent border-2 border-white/70 text-white rounded-full font-bold hover:bg-white/10 transition-colors backdrop-blur-sm">Mandir Ki Suvidhayein</button>
          </div>
        </div>

        {/* Overlapping Info Cards */}
        <div className="absolute bottom-0 translate-y-1/2 left-0 right-0 z-30 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-maroon/10 border border-gold/20 flex items-center gap-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-2xl border border-gold/30 shrink-0 text-maroon">
                🌞
              </div>
              <div>
                <h4 className="font-serif font-bold text-maroon text-lg">Daily Darshan</h4>
                <p className="text-sm text-maroon/70 leading-tight mt-1">
                  {dham.schedule?.openTime ? `${dham.schedule.openTime} - ${dham.schedule.closeTime}` : 'Check timings online'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-maroon/10 border border-gold/20 flex items-center gap-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-2xl border border-gold/30 shrink-0 text-maroon">
                🌸
              </div>
              <div>
                <h4 className="font-serif font-bold text-maroon text-lg">Main Deity</h4>
                <p className="text-sm text-maroon/70 leading-tight mt-1">{dham.mainDeity || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-maroon/10 border border-gold/20 flex items-center gap-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-2xl border border-gold/30 shrink-0 text-maroon">
                📍
              </div>
              <div>
                <h4 className="font-serif font-bold text-maroon text-lg">Location</h4>
                <p className="text-sm text-maroon/70 leading-tight mt-1 truncate">{dham.location?.city}, {dham.location?.state}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="mt-40 mb-16 flex justify-center text-gold">
         <span className="text-2xl">▲</span>
      </div>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
               <img src={dham.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(dham.name)}&background=791916&color=d4af37&size=1024`} alt={dham.name} className="w-full h-[500px] object-cover rounded-3xl shadow-2xl border border-gold/20" />
               <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gold text-maroon-darker rounded-full flex items-center justify-center text-4xl shadow-xl border-4 border-premium">
                  ॐ
               </div>
            </div>
            <div>
               <h2 className="text-3xl sm:text-5xl font-serif text-maroon mb-6 uppercase tracking-wider">{dham.name} KA DIVYA DHAM</h2>
               <p className="text-maroon-darker/80 leading-relaxed text-lg font-light mb-8">
                 {dham.description || 'No description available for this Dham.'}
               </p>



               <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gold/30">
                 <div>
                   <h4 className="text-sm uppercase tracking-widest text-maroon/60 font-bold mb-1">Established Year</h4>
                   <p className="text-xl font-serif text-maroon">{dham.establishedYear || 'Ancient'}</p>
                 </div>
                 <div>
                   <h4 className="text-sm uppercase tracking-widest text-maroon/60 font-bold mb-1">Status</h4>
                   <p className="text-xl font-serif text-maroon capitalize">{dham.status || 'Active'}</p>
                 </div>
               </div>
            </div>
         </div>
      </section>

      {/* TIMINGS SECTION */}
      {(dham.darshanTimings?.length > 0 || dham.aartiTimings?.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-white p-8 sm:p-10 rounded-[2rem] border border-gold/30 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-full"></div>
             
             <div className="flex items-center justify-center mb-8 relative">
                <div className="h-[2px] bg-gradient-to-r from-transparent to-gold flex-1"></div>
                <h3 className="text-xl sm:text-2xl font-serif text-maroon uppercase tracking-widest px-6 relative z-10 font-bold flex items-center gap-3">
                   <Clock className="text-gold w-6 h-6 sm:w-8 sm:h-8" /> DARSHAN & AARTI TIMINGS
                </h3>
                <div className="h-[2px] bg-gradient-to-l from-transparent to-gold flex-1"></div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto relative z-10">
               {dham.darshanTimings?.length > 0 && (
                 <div>
                   <h4 className="text-lg font-bold text-maroon mb-4 uppercase tracking-wider border-b border-gold/30 pb-2">Darshan</h4>
                   <ul className="space-y-4">
                     {dham.darshanTimings.map((dt, idx) => (
                       <li key={idx} className="flex justify-between items-center text-maroon-darker/80 font-medium border-b border-dashed border-gold/40 pb-2">
                         <span>{dt.name || `Darshan ${idx + 1}`}</span>
                         <span className="font-bold text-maroon">{dt.fromTime} - {dt.toTime}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
               )}
               {dham.aartiTimings?.length > 0 && (
                 <div>
                   <h4 className="text-lg font-bold text-maroon mb-4 uppercase tracking-wider border-b border-gold/30 pb-2">Aarti</h4>
                   <ul className="space-y-4">
                     {dham.aartiTimings.map((at, idx) => (
                       <li key={idx} className="flex justify-between items-center text-maroon-darker/80 font-medium border-b border-dashed border-gold/40 pb-2">
                         <span>{at.name || `Aarti ${idx + 1}`}</span>
                         <span className="font-bold text-maroon">{at.time}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
               )}
             </div>
          </div>
        </section>
      )}

      {/* RELIGIOUS SIGNIFICANCE (Separate Section) */}
      {dham.religiousImportance && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-white p-8 sm:p-10 rounded-[2rem] border border-gold/30 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-full"></div>
             
             <div className="flex items-center justify-center mb-6 relative">
                <div className="h-[2px] bg-gradient-to-r from-transparent to-gold flex-1"></div>
                <h3 className="text-xl sm:text-2xl font-serif text-maroon uppercase tracking-widest px-6 relative z-10 font-bold flex items-center gap-3">
                   <Sparkles className="text-gold w-6 h-6 sm:w-8 sm:h-8" /> RELIGIOUS SIGNIFICANCE
                </h3>
                <div className="h-[2px] bg-gradient-to-l from-transparent to-gold flex-1"></div>
             </div>
             
             <div className="text-maroon-darker/80 text-lg sm:text-xl leading-relaxed text-center font-medium max-w-4xl mx-auto relative z-10 italic whitespace-pre-line">
                <p>{dham.religiousImportance}</p>
             </div>
          </div>
        </section>
      )}

      {/* Decorative Divider */}
      <div className="mb-16 flex justify-center text-gold">
         <span className="text-2xl">▲</span>
      </div>

      {/* MANDIR SETU TIP */}
      {dham.mandirSetuTip && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-gradient-to-r from-gold/20 via-[#f8ebc8]/40 to-gold/20 p-6 sm:p-8 rounded-[1.5rem] border border-gold/50 shadow-sm flex items-start gap-4 sm:gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/20 rounded-full blur-3xl"></div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-white rounded-full flex items-center justify-center shadow-md border border-gold/40 relative z-10">
              <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-gold" />
            </div>
            <div className="relative z-10">
              <h4 className="text-maroon font-bold text-lg sm:text-xl mb-1 uppercase tracking-wider">Mandir Setu Tip</h4>
              <p className="text-maroon-darker/80 text-lg sm:text-xl font-medium">{dham.mandirSetuTip}</p>
            </div>
          </div>
        </section>
      )}

      {/* VISITOR INFORMATION (Arrays) */}
      {(dham.bestTimeToVisit?.length > 0 || dham.placesToVisitNear?.length > 0 || dham.majorFestivals?.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {dham.bestTimeToVisit?.length > 0 && (
              <div className="bg-white p-6 rounded-[2rem] border border-gold/30 shadow-lg relative">
                <div className="w-12 h-12 bg-[#fcf7ed] rounded-full flex items-center justify-center mb-4 border border-gold/40">
                  <Clock className="w-6 h-6 text-gold" />
                </div>
                <h4 className="text-xl font-bold text-maroon mb-4 uppercase tracking-wider">Best Time to Visit</h4>
                <ul className="space-y-3">
                  {dham.bestTimeToVisit.map((time, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-maroon-darker/80 font-medium">
                      <div className="w-2 h-2 rounded-full bg-gold mt-2 shrink-0"></div>
                      <span>{time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {dham.majorFestivals?.length > 0 && (
              <div className="bg-white p-6 rounded-[2rem] border border-gold/30 shadow-lg relative">
                <div className="w-12 h-12 bg-[#fcf7ed] rounded-full flex items-center justify-center mb-4 border border-gold/40">
                  <Calendar className="w-6 h-6 text-gold" />
                </div>
                <h4 className="text-xl font-bold text-maroon mb-4 uppercase tracking-wider">Major Festivals</h4>
                <ul className="space-y-3">
                  {dham.majorFestivals.map((fest, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-maroon-darker/80 font-medium">
                      <div className="w-2 h-2 rounded-full bg-gold mt-2 shrink-0"></div>
                      <span>{fest}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {dham.placesToVisitNear?.length > 0 && (
              <div className="bg-white p-6 rounded-[2rem] border border-gold/30 shadow-lg relative md:col-span-1">
                <div className="w-12 h-12 bg-[#fcf7ed] rounded-full flex items-center justify-center mb-4 border border-gold/40">
                  <Navigation className="w-6 h-6 text-gold" />
                </div>
                <h4 className="text-xl font-bold text-maroon mb-4 uppercase tracking-wider">Places Near By</h4>
                <ul className="space-y-3">
                  {dham.placesToVisitNear.map((place, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-maroon-darker/80 font-medium">
                      <div className="w-2 h-2 rounded-full bg-gold mt-2 shrink-0"></div>
                      <span>{place}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </section>
      )}

      {/* Sevayen Aur Anushthan Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
         <div className="text-center mb-12">
           <h2 className="text-3xl sm:text-5xl font-serif text-maroon mb-4 uppercase tracking-wider">Sevayen Aur Anushthan</h2>
           <p className="text-maroon-darker/70 font-serif italic text-lg">Explore nearby services and offerings</p>
         </div>
         <RelatedDirectoryTabs dhamId={id} />
      </section>

      {/* Gallery Section */}
      {dham.gallery && dham.gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center mb-12">
             <h2 className="text-3xl sm:text-5xl font-serif text-maroon mb-4 uppercase tracking-wider">Gallery</h2>
             <p className="text-maroon-darker/70 font-serif italic text-lg">Glimpses of the divine abode</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dham.gallery.map((img, idx) => (
              <div key={idx} className="h-64 rounded-2xl overflow-hidden shadow-lg border border-gold/20 group">
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
          <div className="bg-white p-10 rounded-3xl border border-gold/30 shadow-lg relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-2xl font-serif text-maroon mb-6 uppercase tracking-wider border-b border-gold/20 pb-4">How To Reach</h3>
               <ul className="space-y-6 text-maroon-darker/80">
                 {dham.howToReach?.air ? (
                   <li className="flex items-start gap-4">
                     <span className="text-2xl p-3 bg-premium rounded-full text-maroon border border-gold/20">✈️</span>
                     <div><h4 className="font-bold text-maroon mb-1">By Air</h4><p>{dham.howToReach.air}</p></div>
                   </li>
                 ) : null}
                 {dham.howToReach?.train ? (
                   <li className="flex items-start gap-4">
                     <span className="text-2xl p-3 bg-premium rounded-full text-maroon border border-gold/20">🚆</span>
                     <div><h4 className="font-bold text-maroon mb-1">By Train</h4><p>{dham.howToReach.train}</p></div>
                   </li>
                 ) : null}
                 {dham.howToReach?.bus ? (
                   <li className="flex items-start gap-4">
                     <span className="text-2xl p-3 bg-premium rounded-full text-maroon border border-gold/20">🚌</span>
                     <div><h4 className="font-bold text-maroon mb-1">By Road</h4><p>{dham.howToReach.bus}</p></div>
                   </li>
                 ) : null}
               </ul>
             </div>
             <div className="absolute -bottom-10 -right-10 text-9xl opacity-5">🗺️</div>
          </div>

          {/* Contact */}
          <div className="bg-maroon p-10 rounded-3xl border border-gold/30 shadow-lg relative overflow-hidden text-white">
             <div className="relative z-10">
               <h3 className="text-2xl font-serif text-gold mb-6 uppercase tracking-wider border-b border-gold/20 pb-4">Contact Info</h3>
               <ul className="space-y-6 text-premium/90">
                 {dham.contact?.phone ? (
                   <li className="flex items-center gap-4">
                     <span className="text-2xl p-3 bg-black/20 rounded-full text-gold border border-gold/20">📞</span>
                     <span className="text-lg">{dham.contact.phone}</span>
                   </li>
                 ) : null}
                 {dham.contact?.email ? (
                   <li className="flex items-center gap-4">
                     <span className="text-2xl p-3 bg-black/20 rounded-full text-gold border border-gold/20">✉️</span>
                     <span className="text-lg">{dham.contact.email}</span>
                   </li>
                 ) : null}
                 {dham.contact?.website ? (
                   <li className="flex items-center gap-4">
                     <span className="text-2xl p-3 bg-black/20 rounded-full text-gold border border-gold/20">🌐</span>
                     <a href={dham.contact.website} target="_blank" rel="noreferrer" className="text-lg text-gold hover:underline">Visit Official Website</a>
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
        <div className="bg-maroon rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h3 className="text-gold text-lg font-serif tracking-widest mb-2">॥ ॐ शिवाय नमः ॥</h3>
            <h2 className="text-3xl sm:text-5xl font-serif mb-6 leading-tight">Apni Yatra Ki Yojana Banayein</h2>
            <p className="text-premium/80 leading-relaxed font-light mb-8">
              Darshan timings, online puja booking aur sampoorna yatra ki jankari yahan uplabdh hai.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link to="/gallery" className="px-8 py-3.5 bg-gold hover:bg-[#c29b26] text-maroon-darker font-bold rounded-full transition-all shadow-md active:scale-95 text-sm sm:text-base cursor-pointer">Yatra ki jankari len</Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
      </section>

    </div>
  );
}
