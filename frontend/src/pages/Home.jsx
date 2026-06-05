import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const services = [
    {
      icon: '🪔',
      title: 'Pujari Bookings',
      desc: 'Book verified pandits for physical rituals or live virtual pujas with sankalp details.',
      color: 'from-orange-500/10 to-amber-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400',
    },
    {
      icon: '🏨',
      title: 'Hotel Bookings',
      desc: 'Find and book comfortable hotels and premium stays near the temple premises easily.',
      color: 'from-amber-500/10 to-yellow-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
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
    {
      icon: '📦',
      title: 'Authentic Prasad',
      desc: 'Order holy Prasad directly from prominent shrines, shipped fresh and packaged securely.',
      color: 'from-orange-500/10 to-rose-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400',
      buttonText: 'Buy Now →',
    },
    {
      icon: '🛕',
      title: 'Ashrams & Dharamshalas',
      desc: 'Find clean, safe dharamshalas and stays near the temple gates, curated by local agents.',
      color: 'from-yellow-500/10 to-amber-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400',
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
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 bg-gradient-to-b from-orange-500/10 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">
          <img src="/logo.png" alt="MandirSetu Logo" className="w-24 h-24 mb-6 rounded-2xl shadow-xl border border-orange-500/15" />
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
          <div className="mt-10 max-w-xl mx-auto">
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
              The Agent-Led Ecosystem
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400">
              We employ a local manager (Temple Agent) at each destination to coordinate bookings and guarantee authentic customer satisfaction.
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
