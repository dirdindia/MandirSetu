import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [temples, setTemples] = useState([]);
  const [loadingTemples, setLoadingTemples] = useState(true);
  const [dhams, setDhams] = useState([]);
  const [loadingDhams, setLoadingDhams] = useState(true);


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
      <section className="relative overflow-hidden pt-16 pb-24 bg-gradient-to-b from-orange-500/10 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">
          <div className="relative mb-12 mt-4">
             <div className="absolute inset-0 blur-[80px] bg-amber-500/40 rounded-full animate-pulse"></div>
             <img src="/vaishnav-tilak.svg" alt="Vaishnav Tilak Hero" className="relative h-64 sm:h-80 w-auto object-contain drop-shadow-[0_0_30px_rgba(245,158,11,0.6)]" />
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Discover India’s Sacred <br />
              <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Heritage & Pilgrimages
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Plan your complete yatra with verified local services. Book ritual priests, find cozy Dharamshalas, secure transport, and receive holy Prasad delivered straight to your home.
            </p>

            {/* Search Box */}
            <div className="mt-10 max-w-xl mx-auto w-full">
              <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xl shadow-orange-500/5 focus-within:ring-2 focus-within:ring-orange-500/35 transition-all">
                <span className="pl-3 text-slate-400 text-lg">🔍</span>
                <input
                  type="text"
                  placeholder="Search temples (e.g. Kedarnath, Somnath, Kashi)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder-slate-400 py-2 px-3 focus:outline-none text-sm sm:text-base"
                />
                <Link
                  to="/gallery"
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shrink-0"
                >
                  Search
                </Link>
              </div>
          </div>
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
