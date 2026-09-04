import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSect, setSelectedSect] = useState('all');
  const [temples, setTemples] = useState([]);
  const [loadingTemples, setLoadingTemples] = useState(true);
  const [dhams, setDhams] = useState([]);
  const [loadingDhams, setLoadingDhams] = useState(true);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  const heroImages = ['/hero/img2.jpg', '/hero/img4.jpg', '/hero/img5.jpg', '/hero/img6.jpg'];
  // Dark overlay transitioning into cream background
  const gradient = 'from-[#3a0d0a]/90 via-[#791916]/70 to-[#fdfbf7]';
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
        setEvents(res.data);
      } catch (err) {
        console.error('Failed to fetch events', err);
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-[#fdfbf7] min-h-screen text-[#3a0d0a] font-sans pb-20"
    >
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex flex-col justify-center items-center pt-16">
        {heroImages.map((img, idx) => (
          <div key={img} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${!showIntro && idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <img src={img} alt={`Hero slide ${idx + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 z-10 bg-gradient-to-b ${gradient} pointer-events-none transition-opacity duration-1000 ${showIntro ? 'opacity-100' : 'opacity-100'}`}></div>
        
        {/* Intro Loading Icon */}
        <div className={`absolute inset-0 z-30 flex items-center justify-center pointer-events-none transition-opacity duration-1000 ${showIntro ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative flex flex-col items-center">
             <div className="absolute inset-0 blur-[60px] bg-[#d4af37]/30 rounded-full animate-pulse"></div>
             {introIcon}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 w-full max-w-5xl mt-[-80px]">
          {/* <h2 className="text-[#d4af37] text-lg sm:text-xl md:text-2xl font-serif tracking-widest mb-4">॥ ॐ श्री गणेशाय नमः ॥</h2> */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white mb-6 drop-shadow-xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Discover India's Sacred <br />
            <span className="text-[#d4af37]">Heritage & Pilgrimages</span>
          </h1>
          <p className="text-sm sm:text-lg text-[#fdfbf7] max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow-md font-light">
            Plan your complete yatra with verified local services. Book ritual priests, find cozy Dharamshalas, secure transport, and receive holy Prasad delivered straight to your home.
          </p>

          {/* Integrated Search Bar */}
          <div className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur rounded-full p-2 flex items-center shadow-2xl border border-[#d4af37]/30">
            <span className="pl-6 text-[#791916] text-xl">🔍</span>
            <input type="text" placeholder="Search temples, dhams (e.g. Kedarnath, Kashi)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent border-none text-[#3a0d0a] placeholder-[#791916]/50 py-3 px-4 focus:outline-none text-base sm:text-lg" />
            <Link to="/gallery" className="px-8 py-3.5 bg-[#d4af37] hover:bg-[#c29b26] text-[#3a0d0a] font-bold rounded-full text-base transition-colors cursor-pointer shrink-0 shadow-md">
              Search
            </Link>
          </div>
        </div>

        {/* Overlapping Info Cards */}
        <div className="absolute bottom-0 translate-y-1/2 left-0 right-0 z-30 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {infoCards.map((card, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-xl shadow-[#791916]/5 border border-[#d4af37]/20 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-full bg-[#fdfbf7] flex items-center justify-center text-2xl border border-[#d4af37]/30 shrink-0 text-[#791916]">
                  {card.icon}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-[#791916] text-lg">{card.title}</h4>
                  <p className="text-sm text-[#791916]/70 leading-tight mt-1">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-40 flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Sidebar Filter */}
        <aside className="w-full md:w-72 sticky top-24 shrink-0 z-40 bg-white p-6 rounded-3xl shadow-xl shadow-[#791916]/5 border border-[#d4af37]/20">
          <h3 className="text-xl font-serif text-[#791916] mb-6 border-b border-[#d4af37]/20 pb-4">Explore Paths</h3>
          <div className="flex flex-col gap-3">
            {sects.map(sect => (
              <button 
                key={sect.id} 
                onClick={() => setSelectedSect(sect.id)}
                className={`flex items-center gap-4 w-full text-left px-5 py-3.5 rounded-2xl transition-all border ${selectedSect === sect.id ? 'bg-[#791916] border-[#791916] text-[#fdfbf7] shadow-lg shadow-[#791916]/20' : 'bg-[#fdfbf7] border-transparent text-[#3a0d0a] hover:bg-[#d4af37]/10 hover:border-[#d4af37]/30'}`}
              >
                <span className="text-2xl">{sect.icon}</span>
                <span className="font-serif font-semibold text-lg">{sect.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 w-full min-w-0">
          
          {/* Upcoming Events Section */}
          <section className="mb-24">
            <div className="text-center md:text-left mb-10 flex flex-col md:flex-row md:items-end justify-between">
              <div>
                <h2 className="text-3xl sm:text-5xl font-serif text-[#791916] mb-2">Upcoming Events</h2>
                <p className="text-[#3a0d0a]/70 font-serif italic text-lg">Celebrate the divine moments with us</p>
              </div>
              <Link to="/events" className="hidden md:inline-block text-[#d4af37] font-semibold hover:text-[#791916] transition-colors mt-4 md:mt-0">View All Events &rarr;</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {loadingEvents ? (
                <div className="col-span-full flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#d4af37]"></div>
                </div>
              ) : events.length === 0 ? (
                <div className="col-span-full text-center text-[#791916]/70 font-serif py-10">No upcoming events found.</div>
              ) : (
                events.slice(0, 3).map((event) => (
                  <div key={event._id} className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-[#791916]/5 border border-[#d4af37]/20 group hover:shadow-xl transition-all">
                    <div className="h-48 overflow-hidden relative">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#791916]/90 to-transparent p-4 pt-10">
                         <div className="text-[#d4af37] text-xs font-bold uppercase tracking-wider">{event.date}</div>
                         <h3 className="text-xl font-serif text-white truncate" title={event.title}>{event.title}</h3>
                      </div>
                    </div>
                    <div className="p-4 bg-[#fdfbf7]">
                      <div className="flex items-center text-[#791916]/80 text-sm"><span className="mr-2">📍</span> <span className="truncate" title={event.location}>{event.location}</span></div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="text-center mt-8 md:hidden">
               <Link to="/events" className="inline-block px-8 py-3 border border-[#791916] text-[#791916] font-serif hover:bg-[#791916] hover:text-white rounded-full transition-colors">View All Events</Link>
            </div>
          </section>

          {/* Decorative Divider */}
          <div className="mb-16 flex justify-center text-[#d4af37]">
             <span className="text-2xl">▲</span>
          </div>

          {/* Sacred Dhams Section */}
          <section className="mb-24">
            <div className="text-center md:text-left mb-10 flex flex-col md:flex-row md:items-end justify-between">
              <div>
                <h2 className="text-3xl sm:text-5xl font-serif text-[#791916] mb-2">Sacred Dhams</h2>
                <p className="text-[#3a0d0a]/70 font-serif italic text-lg">Explore the abodes of the divine</p>
              </div>
              <Link to="/dhams" className="hidden md:inline-block text-[#d4af37] font-semibold hover:text-[#791916] transition-colors mt-4 md:mt-0">View All Dhams &rarr;</Link>
            </div>
            {loadingDhams ? (
              <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#d4af37]"></div></div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {dhams.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || (d.location?.city || '').toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4).map((dham) => (
                    <div key={dham._id} className="bg-white rounded-[2rem] overflow-hidden shadow-lg shadow-[#791916]/5 border border-[#d4af37]/20 group flex flex-col hover:-translate-y-1 transition-transform">
                      <div className="h-48 overflow-hidden relative shrink-0">
                        <img src={dham.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(dham.name)}&background=791916&color=d4af37`} alt={dham.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dham.name)}&background=791916&color=d4af37` }} />
                        <div className="absolute top-4 right-4 bg-white/95 text-[#791916] text-xs font-bold px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider">{dham.status === 'active' ? 'Verified' : dham.status}</div>
                      </div>
                      <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-white to-[#fdfbf7]">
                        <h3 className="text-2xl font-serif text-[#791916] mb-2 truncate" title={dham.name}>{dham.name}</h3>
                        <div className="flex items-center text-[#3a0d0a]/60 text-sm mb-6"><span className="mr-2">📍</span> {dham.location?.city || 'Unknown'}, {dham.location?.state || 'India'}</div>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#d4af37]/20">
                          <div className="text-sm truncate mr-2 text-[#3a0d0a]/80"><span className="text-[#3a0d0a]/50">Deity: </span><span className="font-serif italic text-[#791916]">{dham.mainDeity || 'N/A'}</span></div>
                          <Link to={`/dham/${dham._id}`} className="px-5 py-2 bg-[#d4af37]/10 text-[#791916] hover:bg-[#d4af37] hover:text-[#3a0d0a] rounded-full text-sm font-semibold transition-colors shrink-0">View</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                  {dhams.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || (d.location?.city || '').toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && !loadingDhams && (
                     <div className="col-span-full text-center py-10 text-[#3a0d0a]/50 italic font-serif">No dhams found matching your search.</div>
                  )}
                </div>
                <div className="text-center mt-8 md:hidden">
                   <Link to="/dhams" className="inline-block px-8 py-3 border border-[#791916] text-[#791916] font-serif hover:bg-[#791916] hover:text-white rounded-full transition-colors">View All Dhams</Link>
                </div>
              </>
            )}
          </section>

          {/* Decorative Divider */}
          <div className="mb-16 flex justify-center text-[#d4af37]">
             <span className="text-2xl">▲</span>
          </div>

          {/* Sacred Temples Section */}
          <section className="mb-24">
            <div className="text-center md:text-left mb-10 flex flex-col md:flex-row md:items-end justify-between">
              <div>
                <h2 className="text-3xl sm:text-5xl font-serif text-[#791916] mb-2">Sacred Temples</h2>
                <p className="text-[#3a0d0a]/70 font-serif italic text-lg">Discover the heritage of our temples</p>
              </div>
              <Link to="/mandirs" className="hidden md:inline-block text-[#d4af37] font-semibold hover:text-[#791916] transition-colors mt-4 md:mt-0">View All Temples &rarr;</Link>
            </div>
            {loadingTemples ? (
              <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#d4af37]"></div></div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {temples.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || (t.location?.city || '').toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4).map((temple) => (
                    <div key={temple._id} className="bg-white rounded-[2rem] overflow-hidden shadow-lg shadow-[#791916]/5 border border-[#d4af37]/20 group flex flex-col hover:-translate-y-1 transition-transform">
                      <div className="h-48 overflow-hidden relative shrink-0">
                        <img src={temple.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(temple.name)}&background=791916&color=d4af37`} alt={temple.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(temple.name)}&background=791916&color=d4af37` }} />
                        <div className="absolute top-4 right-4 bg-white/95 text-[#791916] text-xs font-bold px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider">{temple.status === 'active' ? 'Verified' : temple.status}</div>
                      </div>
                      <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-white to-[#fdfbf7]">
                        <h3 className="text-2xl font-serif text-[#791916] mb-2 truncate" title={temple.name}>{temple.name}</h3>
                        <div className="flex items-center text-[#3a0d0a]/60 text-sm mb-6"><span className="mr-2">📍</span> {temple.location?.city || 'Unknown'}, {temple.location?.state || 'India'}</div>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#d4af37]/20">
                          <div className="text-sm truncate mr-2 text-[#3a0d0a]/80"><span className="text-[#3a0d0a]/50">Deity: </span><span className="font-serif italic text-[#791916]">{temple.mainDeity || 'N/A'}</span></div>
                          <Link to={`/mandir/${temple._id}`} className="px-5 py-2 bg-[#d4af37]/10 text-[#791916] hover:bg-[#d4af37] hover:text-[#3a0d0a] rounded-full text-sm font-semibold transition-colors shrink-0">View</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                  {temples.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || (t.location?.city || '').toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && !loadingTemples && (
                     <div className="col-span-full text-center py-10 text-[#3a0d0a]/50 italic font-serif">No temples found matching your search.</div>
                  )}
                </div>
                <div className="text-center mt-8 md:hidden">
                   <Link to="/mandirs" className="inline-block px-8 py-3 border border-[#791916] text-[#791916] font-serif hover:bg-[#791916] hover:text-white rounded-full transition-colors">View All Temples</Link>
                </div>
              </>
            )}
          </section>

          {/* Decorative Divider */}
          <div className="mb-16 flex justify-center text-[#d4af37]">
             <span className="text-2xl">▲</span>
          </div>

          {/* Services Section */}
          <section className="mb-24">
            <div className="text-center md:text-left mb-10">
              <h2 className="text-3xl sm:text-5xl font-serif text-[#791916] mb-2">Sevayein Aur Anushthan</h2>
              <p className="text-[#3a0d0a]/70 font-serif italic text-lg">Physical and virtual offerings facilitated by local Dham Sevaks</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {services.map((srv, idx) => (
                <div key={idx} className="bg-white border border-[#d4af37]/20 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-[#791916]/10 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-[#fdfbf7] rounded-full border border-[#d4af37]/30 flex items-center justify-center text-2xl mb-6 text-[#791916]">{srv.icon}</div>
                  <h3 className="text-xl font-serif text-[#791916] mb-3">{srv.title}</h3>
                  <p className="text-sm text-[#3a0d0a]/70 leading-relaxed mb-6 font-light">{srv.desc}</p>
                  <Link to="/gallery" className="text-xs font-bold text-[#d4af37] uppercase tracking-wider group-hover:text-[#791916] inline-block transition-colors">{srv.buttonText || 'Book Now →'}</Link>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

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
    </motion.div>
  );
}
