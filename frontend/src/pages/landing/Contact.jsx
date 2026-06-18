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

  return (
    <div className="space-y-4 pb-20">
      <section className="relative overflow-hidden h-[80vh] min-h-[400px] flex items-center justify-center -mt-16 pt-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-slate-900/60 z-10 mix-blend-multiply"></div>
          <img
            src="/hero/img3.jpg"
            alt="Contact Hero Banner"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-left border-b border-slate-200 dark:border-slate-800 pb-6">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-orange-600 dark:text-orange-500 leading-tight">
            Contact Support
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg">
            Need help with your booking, order, or pilgrim plans? Get in touch with our support team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Side: Info */}
        <div className="space-y-8 bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-900 rounded-3xl shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Get In Touch</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Our platform operates with on-ground Temple Agents active from 5:00 AM to 10:00 PM (Temple Darshan hours).
          </p>

          <div className="space-y-6">
            {/* Phone */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-xl text-orange-600 dark:text-orange-400 border border-orange-500/20">
                📞
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Toll-Free Yatra Helpline</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">1800-309-8800</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-xl text-amber-600 dark:text-amber-400 border border-amber-500/20">
                ✉️
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Support Email</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">support@mandirsetu.org</p>
              </div>
            </div>

            {/* Head Office */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-xl text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
                🏢
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Headquarters</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Sector-5, Haridwar, Uttarakhand, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-900 rounded-3xl shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Submit Query</h2>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rajesh Kumar"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. rajesh@gmail.com"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>

            {/* Temple Option */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Related Temple</label>
              <select
                value={formData.temple}
                onChange={(e) => setFormData({ ...formData, temple: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500 text-sm cursor-pointer"
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
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Message Description</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Explain your queries or custom requirements..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm"
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl active:scale-[0.98] shadow-md shadow-orange-500/10 transition-all cursor-pointer"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}
