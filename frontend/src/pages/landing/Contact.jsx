import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    temple: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${formData.name}! Our dedicated Temple Agent will review your inquiry regarding "${formData.temple}" and respond to ${formData.email} within 2 hours.`);
    setFormData({ name: '', email: '', temple: 'General Inquiry', message: '' });
  };

  const gradient = 'from-[#3a0d0a]/90 via-[#791916]/70 to-[#fdfbf7]';

  return (
    <div className="bg-[#fdfbf7] min-h-screen text-[#3a0d0a] font-sans pb-20">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex flex-col justify-end items-center pt-16">
        <div className="absolute inset-0">
          <img
            src="/hero/img3.jpg"
            alt="Contact Hero Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className={`absolute inset-0 z-10 bg-gradient-to-b ${gradient} pointer-events-none`}></div>
        
        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 w-full max-w-5xl pb-16">
          <h2 className="text-[#d4af37] text-lg sm:text-xl font-serif tracking-widest mb-2">॥ सेवा ॥</h2>
          <h1 className="text-5xl sm:text-7xl font-serif text-white mb-4 drop-shadow-xl uppercase tracking-wider">
            Contact Support
          </h1>
          <p className="text-sm sm:text-lg text-[#fdfbf7] max-w-2xl mx-auto leading-relaxed drop-shadow-md font-light italic">
            Need help with your booking, order, or pilgrim plans? Get in touch with our support team.
          </p>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="mt-20 mb-10 flex justify-center text-[#d4af37]">
         <span className="text-2xl">▲</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 mb-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Side: Info */}
        <div className="space-y-10 bg-[#791916] text-white p-10 sm:p-14 border border-[#d4af37]/20 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-serif text-[#d4af37] mb-4 uppercase tracking-wider">Get In Touch</h2>
            <div className="w-16 h-1 bg-[#d4af37]/50 mb-6"></div>
            <p className="text-[#fdfbf7]/80 leading-relaxed font-light text-lg mb-10">
              Our platform operates with on-ground Temple Agents active from 5:00 AM to 10:00 PM (Temple Darshan hours).
            </p>

            <div className="space-y-8">
              {/* Phone */}
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-black/20 rounded-full flex items-center justify-center text-2xl text-[#d4af37] border border-[#d4af37]/30 shadow-inner">
                  📞
                </div>
                <div>
                  <p className="text-xs text-[#d4af37] uppercase tracking-wider font-bold mb-1">Toll-Free Yatra Helpline</p>
                  <p className="text-xl font-serif tracking-wide">1800-309-8800</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-black/20 rounded-full flex items-center justify-center text-2xl text-[#d4af37] border border-[#d4af37]/30 shadow-inner">
                  ✉️
                </div>
                <div>
                  <p className="text-xs text-[#d4af37] uppercase tracking-wider font-bold mb-1">Support Email</p>
                  <p className="text-xl font-serif tracking-wide">support@mandirsetu.org</p>
                </div>
              </div>

              {/* Head Office */}
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-black/20 rounded-full flex items-center justify-center text-2xl text-[#d4af37] border border-[#d4af37]/30 shadow-inner">
                  🏢
                </div>
                <div>
                  <p className="text-xs text-[#d4af37] uppercase tracking-wider font-bold mb-1">Headquarters</p>
                  <p className="text-lg font-serif tracking-wide">Sector-5, Haridwar, Uttarakhand</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 text-[15rem] opacity-5 pointer-events-none">📞</div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-white p-10 sm:p-14 border border-[#d4af37]/30 rounded-[3rem] shadow-xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div>
              <h2 className="text-3xl font-serif text-[#791916] mb-2 uppercase tracking-wider">Submit Query</h2>
              <p className="text-[#3a0d0a]/60 font-light italic">Fill out the form below and we'll get back to you shortly.</p>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#791916] uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rajesh Kumar"
                className="w-full px-5 py-4 bg-[#fdfbf7] border border-[#d4af37]/30 rounded-2xl text-[#3a0d0a] placeholder-[#3a0d0a]/30 focus:outline-none focus:border-[#791916] focus:ring-1 focus:ring-[#791916] transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#791916] uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. rajesh@gmail.com"
                className="w-full px-5 py-4 bg-[#fdfbf7] border border-[#d4af37]/30 rounded-2xl text-[#3a0d0a] placeholder-[#3a0d0a]/30 focus:outline-none focus:border-[#791916] focus:ring-1 focus:ring-[#791916] transition-all"
              />
            </div>

            {/* Temple Option */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#791916] uppercase tracking-wider">Related Temple</label>
              <select
                value={formData.temple}
                onChange={(e) => setFormData({ ...formData, temple: e.target.value })}
                className="w-full px-5 py-4 bg-[#fdfbf7] border border-[#d4af37]/30 rounded-2xl text-[#3a0d0a] focus:outline-none focus:border-[#791916] focus:ring-1 focus:ring-[#791916] transition-all cursor-pointer appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23791916' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Kedarnath Temple">Kedarnath Temple</option>
                <option value="Tirupati Balaji Temple">Tirupati Balaji Temple</option>
                <option value="Kashi Vishwanath Temple">Kashi Vishwanath Temple</option>
                <option value="Somnath Temple">Somnath Temple</option>
                <option value="Meenakshi Amman Temple">Meenakshi Amman Temple</option>
                <option value="Vaishno Devi Temple">Vaishno Devi Temple</option>
              </select>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#791916] uppercase tracking-wider">Message Description</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Explain your queries or custom requirements..."
                className="w-full px-5 py-4 bg-[#fdfbf7] border border-[#d4af37]/30 rounded-2xl text-[#3a0d0a] placeholder-[#3a0d0a]/30 focus:outline-none focus:border-[#791916] focus:ring-1 focus:ring-[#791916] transition-all resize-none"
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-[#d4af37] hover:bg-[#c29b26] text-[#3a0d0a] font-bold rounded-full active:scale-[0.98] shadow-lg transition-all cursor-pointer uppercase tracking-widest text-sm"
            >
              Send Message
            </button>
          </form>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        </div>
      </div>
      </div>
    </div>
  );
}
