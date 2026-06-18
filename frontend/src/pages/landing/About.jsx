import { Link } from 'react-router-dom';

export default function About() {
  const pillars = [
    {
      icon: '🤝',
      title: 'Trust & Transparency',
      desc: 'No hidden fees. Every room price, puja cost, and taxi fare is pre-regulated. All service providers are identity-verified.',
    },
    {
      icon: '📍',
      title: 'Local Empowerment',
      desc: 'We support local economies by listing small family-run hotels, local taxi owners, and traditional Vedic scholars directly.',
    },
    {
      icon: '🛡️',
      title: 'On-Ground Safety',
      desc: 'With dedicated Temple Agents present physically at each site, elderly pilgrims have access to instant medical help and general guides.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      <section className="relative overflow-hidden h-[80vh] min-h-[400px] flex items-center justify-center -mt-16 pt-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-slate-900/60 z-10 mix-blend-multiply"></div>
          <img
            src="/hero/img2.jpg"
            alt="About Us Hero Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20 flex flex-col items-center w-full mt-8">
          <div className="relative mb-6">
             <div className="absolute inset-0 blur-[60px] bg-white/10 rounded-full animate-pulse"></div>
             <img src="/vaishnav-tilak.svg" alt="Vaishnav Tilak Hero" className="relative h-64 sm:h-80 md:h-96 w-auto object-contain opacity-20 mix-blend-overlay transition-all" />
          </div>
        </div>
      </section>

      {/* Intro Heading Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-left border-b border-slate-200 dark:border-slate-800 pb-6">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            About Us
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-sm font-bold text-orange-500 uppercase tracking-widest">
              Our Vision
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Bridging Ancient Traditions <br />
              With Modern Technology
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base sm:text-lg">
              Every year, billions of devotees set off on holy pilgrimages across India. However, due to lack of digitization, they frequently encounter unhygienic lodgings, fake guides, overpriced services, and generic Prasad. 
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
              **MandirSetu** (meaning *Temple Bridge*) was built to establish a transparent, uncorrupted, and secure digital portal. By placing a verified **Temple Agent** on-ground at each shrine, we verify every priest, inspect every room, and pack every package of Prasad ourselves, bringing trust back to spiritual travels.
            </p>
          </div>
          {/* Visual Image Block */}
          <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            <img 
              src="https://img.jagranjosh.com/images/2021/November/17112021/world's-largest-vedic-temple-temple-of-vedic-planetarium.webp" 
              alt="Ancient Temple Architecture" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            />
            {/* Overlay to blend with design */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-900/40 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Core Pillars Grid */}
      <section className="bg-slate-100/50 dark:bg-slate-900/10 py-16 border-y border-slate-200 dark:border-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Our Core Pillars
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400">
              We focus on building a community-first ecosystem to serve pilgrims with ultimate honesty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((plr, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm space-y-4">
                <div className="text-4xl">{plr.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{plr.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {plr.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Agents section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Why the "Temple Agent" is our Hero</h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Most platforms operate purely online, leaving travellers at the mercy of virtual profiles. MandirSetu takes an offline-to-online approach. 
              </p>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Our hired Agents live at the pilgrimage site. They act as your host, quality-controller, and emergency helper, ensuring your rituals go smoothly and packages are dispatched on time.
              </p>
              <div className="pt-2">
                <Link
                  to="/signup"
                  className="inline-flex px-5 py-2.5 bg-orange-500 hover:bg-orange-600 font-bold rounded-lg text-sm active:scale-95 transition-colors cursor-pointer"
                >
                  Apply as Temple Agent →
                </Link>
              </div>
            </div>
            {/* Visual Agent list mock */}
            <div className="space-y-4">
              <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center font-bold text-orange-400">
                  R
                </div>
                <div>
                  <h4 className="font-bold text-sm">Rahul Sharma</h4>
                  <p className="text-xs text-slate-400">Kedarnath Cluster Agent (Active)</p>
                </div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400">
                  S
                </div>
                <div>
                  <h4 className="font-bold text-sm">Suresh K. Iyer</h4>
                  <p className="text-xs text-slate-400">Tirupati Cluster Agent (Active)</p>
                </div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center font-bold text-yellow-400">
                  A
                </div>
                <div>
                  <h4 className="font-bold text-sm">Amit Pandey</h4>
                  <p className="text-xs text-slate-400">Varanasi Cluster Agent (Active)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
