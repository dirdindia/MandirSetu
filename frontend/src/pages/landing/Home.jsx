import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [temples, setTemples] = useState([]);
  const [loadingTemples, setLoadingTemples] = useState(true);
  const [dhams, setDhams] = useState([]);
  const [loadingDhams, setLoadingDhams] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    '/hero/img2.jpg',
    // '/hero/img3.jpg',
    '/hero/img4.jpg',
    '/hero/img5.jpg',
    '/hero/img6.jpg'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const res = await api.get('/mandirs');
        const data = res.data;
        if (Array.isArray(data)) {
          setTemples(data);
        } else if (data.data) {
          setTemples(data.data);
        } else if (data.mandirs) {
          setTemples(data.mandirs);
        }
      } catch (err) {
        console.error('Failed to fetch temples', err);
      } finally {
        setLoadingTemples(false);
      }
    };

    const fetchDhams = async () => {
      try {
        const res = await api.get('/dhams');
        const data = res.data;
        if (Array.isArray(data)) {
          setDhams(data);
        } else if (data.data) {
          setDhams(data.data);
        } else if (data.dhams) {
          setDhams(data.dhams);
        }
      } catch (err) {
        console.error('Failed to fetch dhams', err);
      } finally {
        setLoadingDhams(false);
      }
    };

    fetchTemples();
    fetchDhams();
  }, []);

  const services = [
    {
      icon: '🪔',
      title: 'Puja Bookings',
      desc: 'Book verified pandits for physical rituals or live virtual pujas with sankalp details.',
      color: 'from-orange-500/10 to-amber-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400',
    },

    {
      icon: '📦',
      title: 'Authentic Prasad',
      desc: 'Order holy Prasad directly from prominent shrines, shipped fresh and packaged securely.',
      color: 'from-orange-500/10 to-rose-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400',
      buttonText: 'Buy Now →',
    },

    {
      icon: '🛕',
      title: 'Hotels,Ashrams & Dharamshalas',
      desc: 'Find clean, safe hotels, ashrams and dharamshalas and stays near the temple gates, curated by local Dham sevak.',
      color: 'from-yellow-500/10 to-amber-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    },

    {
      icon: '🚌',
      title: 'Yatra Bookings',
      desc: 'Book complete pilgrimage packages, including transportation, stays, and guided tours.',
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
    },
    {
      icon: '🧳',
      title: 'Tour & Travels',
      desc: 'Pre-book your travels, local cabs, and guided tours for a hassle-free pilgrimage experience.',
      color: 'from-yellow-500/10 to-orange-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    },
    {
      icon: '🛍️',
      title: 'E-commerce Store',
      desc: 'Buy authentic temple products, religious items, and souvenirs directly from the temple.',
      color: 'from-rose-500/10 to-pink-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
      buttonText: 'Shop Now →',
    },


  ];

  const stats = [
    { number: '50+', label: 'Verified Temples' },
    { number: '1,200+', label: 'Certified Pujaris' },
    { number: '15,000+', label: 'Happy Pilgrims' },
    { number: '24/7', label: 'On-Ground Support' },
  ];

  const steps = [
    {
      num: '01',
      title: 'Temple Onboarding',
      desc: 'Super Admin registers a historic temple and hires a verified local Temple Agent.',
    },
    {
      num: '02',
      title: 'Vendor Verification',
      desc: 'The Agent meets local priests, ashram managers, and taxi drivers to register them on the app.',
    },
    {
      num: '03',
      title: 'Instant Booking',
      desc: 'Devotees browse services, read honest reviews, and book their custom yatra details securely.',
    },
    {
      num: '04',
      title: 'Safe Delivery & Support',
      desc: 'The Agent oversees on-ground services and couriers holy Prasad directly to remote customers.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      <section className="relative w-full overflow-visible bg-slate-50 dark:bg-slate-900 flex flex-col items-center">
        {/* Main Banner */}
        <div className="relative w-full h-[600px] md:h-[650px] -mt-16 pt-16">
          {/* Background Images Slider */}
          {heroImages.map((img, idx) => (
            <div
              key={img}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={img}
                alt={`Hero slide ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fae8d4] via-[#fae8d4]/90 to-transparent dark:from-slate-900 dark:via-slate-900/90 dark:to-transparent"></div>
          
          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center pb-24">
            <div className="max-w-2xl">
              <p className="text-sm md:text-sm font-bold text-slate-700 dark:text-slate-300 tracking-widest uppercase mb-3">Connecting Devotees With</p>
              <h1 className="text-5xl md:text-7xl font-serif text-[#3e2723] dark:text-white mb-4">
                SACRED TEMPLES
              </h1>
              <div className="w-16 h-1 bg-amber-700 dark:bg-amber-500 mb-6 rounded-full"></div>
              <p className="text-lg md:text-xl text-slate-800 dark:text-slate-200 font-medium mb-8">
                Discover Temples, Festivals,<br/>Sevas & Spiritual Services
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/mandirs" className="flex items-center gap-2 px-6 py-3 bg-[#1e293b] hover:bg-slate-800 text-white font-medium rounded-lg transition-colors shadow-lg">
                  <span className="text-xl">🏛️</span> Explore Temples
                </Link>
                <Link to="/donate" className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-orange-700 font-medium rounded-lg border border-orange-200 transition-colors shadow-lg">
                  <span className="text-xl text-orange-500">♡</span> Donate Now
                </Link>
              </div>
            </div>

            {/* Quote Box - Bottom Right */}
            <div className="absolute bottom-32 right-4 md:right-8 bg-[#1e293b]/90 backdrop-blur-md text-white p-6 rounded-2xl max-w-xs md:max-w-sm hidden sm:block shadow-2xl border border-slate-700/50">
              <p className="text-sm italic mb-3 font-medium">"The real asset of the whole world is spiritual knowledge."</p>
              <p className="text-xs text-orange-300 font-bold tracking-wide">- Srila Prabhupada</p>
            </div>
          </div>
        </div>

        {/* Overlapping Info Card */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-24 mb-10">
          <div className="relative overflow-hidden bg-[#fff9f0] dark:bg-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8 border-4 border-white dark:border-slate-700">
            {/* Watermark Background */}
            <div className="absolute inset-0 z-0 opacity-5 dark:opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
            
            {/* Left side: Avatar and Info */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:w-[45%]">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-40 h-40 md:w-44 md:h-44 rounded-full border-8 border-white dark:border-slate-700 overflow-hidden shadow-xl bg-orange-100">
                  {/* Placeholder for Srila Prabhupada Image */}
                   <img src="https://theharekrishnamovement.org/wp-content/uploads/2013/08/prabhupada.jpg" alt="Srila Prabhupada" className="w-full h-full object-fit" /> 
                </div>
                {/* Decorative Flowers (Placeholder emoji) */}
                {/* <div className="absolute -bottom-2 -right-2 text-4xl drop-shadow-md">🌼</div> */}
              </div>
              
              {/* Text Info */}
              <div className="text-center sm:text-left mt-2 sm:mt-0 flex-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mb-2">Inspired By The Teachings Of</p>
                <h2 className="text-3xl font-serif text-[#b85b2e] dark:text-orange-400 mb-3">Srila Prabhupada</h2>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
                  His Divine Grace A. C. Bhaktivedanta Swami Prabhupada, Founder-Acharya of ISKCON, whose vision continues to guide millions towards Krishna Consciousness.
                </p>
                <Link to="/about" className="inline-block px-8 py-2.5 bg-[#cd7f32] hover:bg-[#b8702b] text-white font-semibold rounded-lg transition-colors shadow-md text-sm">
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right side: Grid of features */}
            <div className="relative z-10 lg:w-[55%] grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {/* Feature 1 */}
              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-5 py-4 rounded-2xl shadow-sm border border-orange-50/50 dark:border-slate-700 hover:shadow-md transition-shadow">
                 <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-orange-500 rounded-full bg-orange-50 dark:bg-slate-800 text-xl border border-orange-100 dark:border-slate-700">🧘</div>
                 <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">Krishna Consciousness<br/><span className="font-normal text-slate-500">for Everyone</span></p>
              </div>
              {/* Feature 2 */}
              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-5 py-4 rounded-2xl shadow-sm border border-orange-50/50 dark:border-slate-700 hover:shadow-md transition-shadow">
                 <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-orange-500 rounded-full bg-orange-50 dark:bg-slate-800 text-xl border border-orange-100 dark:border-slate-700">💡</div>
                 <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">Spiritual Guidance<br/><span className="font-normal text-slate-500">for a Better Life</span></p>
              </div>
              {/* Feature 3 */}
              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-5 py-4 rounded-2xl shadow-sm border border-orange-50/50 dark:border-slate-700 hover:shadow-md transition-shadow">
                 <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-orange-500 rounded-full bg-orange-50 dark:bg-slate-800 text-xl border border-orange-100 dark:border-slate-700">🏛️</div>
                 <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">Serving Temples<br/><span className="font-normal text-slate-500">Serving Society</span></p>
              </div>
              {/* Feature 4 */}
              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-5 py-4 rounded-2xl shadow-sm border border-orange-50/50 dark:border-slate-700 hover:shadow-md transition-shadow">
                 <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-orange-500 rounded-full bg-orange-50 dark:bg-slate-800 text-xl border border-orange-100 dark:border-slate-700">🌐</div>
                 <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">Uniting Devotees<br/><span className="font-normal text-slate-500">Worldwide</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Upcoming Events
          </h2>
          <Link to="/events" className="text-orange-500 font-semibold hover:text-orange-600">View All &rarr;</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: 1, title: "Maha Shivaratri", date: "March 8, 2024", location: "Kashi Vishwanath, Varanasi", image: "https://www.templepurohit.com/wp-content/uploads/2017/04/Maha-Shivratri.jpg" },
            { id: 2, title: "Holi Festival", date: "March 25, 2024", location: "Banke Bihari Temple, Vrindavan", image: "https://c8.alamy.com/comp/3DX89E2/devotees-celebrating-holi-at-banke-bihari-temple-vrindavan-uttar-pradesh-india-vibrant-colors-spirituality-and-cultural-tradition-3DX89E2.jpg" },
            { id: 3, title: "Ram Navami", date: "April 17, 2024", location: "Ram Janmabhoomi, Ayodhya", image: "https://www.eurokidsindia.com/blog/wp-content/uploads/2026/03/Ram-Navami-Story-for-Kids-%E2%80%93-Simple-and-Moral-Story-870x437.jpg" },
            { id: 4, title: "Krishna Janmashtami", date: "August 26, 2024", location: "Shri Krishna Janmasthan, Mathura", image: "https://t3.ftcdn.net/jpg/14/09/06/26/360_F_1409062632_UA9RjKyoszBzVcPiJi6DMPjFepAu470O.jpg" }
          ].map((event) => (
            <div key={event.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all group flex flex-col">
              <div className="h-40 overflow-hidden relative shrink-0 bg-orange-100">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full shadow">
                  {event.date}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 truncate">{event.title}</h3>
                <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                  <span className="mr-1">📍</span> <span className="truncate">{event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

   {/* Top Dhams Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Top Sacred Dhams
          </h2>
          <Link to="/dhams" className="text-orange-500 font-semibold hover:text-orange-600">View All &rarr;</Link>
        </div>
        
        {loadingDhams ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dhams
              .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || (d.location?.city || '').toLowerCase().includes(searchQuery.toLowerCase()))
              .slice(0, 6)
              .map((dham) => (
              <div key={dham._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all group flex flex-col">
                <div className="h-48 overflow-hidden bg-slate-100 dark:bg-slate-800 relative shrink-0">
                  <img 
                    src={dham.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(dham.name)}&background=f97316&color=fff`} 
                    alt={dham.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dham.name)}&background=f97316&color=fff` }}
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full shadow">
                    {dham.status === 'active' ? 'Verified' : dham.status}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 truncate" title={dham.name}>{dham.name}</h3>
                  <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-4">
                    <span className="mr-1">📍</span> {dham.location?.city || 'Unknown'}, {dham.location?.state || 'India'}
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-sm truncate mr-2">
                       <span className="text-slate-400">Deity: </span>
                       <span className="font-semibold text-slate-700 dark:text-slate-300">{dham.mainDeity || 'N/A'}</span>
                    </div>
                    <Link to={`/dham/${dham._id}`} className="px-4 py-2 bg-orange-50 dark:bg-orange-500/10 text-orange-600 hover:bg-orange-500 hover:text-white rounded-xl text-sm font-semibold transition-colors shrink-0">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {dhams.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || (d.location?.city || '').toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && !loadingDhams && (
               <div className="col-span-full text-center py-10 text-slate-500">No dhams found matching your search.</div>
            )}
          </div>
        )}
      </section>

      {/* Top Temples Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Top Sacred Temples
          </h2>
          <Link to="/mandirs" className="text-orange-500 font-semibold hover:text-orange-600">View All &rarr;</Link>
        </div>
        
        {loadingTemples ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {temples
              .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || (t.location?.city || '').toLowerCase().includes(searchQuery.toLowerCase()))
              .slice(0, 6)
              .map((temple) => (
              <div key={temple._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all group flex flex-col">
                <div className="h-48 overflow-hidden bg-slate-100 dark:bg-slate-800 relative shrink-0">
                  <img 
                    src={temple.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(temple.name)}&background=f97316&color=fff`} 
                    alt={temple.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(temple.name)}&background=f97316&color=fff` }}
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full shadow">
                    {temple.status === 'active' ? 'Verified' : temple.status}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 truncate" title={temple.name}>{temple.name}</h3>
                  <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-4">
                    <span className="mr-1">📍</span> {temple.location?.city || 'Unknown'}, {temple.location?.state || 'India'}
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-sm truncate mr-2">
                       <span className="text-slate-400">Deity: </span>
                       <span className="font-semibold text-slate-700 dark:text-slate-300">{temple.mainDeity || 'N/A'}</span>
                    </div>
                    <Link to={`/mandir/${temple._id}`} className="px-4 py-2 bg-orange-50 dark:bg-orange-500/10 text-orange-600 hover:bg-orange-500 hover:text-white rounded-xl text-sm font-semibold transition-colors shrink-0">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {temples.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || (t.location?.city || '').toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && !loadingTemples && (
               <div className="col-span-full text-center py-10 text-slate-500">No temples found matching your search.</div>
            )}
          </div>
        )}
      </section>



      {/* Stats Counter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-900 rounded-3xl p-8 shadow-md">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            Services We Provide
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            Every listed vendor is physically verified by on-ground agents to ensure premium service and protect you from inflated pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-b ${srv.color} border rounded-3xl p-6 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 group`}
            >
              <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm border border-slate-100 dark:border-slate-800">
                {srv.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">{srv.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {srv.desc}
              </p>
              <Link
                to="/gallery"
                className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider group-hover:translate-x-1 inline-block transition-transform"
              >
                {srv.buttonText || 'Book Now →'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works / Agent Workflow */}
      <section className="bg-slate-100/55 dark:bg-slate-900/20 py-20 border-y border-slate-200 dark:border-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              The Dham sevak Ecosystem
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400">
              We employ a local manager (Dham sevak) at each destination to coordinate bookings and guarantee authentic customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:border-orange-500/30 transition-all">
                <span className="absolute top-4 right-4 text-4xl font-black text-orange-500/10">
                  {step.num}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 mt-4">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-xl shadow-orange-500/10">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to Plan Your Next Holy Journey?
            </h2>
            <p className="text-sm sm:text-base text-orange-50/90 leading-relaxed">
              Explore temples, consult verified priests, secure cozy ashram accommodations, and order fresh temple Prasad, all with one secure click.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                to="/gallery"
                className="px-6 py-3 bg-white hover:bg-slate-50 text-orange-600 font-bold rounded-xl transition-all shadow-md active:scale-95 text-sm sm:text-base cursor-pointer"
              >
                Browse Temple Directory
              </Link>
              <Link
                to="/signup"
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl border border-slate-800 hover:border-slate-700 transition-all active:scale-95 text-sm sm:text-base cursor-pointer"
              >
                Sign Up as Devotee
              </Link>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>
      </section>
    </div>
    
  );
}
