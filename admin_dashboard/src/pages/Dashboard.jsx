import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  UserSquare2, 
  TrendingUp, 
  CalendarCheck,
  MoreVertical
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// --- Dummy Data ---
const graphData = [
  { name: 'Jan', devotees: 4000, bookings: 2400 },
  { name: 'Feb', devotees: 3000, bookings: 1398 },
  { name: 'Mar', devotees: 2000, bookings: 9800 },
  { name: 'Apr', devotees: 2780, bookings: 3908 },
  { name: 'May', devotees: 1890, bookings: 4800 },
  { name: 'Jun', devotees: 2390, bookings: 3800 },
  { name: 'Jul', devotees: 3490, bookings: 4300 },
];

const recentActivities = [
  { id: 1, user: 'Rahul Sharma', action: 'Booked VIP Darshan at Kashi Vishwanath', time: '10 mins ago', status: 'Completed' },
  { id: 2, user: 'Amit Singh', action: 'Registered as a new Temple Sevadar', time: '1 hour ago', status: 'Pending' },
  { id: 3, user: 'Priya Gupta', action: 'Made a donation to Somnath Temple', time: '3 hours ago', status: 'Completed' },
  { id: 4, user: 'Vikas Kumar', action: 'Cancelled Aarti booking', time: '5 hours ago', status: 'Cancelled' },
  { id: 5, user: 'Neha Verma', action: 'Added review for Kedarnath', time: '1 day ago', status: 'Completed' },
];

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    const role = localStorage.getItem('user-role');

    if (!token || role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-serif font-bold text-maroon">Dashboard Overview</h2>
        <p className="text-maroon-darker/70 text-sm mt-1 font-medium">Welcome back! Here's what's happening across MandirSetu today.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white rounded-[1.5rem] p-6 border border-gold/20 shadow-sm flex items-center justify-between hover:shadow-xl hover:shadow-maroon/5 transition-all group">
          <div>
            <p className="text-xs font-bold text-gold uppercase tracking-widest">Mandirs Onboarded</p>
            <h3 className="text-3xl font-serif font-black text-maroon mt-1 group-hover:scale-105 transition-transform origin-left">1,204</h3>
            <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> +12% this month
            </p>
          </div>
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-maroon/10 to-gold/10 text-maroon flex items-center justify-center border border-gold/20">
            <Building2 size={28} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-[1.5rem] p-6 border border-gold/20 shadow-sm flex items-center justify-between hover:shadow-xl hover:shadow-maroon/5 transition-all group">
          <div>
            <p className="text-xs font-bold text-gold uppercase tracking-widest">Temple Sevadars</p>
            <h3 className="text-3xl font-serif font-black text-maroon mt-1 group-hover:scale-105 transition-transform origin-left">342</h3>
            <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> +5 new this week
            </p>
          </div>
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-maroon/10 to-gold/10 text-maroon flex items-center justify-center border border-gold/20">
            <UserSquare2 size={28} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-[1.5rem] p-6 border border-gold/20 shadow-sm flex items-center justify-between hover:shadow-xl hover:shadow-maroon/5 transition-all group">
          <div>
            <p className="text-xs font-bold text-gold uppercase tracking-widest">Total Devotees</p>
            <h3 className="text-3xl font-serif font-black text-maroon mt-1 group-hover:scale-105 transition-transform origin-left">45.2k</h3>
            <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> +8% this month
            </p>
          </div>
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-maroon/10 to-gold/10 text-maroon flex items-center justify-center border border-gold/20">
            <Users size={28} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-[1.5rem] p-6 border border-gold/20 shadow-sm flex items-center justify-between hover:shadow-xl hover:shadow-maroon/5 transition-all group">
          <div>
            <p className="text-xs font-bold text-gold uppercase tracking-widest">Total Bookings</p>
            <h3 className="text-3xl font-serif font-black text-maroon mt-1 group-hover:scale-105 transition-transform origin-left">8,920</h3>
            <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> +15% this month
            </p>
          </div>
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-maroon/10 to-gold/10 text-maroon flex items-center justify-center border border-gold/20">
            <CalendarCheck size={28} />
          </div>
        </div>

      </div>

      {/* Main Content Grid: Graph & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graph Section */}
        <div className="lg:col-span-2 bg-white rounded-[1.5rem] border border-gold/20 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-serif font-bold text-maroon">Platform Growth</h3>
            <select className="bg-premium border border-gold/30 text-maroon-darker text-sm rounded-xl px-4 py-2 outline-none font-medium focus:ring-1 focus:ring-maroon/20 focus:border-maroon">
              <option>Last 7 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDevotees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#791916" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#791916" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#3a0d0a', opacity: 0.5, fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#3a0d0a', opacity: 0.5, fontSize: 12, fontWeight: 600}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d4af37" strokeOpacity={0.15} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 10px 15px -3px rgba(121, 25, 22, 0.1)' }}
                  itemStyle={{ fontWeight: 'bold', color: '#3a0d0a' }}
                />
                <Area type="monotone" dataKey="devotees" stroke="#791916" strokeWidth={3} fillOpacity={1} fill="url(#colorDevotees)" />
                <Area type="monotone" dataKey="bookings" stroke="#d4af37" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-[1.5rem] border border-gold/20 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-serif font-bold text-maroon">Recent Activity</h3>
            <button className="text-maroon-darker/40 hover:text-maroon transition-colors"><MoreVertical size={20} /></button>
          </div>
          
          <div className="space-y-6 flex-1">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                {/* Avatar / Initial */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-maroon/10 to-gold/10 border border-gold/20 flex items-center justify-center text-maroon font-bold shrink-0 shadow-sm">
                  {activity.user.charAt(0)}
                </div>
                {/* Details */}
                <div className="flex-1">
                  <p className="text-sm font-bold text-maroon-darker">{activity.user}</p>
                  <p className="text-xs text-maroon-darker/60 mt-0.5 line-clamp-1">{activity.action}</p>
                  <p className="text-[10px] font-bold text-gold mt-1 uppercase tracking-widest">{activity.time}</p>
                </div>
                {/* Status Badge */}
                <div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider
                    ${activity.status === 'Completed' ? 'bg-maroon/10 text-maroon border border-maroon/20' : 
                      activity.status === 'Pending' ? 'bg-gold/10 text-[#9c7b16] border border-gold/30' : 
                      'bg-red-50 text-red-600 border border-red-200'}`}
                  >
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-3 text-sm font-bold text-maroon bg-gradient-to-r from-maroon/5 to-gold/10 hover:from-maroon/10 hover:to-gold/20 border border-gold/20 rounded-xl transition-all tracking-wide">
            VIEW ALL ACTIVITY
          </button>
        </div>

      </div>
    </div>
  );
}
