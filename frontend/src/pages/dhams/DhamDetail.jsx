import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api';
import { MapPin, Phone, Mail, Globe, Sparkles, BookOpen, Clock, Users, Calendar, Star, Navigation, Lightbulb } from 'lucide-react';
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
        console.error('Failed to fetch dham details', err);
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
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-[#5a1617]"
        />
      </div>
    );
  }

  if (!dham) {
    return (
      <div className="min-h-screen pt-24 flex flex-col justify-center items-center bg-premium">
        <h2 className="text-3xl font-serif text-[#5a1617] mb-4">Dham Not Found</h2>
        <Link to="/dhams" className="text-[#dfba6b] font-semibold hover:underline transition-colors">Go back to all Dhams</Link>
      </div>
    );
  }

  return (
    <div className="bg-premium min-h-screen font-sans pb-0 text-maroon-darker selection:bg-[#dfba6b]/30 overflow-x-hidden">
      
      {/* 1. HERO SECTION (Dark Maroon with Side Image) */}
      <section className="relative w-full bg-[#5a1617] pt-28 pb-32 overflow-hidden border-b-[10px] border-[#dfba6b]">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#dfba6b]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#dfba6b]/30 bg-[#dfba6b]/10 mb-6">
                <Star className="w-4 h-4 text-[#dfba6b] fill-current" />
                <span className="text-[#dfba6b] text-xs font-bold tracking-widest uppercase">Mandir Setu Verified</span>
              </div>
              
              <div className="mb-4">
                 <span className="text-[#dfba6b] uppercase tracking-[0.2em] font-bold text-sm sm:text-base opacity-90">॥ जय श्री {dham.mainDeity || 'राम'} ॥</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-premium mb-6 tracking-wide drop-shadow-lg leading-tight uppercase" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                {dham.name}
              </h1>
              
              <p className="text-[#dfba6b] text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-10 font-light opacity-90">
                A sacred spiritual forum located in {dham.location?.city || 'India'}, renowned for its ancient origins and divine energy. Plan your darshan and experience inner peace.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6">
                 <button onClick={() => window.scrollTo({top: 850, behavior: 'smooth'})} className="px-8 py-3.5 bg-gradient-to-r from-[#dfba6b] via-[#f2d48c] to-[#dfba6b] text-[#5a1617] rounded-full font-bold shadow-[0_4px_20px_rgba(223,186,107,0.3)] hover:scale-105 transition-all duration-300 text-sm sm:text-base">
                   Darshan Timings
                 </button>
                 <Link to="/gallery" className="px-8 py-3.5 bg-transparent border-2 border-[#dfba6b] text-[#dfba6b] rounded-full font-bold hover:bg-[#dfba6b]/10 transition-colors duration-300 text-sm sm:text-base flex items-center gap-2">
                   View Gallery
                 </Link>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-5/12 relative flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden border-4 border-[#dfba6b]/20 shadow-[0_0_50px_rgba(223,186,107,0.15)] group">
                <img 
                   src={dham.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(dham.name)}&background=5a1617&color=dfba6b&size=1024`} 
                   alt={dham.name} 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#5a1617]/90 via-transparent to-transparent"></div>
                
              </div>
                
              {/* Floating Badge */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[320px] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border-2 border-[#dfba6b] z-20">
                <div className="flex justify-between items-center text-center divide-x divide-[#dfba6b]/30">
                  <div className="flex-1 px-2">
                    <p className="text-[10px] uppercase text-[#c09642] font-bold mb-1">Established</p>
                    <p className="text-[#5a1617] font-serif font-bold text-sm">{dham.establishedYear || 'Ancient'}</p>
                  </div>
                  <div className="flex-1 px-2">
                    <p className="text-[10px] uppercase text-[#c09642] font-bold mb-1">Status</p>
                    <p className="text-[#5a1617] font-serif font-bold text-sm capitalize">{dham.status || 'Active'}</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. FLOATING QUICK INFO BAR */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Main Deity */}
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.3}} className="bg-white rounded-2xl p-5 shadow-lg border border-[#dfba6b]/20 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[#c09642] text-xl">🌸</span>
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#c09642] font-bold">Main Deity</p>
            </div>
            <p className="text-[#5a1617] font-semibold text-sm sm:text-base leading-tight pl-8">{dham.mainDeity || 'N/A'}</p>
          </motion.div>

          {/* Location */}
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.4}} className="bg-white rounded-2xl p-5 shadow-lg border border-[#dfba6b]/20 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="text-[#c09642] w-5 h-5" />
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#c09642] font-bold">Location</p>
            </div>
            <p className="text-[#5a1617] font-semibold text-sm sm:text-base leading-tight pl-8 truncate">{dham.location?.city ? `${dham.location.city}, ${dham.location.state}` : 'India'}</p>
          </motion.div>

          {/* Timings */}
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.5}} className="bg-white rounded-2xl p-5 shadow-lg border border-[#dfba6b]/20 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-[#c09642] w-5 h-5" />
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#c09642] font-bold">Darshan</p>
            </div>
            <p className="text-[#5a1617] font-semibold text-sm sm:text-base leading-tight pl-8">{dham.schedule?.openTime ? `${dham.schedule.openTime} - ${dham.schedule.closeTime}` : 'N/A'}</p>
          </motion.div>

          {/* Website */}
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.6}} className="bg-white rounded-2xl p-5 shadow-lg border border-[#dfba6b]/20 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="text-[#c09642] w-5 h-5" />
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#c09642] font-bold">Website</p>
            </div>
            {dham.contact?.website ? (
              <a href={dham.contact.website} target="_blank" rel="noreferrer" className="text-[#5a1617] hover:text-[#dfba6b] font-semibold text-sm sm:text-base leading-tight pl-8 truncate">Visit Official Site</a>
            ) : (
              <p className="text-[#5a1617] font-semibold text-sm sm:text-base leading-tight pl-8">N/A</p>
            )}
          </motion.div>

        </div>
      </section>
      {/* 3. TWO-COLUMN: ABOUT & TIMINGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (flex-2): Religious Significance & About */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-transparent"
            >
              <div className="flex items-center gap-4 mb-4">
                <BookOpen className="text-[#c09642] w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                <h3 className="text-lg sm:text-xl font-serif text-[#5a1617] uppercase tracking-widest font-bold">
                  ABOUT THE DHAM
                </h3>
                <div className="h-[1px] bg-gradient-to-r from-[#dfba6b] to-transparent flex-1"></div>
              </div>
              <div className="text-[#5c4949] text-base sm:text-lg leading-relaxed text-justify font-medium">
                <p className="whitespace-pre-line">{dham.description || "Description not available for this dham."}</p>
              </div>
            </motion.div>

            {dham.religiousImportance && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-transparent"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Sparkles className="text-[#c09642] w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  <h3 className="text-lg sm:text-xl font-serif text-[#5a1617] uppercase tracking-widest font-bold">
                    RELIGIOUS SIGNIFICANCE
                  </h3>
                  <div className="h-[1px] bg-gradient-to-r from-[#dfba6b] to-transparent flex-1"></div>
                </div>
                <div className="text-[#5a1617] text-base sm:text-lg leading-relaxed font-medium italic whitespace-pre-line border-l-2 border-[#dfba6b] pl-4">
                  <p>"{dham.religiousImportance}"</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column (flex-1): Timings & Aarti */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-[#dfba6b]/30 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#dfba6b]/5 rounded-bl-full"></div>
              
              <h3 className="text-[#5a1617] font-serif text-lg font-bold tracking-widest uppercase mb-6 text-center border-b border-[#dfba6b]/30 pb-4">
                DARSHAN & AARTI TIMING
              </h3>
              
              <div className="space-y-4 mb-6">
                {dham.darshanTimings?.length > 0 ? (
                  dham.darshanTimings.map((dt, idx) => (
                    <div key={`dt-${idx}`} className="flex justify-between items-center border-b border-dashed border-[#dfba6b]/40 pb-2">
                      <span className="text-[#5c4949] font-medium">{dt.name || `Darshan ${idx + 1}`}</span>
                      <span className="text-[#5a1617] font-bold">{dt.fromTime} - {dt.toTime}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex justify-between items-center border-b border-dashed border-[#dfba6b]/40 pb-2">
                      <span className="text-[#5c4949] font-medium">Morning Darshan</span>
                      <span className="text-[#5a1617] font-bold">{dham.schedule?.openTime || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-dashed border-[#dfba6b]/40 pb-2">
                      <span className="text-[#5c4949] font-medium">Evening Darshan</span>
                      <span className="text-[#5a1617] font-bold">{dham.schedule?.closeTime || 'N/A'}</span>
                    </div>
                  </>
                )}
                
                {dham.aartiTimings?.length > 0 && dham.aartiTimings.map((at, idx) => (
                  <div key={`at-${idx}`} className={`flex justify-between items-center ${idx < dham.aartiTimings.length - 1 ? 'border-b border-dashed border-[#dfba6b]/40' : ''} pb-2`}>
                    <span className="text-[#5c4949] font-medium">{at.name || `Aarti ${idx + 1}`}</span>
                    <span className="text-[#5a1617] font-bold">{at.time}</span>
                  </div>
                ))}
              </div>
              
              <div className="w-full h-40 rounded-2xl overflow-hidden shadow-inner mt-4">
                <img 
                  src="https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/06/6e/b5/47.jpg" 
                  alt="Aarti Ceremony" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>

        </div>
      </section>



      {/* Decorative Diamond Separator */}
      <div className="flex justify-center mb-10">
        <div className="w-2 h-2 bg-[#dfba6b] rotate-45 shadow-[0_0_10px_#dfba6b]"></div>
      </div>

      {/* 4. SERVICES & OFFERINGS */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
      >
        <div className="text-center mb-8">
           <div className="flex items-center justify-center relative">
              <div className="h-[1px] bg-gradient-to-r from-transparent to-[#dfba6b] flex-1"></div>
              <h2 className="text-xl sm:text-2xl font-serif text-[#5a1617] uppercase tracking-widest px-4 relative z-10 font-bold">
                 SERVICES & OFFERINGS
              </h2>
              <div className="h-[1px] bg-gradient-to-l from-transparent to-[#dfba6b] flex-1"></div>
           </div>
           <p className="text-[#c09642] text-xs sm:text-sm mt-3 uppercase tracking-wider font-semibold">Information regarding services and offerings available at the dham.</p>
        </div>
        
        <div className="w-full">
          <RelatedDirectoryTabs dhamId={id} />
        </div>
      </motion.section>

      {/* 5. TWO-COLUMN: VISITOR INFO & HOW TO REACH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Visitor Information */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#fcf7ed] rounded-3xl p-6 sm:p-8 shadow-md border border-[#dfba6b]/30"
          >
             <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#dfba6b]/30">
               <div className="w-10 h-10 rounded-full border border-[#c09642] flex items-center justify-center shrink-0">
                 <span className="text-xl">🕉️</span>
               </div>
               <h3 className="text-lg sm:text-xl font-serif text-[#5a1617] uppercase tracking-widest font-bold">VISITOR INFORMATION</h3>
             </div>

             <div className="space-y-6">
                {dham.bestTimeToVisit?.length > 0 && (
                  <div>
                    <h4 className="text-[#c09642] font-bold uppercase text-sm mb-2">Best Time to Visit</h4>
                    <ul className="space-y-2">
                      {dham.bestTimeToVisit.map((time, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[#5c4949] font-medium text-sm sm:text-base">
                          <div className="w-4 h-4 mt-0.5"><Star className="w-3 h-3 text-[#dfba6b]" /></div>
                          <span>{time}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {dham.majorFestivals?.length > 0 && (
                  <div>
                    <h4 className="text-[#c09642] font-bold uppercase text-sm mb-2">Major Festivals</h4>
                    <ul className="space-y-2">
                      {dham.majorFestivals.map((fest, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[#5c4949] font-medium text-sm sm:text-base">
                          <div className="w-4 h-4 mt-0.5"><Star className="w-3 h-3 text-[#dfba6b]" /></div>
                          <span>{fest}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {dham.visitorInformation?.length > 0 && (
                  <div>
                    <h4 className="text-[#c09642] font-bold uppercase text-sm mb-2">Visitor Guide</h4>
                    <ul className="space-y-2">
                      {dham.visitorInformation.map((info, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[#5c4949] font-medium text-sm sm:text-base">
                          <div className="w-4 h-4 mt-0.5"><Star className="w-3 h-3 text-[#dfba6b]" /></div>
                          <span>{info}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
             </div>
          </motion.div>

          {/* Right: How to Reach */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
             <h3 className="text-lg sm:text-xl font-serif text-[#5a1617] uppercase tracking-widest font-bold mb-6 text-center lg:text-left">
               HOW TO REACH
             </h3>
             
             {dham.howToReach?.air && (
               <div className="bg-white rounded-2xl p-5 border border-[#dfba6b]/30 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#5a1617]/5 flex items-center justify-center shrink-0">
                     <span className="text-xl">✈️</span>
                  </div>
                  <div>
                     <h4 className="text-[#5a1617] font-bold uppercase text-sm mb-1">By Air</h4>
                     <p className="text-[#5c4949] text-sm">{dham.howToReach.air}</p>
                  </div>
               </div>
             )}
             {dham.howToReach?.train && (
               <div className="bg-white rounded-2xl p-5 border border-[#dfba6b]/30 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#5a1617]/5 flex items-center justify-center shrink-0">
                     <span className="text-xl">🚆</span>
                  </div>
                  <div>
                     <h4 className="text-[#5a1617] font-bold uppercase text-sm mb-1">By Train</h4>
                     <p className="text-[#5c4949] text-sm">{dham.howToReach.train}</p>
                  </div>
               </div>
             )}
             {dham.howToReach?.bus && (
               <div className="bg-white rounded-2xl p-5 border border-[#dfba6b]/30 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#5a1617]/5 flex items-center justify-center shrink-0">
                     <span className="text-xl">🚌</span>
                  </div>
                  <div>
                     <h4 className="text-[#5a1617] font-bold uppercase text-sm mb-1">By Road</h4>
                     <p className="text-[#5c4949] text-sm">{dham.howToReach.bus}</p>
                  </div>
               </div>
             )}
          </motion.div>

        </div>
      </section>

      {/* PLACES NEAR BY (MARQUEE) */}
      {dham.placesToVisitNear?.length > 0 && (
        <section className="w-full bg-[#5a1617] py-4 sm:py-6 mb-16 shadow-inner border-y border-[#dfba6b]/40 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3">
            <h3 className="text-sm sm:text-base font-serif text-[#dfba6b] uppercase tracking-widest font-bold">
               PLACES NEAR BY
            </h3>
          </div>
          <div className="w-full flex overflow-hidden whitespace-nowrap">
            <div className="flex animate-marquee cursor-pointer w-max">
              {dham.placesToVisitNear.map((place, idx) => (
                <span key={`p1-${idx}`} className="mx-8 inline-flex items-center gap-3 text-white font-medium text-lg tracking-wide">
                  <span className="text-[#dfba6b]">✦</span> {place}
                </span>
              ))}
              {/* Duplicate array for seamless infinite looping */}
              {dham.placesToVisitNear.map((place, idx) => (
                <span key={`p2-${idx}`} className="mx-8 inline-flex items-center gap-3 text-white font-medium text-lg tracking-wide">
                  <span className="text-[#dfba6b]">✦</span> {place}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Decorative Diamond Separator */}
      <div className="flex justify-center mb-10">
        <div className="w-2 h-2 bg-[#dfba6b] rotate-45 shadow-[0_0_10px_#dfba6b]"></div>
      </div>

      {/* 6. TWO-COLUMN: LOCATION MAP & CONTACT/TIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h3 className="text-xl sm:text-2xl font-serif text-[#5a1617] uppercase tracking-widest font-bold text-center mb-8">
           LOCATION & CONTACT
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-4 border border-[#dfba6b]/30 shadow-md relative h-[350px] sm:h-[400px]"
          >
             <div className="w-full h-full rounded-2xl overflow-hidden border border-[#dfba6b]/20 bg-[#fcf7ed]">
                {(() => {
                  let query = '';
                  if (dham.location?.coordinates && dham.location.coordinates.length >= 2) {
                    const lat = dham.location.coordinates[1];
                    const lng = dham.location.coordinates[0];
                    query = `${lat},${lng}`;
                  } else if (dham.location?.lat && dham.location?.lng) {
                    query = `${dham.location.lat},${dham.location.lng}`;
                  } else {
                    query = `${dham.name}, ${dham.location?.city || ''}`;
                  }
                  
                  return (
                    <iframe 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      scrolling="no" 
                      marginHeight="0" 
                      marginWidth="0" 
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      title="Temple Location Map"
                    ></iframe>
                  );
                })()}
             </div>
             <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md border border-[#dfba6b]/30 font-semibold text-[#5a1617] text-sm">
                Location Map
             </div>
          </motion.div>

          {/* Right: Contact & Tip */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
             {/* Contact Info Card */}
             <div className="bg-[#fcf7ed] rounded-3xl p-6 sm:p-8 border border-[#dfba6b]/30 shadow-md flex-1">
               <h4 className="text-[#5a1617] font-bold uppercase tracking-wider mb-6 pb-3 border-b border-[#dfba6b]/30">Contact Information</h4>
               <div className="space-y-4">
                 {dham.contact?.phone && (
                   <div className="flex items-center gap-4">
                     <Phone className="w-5 h-5 text-[#c09642]" />
                     <p className="text-[#5a1617] font-medium">{dham.contact.phone}</p>
                   </div>
                 )}
                 {dham.contact?.email && (
                   <div className="flex items-center gap-4">
                     <Mail className="w-5 h-5 text-[#c09642]" />
                     <p className="text-[#5a1617] font-medium">{dham.contact.email}</p>
                   </div>
                 )}
                 <div className="flex items-center gap-4">
                   <MapPin className="w-5 h-5 text-[#c09642] shrink-0" />
                   <p className="text-[#5a1617] font-medium text-sm">
                     {dham.location?.address ? dham.location.address : `${dham.location?.city || ''}, ${dham.location?.state || ''} ${dham.location?.zipCode || ''}`}
                   </p>
                 </div>
               </div>
             </div>

             {/* Tip Card */}
             {dham.mandirSetuTip && (
               <div className="bg-gradient-to-r from-premium to-[#fcf7ed] p-6 rounded-3xl border border-[#dfba6b]/40 shadow-sm relative overflow-hidden">
                 <div className="absolute -right-4 -top-4 text-6xl opacity-[0.05]">💡</div>
                 <h4 className="text-[#c09642] font-bold uppercase text-xs mb-2">Mandir Setu Tip</h4>
                 <p className="text-[#5a1617] font-medium text-sm sm:text-base leading-relaxed italic">
                   "{dham.mandirSetuTip}"
                 </p>
               </div>
             )}
          </motion.div>

        </div>
      </section>

      {/* Gallery Section */}
      {dham.gallery && dham.gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 mt-16" id="gallery">
          <div className="text-center mb-12">
             <h2 className="text-3xl sm:text-5xl font-serif text-[#5a1617] mb-4 uppercase tracking-wider">Gallery</h2>
             <p className="text-[#5a1617]/70 font-serif italic text-lg">Glimpses of the divine abode</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dham.gallery.map((img, idx) => (
              <div key={idx} className="h-64 rounded-2xl overflow-hidden shadow-lg border border-[#dfba6b]/20 group">
                 <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. BOTTOM CTA */}
      <section className="w-full bg-gradient-to-b from-[#5a1617] to-[#3d0b0d] py-16 text-center border-t-8 border-[#dfba6b]">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-[#dfba6b] text-sm uppercase tracking-widest font-bold mb-3">॥ जय श्री {dham.mainDeity || 'राम'} ॥</p>
          <h2 className="text-3xl sm:text-4xl font-serif text-premium uppercase tracking-wider mb-8 drop-shadow-md">
            START YOUR SPIRITUAL JOURNEY
          </h2>
          <p className="text-premium/80 text-sm sm:text-base font-light mb-10 max-w-xl mx-auto leading-relaxed">
            Plan your spiritual journey with complete information on darshan, aarti, and pooja bookings.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="px-8 py-3.5 bg-[#dfba6b] text-[#5a1617] rounded-full font-bold shadow-lg hover:scale-105 transition-all duration-300">
               Plan Journey
             </button>
             <Link to="/gallery" className="px-8 py-3.5 bg-transparent border-2 border-[#dfba6b] text-[#dfba6b] rounded-full font-bold hover:bg-[#dfba6b]/10 transition-colors duration-300">
               View Gallery
             </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
