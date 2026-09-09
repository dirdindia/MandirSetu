import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';

export default function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/hotels/${id}`);
        setHotel(res.data);
      } catch (err) {
        console.error('Failed to fetch hotel details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-premium flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-premium flex flex-col justify-center items-center">
        <h2 className="text-3xl font-serif font-bold text-maroon mb-4">Hotel Not Found</h2>
        <button onClick={() => window.history.back()} className="mt-4 px-6 py-2 rounded-xl bg-white border border-gold/30 text-maroon font-bold hover:bg-gold/10 transition-all shadow-sm">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-premium min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => window.history.back()} className="inline-flex items-center text-gold hover:text-maroon font-semibold mb-6 transition-colors">
          &larr; Back to Services
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-maroon/5 overflow-hidden border border-gold/20">
          <div className="bg-gradient-to-br from-maroon/5 to-gold/10 p-8 sm:p-10 border-b border-gold/20 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0 w-40 h-40 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-xl shadow-maroon/10 border-4 border-white bg-white">
              <img 
                src={hotel.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(hotel.name)}&background=791916&color=fff&size=512`} 
                alt={hotel.name} 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(hotel.name)}&background=791916&color=fff&size=512` }}
              />
            </div>
            <div className="flex-grow text-center md:text-left flex flex-col justify-center sm:pt-4">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <span className="bg-maroon text-premium text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-gold/30 shadow-sm">
                  Hotel
                </span>
                {hotel.starRating && (
                  <span className="bg-white text-maroon text-xs font-bold px-3 py-1.5 rounded-full border border-gold/30 shadow-sm flex items-center gap-1">
                    {hotel.starRating} Stars
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-maroon mb-3 leading-tight">{hotel.name}</h1>
              <p className="text-maroon-darker/80 text-lg flex items-center justify-center md:justify-start font-medium">
                <span className="mr-2 text-gold">📍</span> {hotel.location?.city}, {hotel.location?.state}
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h2 className="text-2xl font-serif font-bold text-maroon mb-4 pb-2 border-b border-gold/20 inline-block">About the Hotel</h2>
                <p className="text-maroon-darker/80 leading-relaxed text-lg mt-2">
                  {hotel.description || 'No description available.'}
                </p>
              </section>

              {hotel.amenities && hotel.amenities.length > 0 && (
                <section>
                  <h2 className="text-xl font-serif font-bold text-maroon mb-4">Amenities</h2>
                  <div className="flex flex-wrap gap-3">
                    {hotel.amenities.map((amenity, idx) => (
                      <span key={idx} className="bg-maroon/5 text-maroon px-4 py-2 rounded-xl text-sm font-semibold border border-gold/20">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {hotel.roomTypes && hotel.roomTypes.length > 0 && (
                <section>
                  <h2 className="text-xl font-serif font-bold text-maroon mb-4">Room Types</h2>
                  <div className="flex flex-wrap gap-3">
                    {hotel.roomTypes.map((room, idx) => (
                      <span key={idx} className="bg-premium text-maroon-darker/80 px-4 py-2 rounded-xl text-sm font-semibold border border-gold/20 shadow-sm">
                        {room}
                      </span>
                    ))}
                  </div>
                </section>
              )}
              
              <section className="grid grid-cols-2 gap-6">
                 <div className="bg-premium p-6 rounded-2xl border border-gold/20 text-center shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-bold text-gold uppercase tracking-wider">Banquet / Hall</p>
                    <p className="text-lg font-bold text-maroon mt-2">{hotel.hasHall ? 'Available' : 'Not Available'}</p>
                 </div>
                 <div className="bg-premium p-6 rounded-2xl border border-gold/20 text-center shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-bold text-gold uppercase tracking-wider">Restaurant</p>
                    <p className="text-lg font-bold text-maroon mt-2">{hotel.foodAvailable ? 'Available' : 'Not Available'}</p>
                 </div>
              </section>
            </div>

            <div className="space-y-6">
              {hotel.startingPrice && (
                <div className="bg-gradient-to-br from-maroon to-[#4a0f0d] p-6 rounded-2xl border border-gold/30 shadow-lg text-center">
                  <h3 className="font-bold text-gold text-sm uppercase mb-2 tracking-wider">Starting Price</h3>
                  <p className="text-4xl font-serif font-bold text-premium">₹{hotel.startingPrice}</p>
                </div>
              )}

              <div className="bg-premium p-6 rounded-2xl border border-gold/20 shadow-sm">
                <h3 className="font-serif font-bold text-maroon mb-4 border-b border-gold/20 pb-3">Location</h3>
                <p className="text-maroon-darker/80 text-sm mb-5 leading-relaxed">{hotel.location?.address}, {hotel.location?.city}, {hotel.location?.state} {hotel.location?.pincode}</p>
                {hotel.geolocation?.latitude && (
                  <a href={`https://www.google.com/maps/search/?api=1&query=${hotel.geolocation.latitude},${hotel.geolocation.longitude}`} target="_blank" rel="noreferrer" className="block w-full text-center bg-white border border-gold/30 hover:bg-gold/10 text-maroon py-3 rounded-xl font-bold transition-all shadow-sm">
                    View on Maps
                  </a>
                )}
              </div>

              {(hotel.contact?.phone || hotel.contact?.email) && (
                <div className="bg-premium p-6 rounded-2xl border border-gold/20 shadow-sm">
                  <h3 className="font-serif font-bold text-maroon mb-4 border-b border-gold/20 pb-3">Contact Information</h3>
                  <ul className="space-y-4 text-sm text-maroon-darker/80">
                    {hotel.contact.managerName && <li><strong className="text-maroon">Manager:</strong> <span className="ml-1">{hotel.contact.managerName}</span></li>}
                    {hotel.contact.phone && <li className="flex items-center"><span className="text-gold mr-2">📞</span> {hotel.contact.phone}</li>}
                    {hotel.contact.email && <li className="flex items-center"><span className="text-gold mr-2">✉️</span> {hotel.contact.email}</li>}
                    {hotel.contact.website && <li className="flex items-center"><span className="text-gold mr-2">🌐</span> <a href={hotel.contact.website} target="_blank" rel="noreferrer" className="text-maroon hover:text-gold font-semibold transition-colors underline decoration-gold/40 underline-offset-4">Website</a></li>}
                  </ul>
                  {hotel.contact.phone && (
                    <a href={`tel:${hotel.contact.phone}`} className="mt-6 block w-full text-center bg-gradient-to-r from-maroon to-maroon-dark hover:from-maroon-dark hover:to-maroon-darker text-premium py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-maroon/20">
                      Call Now
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
