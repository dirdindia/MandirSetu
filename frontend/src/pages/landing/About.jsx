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

  const gradient = 'from-maroon-darker/90 via-maroon/70 to-premium';

  return (
    <div className="bg-premium min-h-screen text-maroon-darker font-sans pb-20">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex flex-col justify-end items-center pt-16">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=2070"
            alt="About Us Hero Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className={`absolute inset-0 z-10 bg-gradient-to-b ${gradient} pointer-events-none`}></div>
        
        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 w-full max-w-5xl pb-16">
          <h2 className="text-gold text-lg sm:text-xl font-serif tracking-widest mb-2">॥ ॐ नमः शिवाय ॥</h2>
          <h1 className="text-5xl sm:text-7xl font-serif text-white mb-4 drop-shadow-xl uppercase tracking-wider">
            About Us
          </h1>
          <p className="text-sm sm:text-lg text-premium max-w-2xl mx-auto leading-relaxed drop-shadow-md font-light italic">
            Discover our mission to bridge India's ancient spiritual traditions with modern technology.
          </p>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="mt-20 mb-10 flex justify-center text-gold">
         <span className="text-2xl">▲</span>
      </div>

      {/* Intro Heading Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-sm font-bold text-gold uppercase tracking-widest">
              Our Vision
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-maroon leading-tight uppercase tracking-wider">
              Bridging Ancient Traditions <br />
              With Modern Technology
            </h2>
            <div className="w-24 h-1 bg-gold/30 my-6"></div>
            <p className="text-maroon-darker/80 leading-relaxed text-base sm:text-lg font-light">
              Every year, billions of devotees set off on holy pilgrimages across India. However, due to lack of digitization, they frequently encounter unhygienic lodgings, fake guides, overpriced services, and generic Prasad. 
            </p>
            <p className="text-maroon-darker/80 leading-relaxed text-base sm:text-lg font-light">
              <strong className="text-maroon font-serif">MandirSetu</strong> (meaning <em>Temple Bridge</em>) was built to establish a transparent, uncorrupted, and secure digital portal. By placing a verified <strong>Temple Agent</strong> on-ground at each shrine, we verify every priest, inspect every room, and pack every package of Prasad ourselves, bringing trust back to spiritual travels.
            </p>
          </div>
          {/* Visual Image Block */}
          <div className="relative">
            <img 
              src="https://img.jagranjosh.com/images/2021/November/17112021/world's-largest-vedic-temple-temple-of-vedic-planetarium.webp" 
              alt="Ancient Temple Architecture" 
              className="w-full h-[500px] object-cover rounded-3xl shadow-2xl border border-gold/20"
            />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gold text-maroon-darker rounded-full flex items-center justify-center text-4xl shadow-xl border-4 border-premium">
               ॐ
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="mb-16 flex justify-center text-gold">
         <span className="text-2xl">▲</span>
      </div>

      {/* Core Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-serif text-maroon uppercase tracking-wider">
            Our Core Pillars
          </h2>
          <p className="mt-4 text-maroon-darker/70 font-serif italic text-lg">
            We focus on building a community-first ecosystem to serve pilgrims with ultimate honesty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((plr, idx) => (
            <div key={idx} className="bg-white border border-gold/20 p-10 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-maroon/5 transition-all text-center group">
              <div className="w-20 h-20 mx-auto bg-gold/10 rounded-full flex items-center justify-center text-4xl mb-6 border border-gold/30 group-hover:bg-maroon transition-colors duration-500">
                <span className="group-hover:scale-110 transition-transform">{plr.icon}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-maroon mb-4 uppercase tracking-wider">{plr.title}</h3>
              <p className="text-maroon-darker/70 font-light leading-relaxed">
                {plr.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet the Agents section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-maroon text-white rounded-[3rem] p-10 sm:p-16 border border-gold/20 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-6">
              <h3 className="text-gold text-lg font-serif tracking-widest uppercase">Our Ground Force</h3>
              <h2 className="text-3xl sm:text-5xl font-serif leading-tight">Why the "Temple Agent" is our Hero</h2>
              <div className="w-16 h-1 bg-gold/50 my-4"></div>
              <p className="text-premium/80 text-base sm:text-lg font-light leading-relaxed">
                Most platforms operate purely online, leaving travellers at the mercy of virtual profiles. MandirSetu takes an offline-to-online approach. 
              </p>
              <p className="text-premium/80 text-base sm:text-lg font-light leading-relaxed">
                Our hired Agents live at the pilgrimage site. They act as your host, quality-controller, and emergency helper, ensuring your rituals go smoothly and packages are dispatched on time.
              </p>
              <div className="pt-6">
                <Link
                  to="/signup"
                  className="inline-flex px-8 py-3.5 bg-gold text-maroon-darker font-bold rounded-full hover:bg-[#c29b26] transition-all shadow-md active:scale-95 text-sm sm:text-base cursor-pointer"
                >
                  Apply as Temple Agent &rarr;
                </Link>
              </div>
            </div>
            
            {/* Visual Agent list mock */}
            <div className="space-y-6">
              {[
                { name: 'Rahul Sharma', role: 'Kedarnath Cluster Agent', color: 'bg-gold/20 text-gold' },
                { name: 'Suresh K. Iyer', role: 'Tirupati Cluster Agent', color: 'bg-premium/20 text-premium' },
                { name: 'Amit Pandey', role: 'Varanasi Cluster Agent', color: 'bg-white/10 text-white' }
              ].map((agent, i) => (
                <div key={i} className="bg-black/20 border border-gold/20 p-5 rounded-2xl flex items-center space-x-5 hover:bg-black/30 transition-colors backdrop-blur-sm">
                  <div className={`w-12 h-12 rounded-full ${agent.color} border border-current flex items-center justify-center font-bold text-xl`}>
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg font-serif tracking-wide">{agent.name}</h4>
                    <p className="text-sm text-gold flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {agent.role} (Active)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </section>

    </div>
  );
}
