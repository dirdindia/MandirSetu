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

  const gradient = 'from-[#3a0d0a]/90 via-[#791916]/70 to-[#fdfbf7]';

  return (
    <div className="bg-[#fdfbf7] min-h-screen text-[#3a0d0a] font-sans pb-20">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex flex-col justify-end items-center pt-16">
        <div className="absolute inset-0">
          <img
            src="/hero/img2.jpg"
            alt="About Us Hero Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className={`absolute inset-0 z-10 bg-gradient-to-b ${gradient} pointer-events-none`}></div>
        
        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 w-full max-w-5xl pb-16">
          <h2 className="text-[#d4af37] text-lg sm:text-xl font-serif tracking-widest mb-2">॥ ॐ नमः शिवाय ॥</h2>
          <h1 className="text-5xl sm:text-7xl font-serif text-white mb-4 drop-shadow-xl uppercase tracking-wider">
            About Us
          </h1>
          <p className="text-sm sm:text-lg text-[#fdfbf7] max-w-2xl mx-auto leading-relaxed drop-shadow-md font-light italic">
            Discover our mission to bridge India's ancient spiritual traditions with modern technology.
          </p>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="mt-20 mb-10 flex justify-center text-[#d4af37]">
         <span className="text-2xl">▲</span>
      </div>

      {/* Intro Heading Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-sm font-bold text-[#d4af37] uppercase tracking-widest">
              Our Vision
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#791916] leading-tight uppercase tracking-wider">
              Bridging Ancient Traditions <br />
              With Modern Technology
            </h2>
            <div className="w-24 h-1 bg-[#d4af37]/30 my-6"></div>
            <p className="text-[#3a0d0a]/80 leading-relaxed text-base sm:text-lg font-light">
              Every year, billions of devotees set off on holy pilgrimages across India. However, due to lack of digitization, they frequently encounter unhygienic lodgings, fake guides, overpriced services, and generic Prasad. 
            </p>
            <p className="text-[#3a0d0a]/80 leading-relaxed text-base sm:text-lg font-light">
              <strong className="text-[#791916] font-serif">MandirSetu</strong> (meaning <em>Temple Bridge</em>) was built to establish a transparent, uncorrupted, and secure digital portal. By placing a verified <strong>Temple Agent</strong> on-ground at each shrine, we verify every priest, inspect every room, and pack every package of Prasad ourselves, bringing trust back to spiritual travels.
            </p>
          </div>
          {/* Visual Image Block */}
          <div className="relative">
            <img 
              src="https://img.jagranjosh.com/images/2021/November/17112021/world's-largest-vedic-temple-temple-of-vedic-planetarium.webp" 
              alt="Ancient Temple Architecture" 
              className="w-full h-[500px] object-cover rounded-3xl shadow-2xl border border-[#d4af37]/20"
            />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#d4af37] text-[#3a0d0a] rounded-full flex items-center justify-center text-4xl shadow-xl border-4 border-[#fdfbf7]">
               ॐ
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="mb-16 flex justify-center text-[#d4af37]">
         <span className="text-2xl">▲</span>
      </div>

      {/* Core Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-serif text-[#791916] uppercase tracking-wider">
            Our Core Pillars
          </h2>
          <p className="mt-4 text-[#3a0d0a]/70 font-serif italic text-lg">
            We focus on building a community-first ecosystem to serve pilgrims with ultimate honesty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((plr, idx) => (
            <div key={idx} className="bg-white border border-[#d4af37]/20 p-10 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-[#791916]/5 transition-all text-center group">
              <div className="w-20 h-20 mx-auto bg-[#d4af37]/10 rounded-full flex items-center justify-center text-4xl mb-6 border border-[#d4af37]/30 group-hover:bg-[#791916] transition-colors duration-500">
                <span className="group-hover:scale-110 transition-transform">{plr.icon}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#791916] mb-4 uppercase tracking-wider">{plr.title}</h3>
              <p className="text-[#3a0d0a]/70 font-light leading-relaxed">
                {plr.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet the Agents section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#791916] text-white rounded-[3rem] p-10 sm:p-16 border border-[#d4af37]/20 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-6">
              <h3 className="text-[#d4af37] text-lg font-serif tracking-widest uppercase">Our Ground Force</h3>
              <h2 className="text-3xl sm:text-5xl font-serif leading-tight">Why the "Temple Agent" is our Hero</h2>
              <div className="w-16 h-1 bg-[#d4af37]/50 my-4"></div>
              <p className="text-[#fdfbf7]/80 text-base sm:text-lg font-light leading-relaxed">
                Most platforms operate purely online, leaving travellers at the mercy of virtual profiles. MandirSetu takes an offline-to-online approach. 
              </p>
              <p className="text-[#fdfbf7]/80 text-base sm:text-lg font-light leading-relaxed">
                Our hired Agents live at the pilgrimage site. They act as your host, quality-controller, and emergency helper, ensuring your rituals go smoothly and packages are dispatched on time.
              </p>
              <div className="pt-6">
                <Link
                  to="/signup"
                  className="inline-flex px-8 py-3.5 bg-[#d4af37] text-[#3a0d0a] font-bold rounded-full hover:bg-[#c29b26] transition-all shadow-md active:scale-95 text-sm sm:text-base cursor-pointer"
                >
                  Apply as Temple Agent &rarr;
                </Link>
              </div>
            </div>
            
            {/* Visual Agent list mock */}
            <div className="space-y-6">
              {[
                { name: 'Rahul Sharma', role: 'Kedarnath Cluster Agent', color: 'bg-[#d4af37]/20 text-[#d4af37]' },
                { name: 'Suresh K. Iyer', role: 'Tirupati Cluster Agent', color: 'bg-[#fdfbf7]/20 text-[#fdfbf7]' },
                { name: 'Amit Pandey', role: 'Varanasi Cluster Agent', color: 'bg-white/10 text-white' }
              ].map((agent, i) => (
                <div key={i} className="bg-black/20 border border-[#d4af37]/20 p-5 rounded-2xl flex items-center space-x-5 hover:bg-black/30 transition-colors backdrop-blur-sm">
                  <div className={`w-12 h-12 rounded-full ${agent.color} border border-current flex items-center justify-center font-bold text-xl`}>
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg font-serif tracking-wide">{agent.name}</h4>
                    <p className="text-sm text-[#d4af37] flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {agent.role} (Active)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </section>

    </div>
  );
}
