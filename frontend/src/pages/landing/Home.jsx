import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApplySevadarModal from '../../components/ApplySevadarModal';
import api from '../../api';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [selectedSect, setSelectedSect] = useState('all');

  // Custom Splash Screen Loader Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 3000); // 2 seconds
    return () => clearTimeout(timer);
  }, []);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [temples, setTemples] = useState([]);
  const [loadingTemples, setLoadingTemples] = useState(true);
  const [dhams, setDhams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mandir');
  const [isSevadarModalOpen, setIsSevadarModalOpen] = useState(false);
  const [loadingDhams, setLoadingDhams] = useState(true);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  
  // New state for right sidebar preview
  const [previewItem, setPreviewItem] = useState(null);

  const heroImages = ['/hero/img2.jpg', '/hero/img4.jpg', '/hero/img5.jpg', '/hero/img6.jpg'];
  // Dark overlay transitioning into cream background
  const gradient = 'from-maroon-darker/90 via-maroon/70 to-premium';
  const introIcon = (
    <div className="relative z-10 animate-pulse flex flex-col items-center justify-center">
      <img src="/vaishnav-tilak.svg" alt="Vaishnav Tilak" className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-xl" />
    </div>
  );

  const sects = [
    { id: 'all', label: 'All Paths', icon: '🕉️' },
    { id: 'vaishnava', label: 'Vaishnava', icon: '🦚' },
    { id: 'shiva', label: 'Shiva', icon: '🔱' },
    { id: 'shakti', label: 'Shakti', icon: '🌺' },
    { id: 'anya', label: 'Anya Devta', icon: '✨' }
  ];

  const statesList = ['All', 'Uttarakhand', 'Uttar Pradesh', 'Gujarat', 'Maharashtra', 'Madhya Pradesh', 'Tamil Nadu'];
  const citiesList = ['All', 'Varanasi', 'Haridwar', 'Rishikesh', 'Mathura', 'Dwarka', 'Somnath', 'Ujjain'];

  useEffect(() => {
    const introTimer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);
    return () => clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    if (showIntro) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [showIntro, heroImages.length]);

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        setLoadingTemples(true);
        const url = selectedSect === 'all' ? '/mandirs?independent=true' : `/mandirs?sect=${selectedSect}&independent=true`;
        const res = await api.get(url);
        const data = res.data;
        if (Array.isArray(data)) setTemples(data);
        else if (data.data) setTemples(data.data);
        else if (data.mandirs) setTemples(data.mandirs);
      } catch (err) {
        console.error('Failed to fetch temples', err);
      } finally {
        setLoadingTemples(false);
      }
    };

    const fetchDhams = async () => {
      try {
        setLoadingDhams(true);
        const url = selectedSect === 'all' ? '/dhams' : `/dhams?sect=${selectedSect}`;
        const res = await api.get(url);
        const data = res.data;
        if (Array.isArray(data)) setDhams(data);
        else if (data.data) setDhams(data.data);
        else if (data.dhams) setDhams(data.dhams);
      } catch (err) {
        console.error('Failed to fetch dhams', err);
      } finally {
        setLoadingDhams(false);
      }
    };

    fetchTemples();
    fetchDhams();
  }, [selectedSect]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        const res = await api.get('/events');
        const data = res.data;
        if (Array.isArray(data)) setEvents(data);
        else if (data.data) setEvents(data.data);
        else if (data.events) setEvents(data.events);
        else setEvents([]);
      } catch (err) {
        console.error('Failed to fetch events', err);
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  const services = [
    { icon: '🪔', title: 'Puja Booking', desc: 'Book verified pandits for physical rituals or live virtual pujas with sankalp details.' },
    { icon: '📦', title: 'Authentic Prasad', desc: 'Order holy Prasad directly from prominent shrines, shipped fresh and packaged securely.', buttonText: 'Buy Now →' },
    { icon: '🛕', title: 'Hotel,Ashram & Dharamshala', desc: 'Find clean, safe hotels, ashrams and dharamshalas and stays near the temple gates, curated by local Dham sevak.' },
    { icon: '🚌', title: 'Yatra Booking', desc: 'Book complete pilgrimage packages, including transportation, stays, and guided tours.' },
    { icon: '🧳', title: 'Tour & Travel', desc: 'Pre-book your travels, local cabs, and guided tours for a hassle-free pilgrimage experience.' },
    { icon: '🛍️', title: 'E-commerce Store', desc: 'Buy authentic temple products, religious items, and souvenirs directly from the temple.', buttonText: 'Shop Now →' }
  ];

  const infoCards = [
    { icon: '🌞', title: 'Daily Darshan', desc: '4:00 AM - 12:00 PM, 4:00 PM - 10:30 PM' },
    { icon: '🌸', title: 'Aarti', desc: 'Mangala Aarti, Shringar Aarti, Sandhya Aarti' },
    { icon: '🙏', title: 'Darshan', desc: 'Free Entry For All Devotees' }
  ];

  const handlePreview = async (item, itemType) => {
    try {
      setPreviewItem({ ...item, itemType, isLoading: true });
      const url = itemType === 'mandir' ? `/mandirs/${item._id}` : `/dhams/${item._id}`;
      const res = await api.get(url);
      const data = res.data.data || res.data;
      setPreviewItem({ ...data, itemType, isLoading: false });
    } catch (err) {
      console.error('Failed to fetch full details', err);
      setPreviewItem({ ...item, itemType, isLoading: false });
    }
  };

  return (
    <>
      {/* Thematic Initial Loader (Splash Screen) */}
      <AnimatePresence>
        {isInitialLoading && (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-premium flex flex-col items-center justify-center"
          >
            <div className="relative flex items-center justify-center mb-10 w-60 h-60">
              {/* Spinning Mandala Rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-60 h-60 absolute inset-0 m-auto rounded-full border-[3px] border-dashed border-gold/60"
              />
         
              
              <img src="/logo1.png" alt="Mandir Setu" className="w-60 h-60 object-contain relative z-10" />
            </div>

            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-3xl font-serif text-maroon uppercase tracking-[0.3em] font-bold"
            >
              Mandir Setu
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-gold text-sm uppercase tracking-widest mt-2 font-medium"
            >
              Awakening The Divine
            </motion.p>
   
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-premium min-h-screen overflow-x-hidden text-maroon-darker font-sans pb-20 pt-24">
      
      {/* Top Header Section - Full Width */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center flex flex-col items-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-serif text-maroon mb-6 leading-tight uppercase tracking-wider"
          initial="hidden"
          animate={isInitialLoading ? "hidden" : "visible"}
          variants={{
            hidden: { opacity: 1 },
            visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
          }}
        >
          {["Discover", "India's", "Sacred,", "Heritage", "&", "Pilgrimages"].map((word, index) => {
            const isSacred = word === "Sacred,";
            const cleanWord = word.replace(',', '');
            return (
              <span key={`hword-${index}`}>
                <span className="inline-block whitespace-nowrap">
                  {cleanWord.split('').map((char, cIndex) => (
                    <motion.span key={`hchar-${cIndex}`} className="inline-block" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 12, stiffness: 100 } } }}>
                      {char}
                    </motion.span>
                  ))}
                </span>
                {isSacred ? <br className="hidden md:block" /> : ' '}
              </span>
            );
          })}
        </motion.h1>
        
        <motion.p 
          className="text-maroon-darker/80 text-base md:text-lg max-w-3xl font-medium leading-relaxed mb-8"
          initial="hidden"
          animate={isInitialLoading ? "hidden" : "visible"}
          variants={{
            hidden: { opacity: 1 },
            visible: { opacity: 1, transition: { staggerChildren: 0.01, delayChildren: 0.6 } }
          }}
        >
          {"Plan your complete yatra with verified local services. Book ritual priests, find cozy Dharamshalas, secure transport, and receive holy Prasad delivered straight to your home.".split(' ').map((word, wIndex) => (
            <span key={`pword-${wIndex}`}>
              <span className="inline-block whitespace-nowrap">
                {word.split('').map((char, cIndex) => (
                  <motion.span key={`pchar-${cIndex}`} className="inline-block" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 12, stiffness: 100 } } }}>
                    {char}
                  </motion.span>
                ))}
              </span>
              {' '}
            </span>
          ))}
        </motion.p>

        {/* Integrated Search Bar */}
        <motion.div 
          className="w-full max-w-3xl bg-white/95 backdrop-blur rounded-full p-2 flex items-center shadow-xl shadow-maroon/10 border border-gold/30 mx-auto"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={isInitialLoading ? { opacity: 0, scale: 0.9, y: 20 } : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2, type: 'spring', stiffness: 100 }}
        >
          <span className="pl-5 text-maroon text-xl">🔍</span>
          <input type="text" placeholder="Search temples, dhams (e.g. Kedarnath, Kashi)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent border-none text-maroon-darker placeholder-maroon/50 py-3 px-4 focus:outline-none text-base md:text-lg" />
          <Link to="/gallery" className="px-8 py-3 bg-gold hover:bg-[#c29b26] text-maroon-darker font-bold rounded-full text-base transition-colors cursor-pointer shrink-0 shadow-sm">
            Search
          </Link>
        </motion.div>
      </div>

      {/* Main Content with 3-Column Layout */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* LEFT COLUMN: Sidebar Filter, Quick Info & Events */}
        <aside className="w-full lg:w-72 xl:w-80 flex flex-col gap-6 shrink-0 z-40 sticky top-28 max-h-[calc(100vh-120px)] overflow-y-auto overflow-x-hidden pr-1 pb-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d4af37 transparent' }}>
          
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-maroon/5 border border-gold/20">
            <h3 className="text-xl font-serif text-maroon mb-6 border-b border-gold/20 pb-4">View By</h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-bold text-maroon-darker/50 uppercase tracking-widest mb-3">Category</h4>
              <div className="flex flex-col gap-2">
                {sects.map(sect => (
                  <button 
                    key={sect.id} 
                    onClick={() => setSelectedSect(sect.id)}
                    className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-xl transition-all border ${selectedSect === sect.id ? 'bg-maroon border-maroon text-premium shadow-md shadow-maroon/20' : 'bg-premium border-transparent text-maroon-darker hover:bg-gold/10 hover:border-gold/30'}`}
                  >
                    <span className="text-xl">{sect.icon}</span>
                    <span className="font-serif font-medium text-base">{sect.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-bold text-maroon-darker/50 uppercase tracking-widest mb-3">State</h4>
              <select 
                value={selectedState} 
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-premium border border-gold/30 text-maroon-darker rounded-xl px-4 py-2.5 focus:outline-none focus:border-maroon transition-colors"
              >
                {statesList.map(state => <option key={state} value={state === 'All' ? '' : state}>{state}</option>)}
              </select>
            </div>

            <div>
              <h4 className="text-sm font-bold text-maroon-darker/50 uppercase tracking-widest mb-3">City</h4>
              <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-premium border border-gold/30 text-maroon-darker rounded-xl px-4 py-2.5 focus:outline-none focus:border-maroon transition-colors"
              >
                {citiesList.map(city => <option key={city} value={city === 'All' ? '' : city}>{city}</option>)}
              </select>
            </div>
          </div>



        </aside>

        {/* MIDDLE COLUMN: Main Content Area */}
        <div className="flex-1 w-full min-w-0 flex flex-col gap-10">
          
          {/* Sacred Dhams Section */}
          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 border-b border-gold/20 pb-3">
              <div>
                <h2 className="text-2xl font-serif text-maroon mb-1">Sacred Dhams</h2>
                <p className="text-maroon-darker/70 font-serif italic text-sm">Explore the abodes of the divine</p>
              </div>
              <Link to="/dhams" className="hidden md:inline-block text-gold text-sm font-semibold hover:text-maroon transition-colors">View All &rarr;</Link>
            </div>
            {loadingDhams ? (
              <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {dhams.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || (d.location?.city || '').toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6).map((dham) => (
                  <div key={dham._id} className={`bg-white rounded-2xl overflow-hidden shadow-lg shadow-maroon/5 border group flex flex-col hover:-translate-y-1 transition-transform ${previewItem?._id === dham._id ? 'border-maroon ring-2 ring-maroon/20' : 'border-gold/20'}`}>
                    <div className="h-32 overflow-hidden relative shrink-0">
                      <img src={dham.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(dham.name)}&background=791916&color=d4af37`} alt={dham.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dham.name)}&background=791916&color=d4af37` }} />
                      <div className="absolute top-2 right-2 bg-white/95 text-maroon text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">{dham.status === 'active' ? 'Verified' : dham.status}</div>
                    </div>
                    <div className="p-3 flex flex-col flex-1 bg-gradient-to-b from-white to-premium">
                      <h3 className="text-lg font-serif text-maroon mb-1 truncate" title={dham.name}>{dham.name}</h3>
                      <div className="flex items-center text-maroon-darker/60 text-xs mb-3"><span className="mr-1">📍</span> <span className="truncate">{dham.location?.city || 'Unknown'}, {dham.location?.state || 'India'}</span></div>
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gold/20">
                        <Link 
                          to={`/dham/${dham._id}`}
                          className="w-full py-1.5 text-xs font-semibold rounded-full transition-colors text-center bg-gold/10 text-maroon hover:bg-gold hover:text-maroon-darker block"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Sacred Temples Section */}
          <section className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 border-b border-gold/20 pb-3">
              <div>
                <h2 className="text-2xl font-serif text-maroon mb-1">Sacred Temples</h2>
                <p className="text-maroon-darker/70 font-serif italic text-sm">Discover the heritage of our temples</p>
              </div>
              <Link to="/mandirs" className="hidden md:inline-block text-gold text-sm font-semibold hover:text-maroon transition-colors">View All &rarr;</Link>
            </div>
            {loadingTemples ? (
              <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {temples.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || (t.location?.city || '').toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6).map((temple) => (
                  <div key={temple._id} className={`bg-white rounded-2xl overflow-hidden shadow-lg shadow-maroon/5 border group flex flex-col hover:-translate-y-1 transition-transform ${previewItem?._id === temple._id ? 'border-maroon ring-2 ring-maroon/20' : 'border-gold/20'}`}>
                    <div className="h-32 overflow-hidden relative shrink-0">
                      <img src={temple.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(temple.name)}&background=791916&color=d4af37`} alt={temple.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(temple.name)}&background=791916&color=d4af37` }} />
                      <div className="absolute top-2 right-2 bg-white/95 text-maroon text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">{temple.status === 'active' ? 'Verified' : temple.status}</div>
                    </div>
                    <div className="p-3 flex flex-col flex-1 bg-gradient-to-b from-white to-premium">
                      <h3 className="text-lg font-serif text-maroon mb-1 truncate" title={temple.name}>{temple.name}</h3>
                      <div className="flex items-center text-maroon-darker/60 text-xs mb-3"><span className="mr-1">📍</span> <span className="truncate">{temple.location?.city || 'Unknown'}, {temple.location?.state || 'India'}</span></div>
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gold/20">
                        <Link 
                          to={`/mandir/${temple._id}`}
                          className="w-full py-1.5 text-xs font-semibold rounded-full transition-colors text-center bg-gold/10 text-maroon hover:bg-gold hover:text-maroon-darker block"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* RIGHT COLUMN: Quick Info & Events */}
        <aside className="w-full lg:w-80 xl:w-96 sticky top-28 shrink-0 z-40 flex flex-col gap-6 max-h-[calc(100vh-120px)] overflow-y-auto overflow-x-hidden pr-1 pb-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d4af37 transparent' }}>
          
          {/* Quick Info Section */}
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-maroon/5 border border-gold/20 relative overflow-hidden">
            <h3 className="text-lg font-serif text-maroon mb-4 border-b border-gold/20 pb-3 relative z-10">Quick Info</h3>
            <div className="flex flex-col gap-3 relative z-10">
              {infoCards.map((card, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-maroon/5 p-3 rounded-xl border border-maroon/10 hover:bg-maroon/10 transition-colors">
                  <span className="text-xl">{card.icon}</span>
                  <div>
                    <div className="text-sm font-bold text-maroon">{card.title}</div>
                    <div className="text-[10px] text-maroon-darker/70">{card.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events in Right Sidebar */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-maroon/5 border border-gold/20 sticky top-4">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gold/20">
              <h3 className="text-lg font-serif text-maroon">Upcoming Events</h3>
              <Link to="/events" className="text-gold text-xs font-semibold hover:text-maroon">All &rarr;</Link>
            </div>
            
            <div className="space-y-4">
              {loadingEvents ? (
                 <div className="flex justify-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold"></div></div>
              ) : events.length === 0 ? (
                <div className="text-center text-maroon/70 text-sm font-serif py-5">No events found.</div>
              ) : (
                events?.slice(0, 3).map((event) => (
                  <Link to={`/events/${event._id}`} key={event._id} className="group block">
                    <div className="flex gap-3 items-center">
                      <div className="bg-maroon/10 w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border border-maroon/20 group-hover:bg-maroon transition-colors">
                        <span className="text-[10px] font-bold text-maroon group-hover:text-gold uppercase tracking-wider leading-none mb-0.5">{new Date(event.startDate || event.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-lg font-bold text-maroon group-hover:text-white leading-none">{new Date(event.startDate || event.date).getDate()}</span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-sm font-bold text-maroon-darker truncate group-hover:text-maroon transition-colors">{event.title || event.name}</h4>
                        <p className="text-xs text-maroon/60 truncate mt-0.5">📍 {event.location?.city || 'Online'}</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

        </aside>

      </div>

      {/* Services Section Moved to Full Width Below 3-Column Layout */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
         <div className="text-center mb-10 border-b border-gold/20 pb-4">
           <motion.h2 
             className="text-3xl font-serif text-maroon mb-2"
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-100px" }}
             variants={{
               hidden: { opacity: 1 },
               visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
             }}
           >
             {"Services and Rituals".split(' ').map((word, wIndex) => (
                <span key={`srword-${wIndex}`}>
                  <span className="inline-block whitespace-nowrap">
                    {word.split('').map((char, cIndex) => (
                      <motion.span key={`srchar-${cIndex}`} className="inline-block" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 12, stiffness: 100 } } }}>
                        {char}
                      </motion.span>
                    ))}
                  </span>
                  {' '}
                </span>
             ))}
           </motion.h2>
           
           <motion.p 
             className="text-maroon-darker/70 font-serif italic text-base"
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-100px" }}
             variants={{
               hidden: { opacity: 1 },
               visible: { opacity: 1, transition: { staggerChildren: 0.015, delayChildren: 0.5 } }
             }}
           >
             {"Physical and virtual offerings facilitated by local Dham Sevaks".split(' ').map((word, wIndex) => (
               <span key={`srsubword-${wIndex}`}>
                 <span className="inline-block whitespace-nowrap">
                   {word.split('').map((char, cIndex) => (
                     <motion.span key={`srsubchar-${cIndex}`} className="inline-block" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 12, stiffness: 100 } } }}>
                       {char}
                     </motion.span>
                   ))}
                 </span>
                 {' '}
               </span>
             ))}
           </motion.p>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           {services.map((srv, idx) => {
             const cardColors = [
               'bg-gradient-to-br from-red-50 to-orange-100 text-red-900 hover:from-red-100 hover:to-orange-200',
               'bg-gradient-to-br from-emerald-50 to-teal-100 text-teal-900 hover:from-emerald-100 hover:to-teal-200',
               'bg-gradient-to-br from-purple-50 to-fuchsia-100 text-fuchsia-900 hover:from-purple-100 hover:to-fuchsia-200',
               'bg-gradient-to-br from-blue-50 to-indigo-100 text-indigo-900 hover:from-blue-100 hover:to-indigo-200',
               'bg-gradient-to-br from-rose-50 to-pink-100 text-rose-900 hover:from-rose-100 hover:to-pink-200',
               'bg-gradient-to-br from-amber-50 to-yellow-100 text-yellow-900 hover:from-amber-100 hover:to-yellow-200'
             ];
             const colorClass = cardColors[idx % cardColors.length];
             
             return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                className="h-full"
              >
                <div className={`h-full ${colorClass} rounded-3xl p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center text-center`}>
                  <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform shadow-sm">{srv.icon}</div>
                  <h3 className="text-xl font-serif font-bold mb-3 leading-tight">{srv.title}</h3>
                  <p className="text-sm opacity-80 leading-relaxed mb-6 font-medium flex-1">{srv.desc}</p>
                  <Link to="/gallery" className="text-sm font-bold uppercase tracking-wider group-hover:bg-white inline-block transition-colors rounded-full px-6 py-2.5 bg-white/60 shadow-sm hover:shadow-md">{srv.buttonText || 'Book Now →'}</Link>
                </div>
              </motion.div>
             );
           })}
         </div>
      </section>

      {/* Bulk/Group Booking Banner */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-gold/20 via-white to-gold/20 border border-gold/40 rounded-[2.5rem] p-8 md:p-12 shadow-lg shadow-gold/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
          
          <div className="flex-1 text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-maroon/10 text-maroon rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <span>🌟</span> New Service
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-maroon font-bold mb-4 leading-tight">
              Planning a Large Group Yatra?
            </h2>
            <p className="text-maroon-darker/80 text-base md:text-lg mb-6 max-w-2xl font-medium leading-relaxed">
              Seamlessly organize your pilgrimage for 100 to 1000+ devotees. We handle bulk accommodation, bhandara (food), large-scale transport, and dedicated pujaris so you can focus entirely on your devotion.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-semibold text-maroon-darker/70 mb-8">
              <span className="flex items-center gap-1.5"><span className="text-gold text-lg">✓</span> Hotels/Ashrams</span>
              <span className="flex items-center gap-1.5"><span className="text-gold text-lg">✓</span> Bhandara</span>
              <span className="flex items-center gap-1.5"><span className="text-gold text-lg">✓</span> Transport</span>
              <span className="flex items-center gap-1.5"><span className="text-gold text-lg">✓</span> VIP Darshan</span>
            </div>
            <Link 
              to="/group-booking" 
              className="inline-flex items-center justify-center px-8 py-3.5 bg-maroon hover:bg-maroon-darker text-white font-bold rounded-full transition-all shadow-md hover:shadow-xl active:scale-95 text-base"
            >
              Get a Custom Quote <span className="ml-2">→</span>
            </Link>
          </div>
          
          <div className="w-full md:w-1/3 flex justify-center relative z-10">
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              <div className="absolute inset-0 bg-gold/20 rounded-full animate-pulse blur-xl"></div>
              <img src="/logo1.png" alt="Group Yatra" className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </motion.div>
      </section>


      {/* CTA Section */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-10">
        <div className="bg-maroon rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h3 className="text-gold text-lg font-serif tracking-widest mb-2">॥ ॐ शिवाय नमः ॥</h3>
            <h2 className="text-3xl sm:text-5xl font-serif mb-6 leading-tight whitespace-nowrap">Become a Sevadar (Dham or Mandir)</h2>
            <p className="text-premium/80 leading-relaxed font-light mb-8">
              Join our spiritual community and help us manage temple affairs by serving as a dedicated Sevadar. Register your interest today and wait for admin approval.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button 
                onClick={() => setIsSevadarModalOpen(true)}
                className="px-8 py-3.5 bg-white text-maroon hover:bg-slate-100 font-bold rounded-full transition-all shadow-md active:scale-95 text-sm sm:text-base cursor-pointer"
              >
                Apply for Sevadar
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
      </section>
      
      <ApplySevadarModal 
        isOpen={isSevadarModalOpen} 
        onClose={() => setIsSevadarModalOpen(false)} 
      />
    </div>
    </>
  );
}
