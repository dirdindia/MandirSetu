import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../api';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const gradient = 'from-[#3a0d0a]/90 via-[#791916]/70 to-[#fdfbf7]';

  return (
    <div className="bg-[#fdfbf7] min-h-screen text-[#3a0d0a] font-sans pb-20">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex flex-col justify-end items-center pt-16">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?q=80&w=2070&auto=format&fit=crop"
            alt="Events Hero Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className={`absolute inset-0 z-10 bg-gradient-to-b ${gradient} pointer-events-none`}></div>
        
        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 w-full max-w-5xl pb-16">
          <h2 className="text-[#d4af37] text-lg sm:text-xl font-serif tracking-widest mb-2">॥ उत्सव एवं समारोह ॥</h2>
          <h1 className="text-5xl sm:text-7xl font-serif text-white mb-4 drop-shadow-xl uppercase tracking-wider">
            Spiritual Events
          </h1>
          <p className="text-sm sm:text-lg text-[#fdfbf7] max-w-2xl mx-auto leading-relaxed drop-shadow-md font-light italic">
            Discover and participate in sacred festivals, yatras, and rituals happening across the country.
          </p>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="mt-20 mb-10 flex justify-center text-[#d4af37]">
         <span className="text-2xl">▲</span>
      </div>

      {/* Events List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex justify-between items-center mb-16">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-serif text-[#791916] uppercase tracking-wider">
              Featured Events
            </h2>
            <div className="w-16 h-1 bg-[#d4af37]/50"></div>
          </div>
          <button className="hidden md:flex items-center gap-2 text-[#791916] font-semibold hover:text-[#3a0d0a] transition-colors border-b-2 border-transparent hover:border-[#d4af37] pb-1">
            View All Events <ArrowRight size={20} />
          </button>
        </div>

        {loading ? (
          <div className="text-center text-xl text-[#791916] py-20 font-serif">Loading upcoming events...</div>
        ) : events.length === 0 ? (
          <div className="text-center text-xl text-[#791916] py-20 font-serif">No events scheduled at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
            {events.map((event) => (
              <div 
                key={event._id} 
                className="bg-white border border-[#d4af37]/20 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#791916]/10 transition-all duration-500 group flex flex-col sm:flex-row"
              >
                <div className="sm:w-2/5 h-64 sm:h-auto overflow-hidden relative">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-[#791916]/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-[#d4af37] border border-[#d4af37]/30 uppercase tracking-widest">
                    {event.category}
                  </div>
                </div>
                <div className="p-8 sm:w-3/5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-[#791916] mb-3 group-hover:text-[#3a0d0a] transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-[#3a0d0a]/70 font-light text-sm mb-6 leading-relaxed line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center text-sm text-[#3a0d0a]/80 font-medium">
                        <Calendar size={18} className="mr-3 text-[#d4af37]" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-[#3a0d0a]/80 font-medium">
                        <Clock size={18} className="mr-3 text-[#d4af37]" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-[#3a0d0a]/80 font-medium">
                        <MapPin size={18} className="mr-3 text-[#d4af37] flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full bg-[#fdfbf7] hover:bg-[#d4af37] text-[#791916] hover:text-[#3a0d0a] font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm border border-[#d4af37]/40 uppercase tracking-wider text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-12 text-center md:hidden">
          <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#d4af37] text-[#3a0d0a] font-bold rounded-full hover:bg-[#c29b26] transition-all shadow-md active:scale-95 text-sm sm:text-base cursor-pointer">
            View All Events <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
