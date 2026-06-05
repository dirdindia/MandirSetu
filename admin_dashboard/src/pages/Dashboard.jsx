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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h2>
        <p className="text-slate-500 text-sm mt-1">Welcome back! Here's what's happening across MandirSetu today.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Mandirs Onboarded</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">1,204</h3>
            <p className="text-xs text-green-500 font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> +12% this month
            </p>
          </div>
          <div className="w-14 h-14 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center">
            <Building2 size={28} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Temple Sevadars</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">342</h3>
            <p className="text-xs text-green-500 font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> +5 new this week
            </p>
          </div>
          <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
            <UserSquare2 size={28} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Devotees</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">45.2k</h3>
            <p className="text-xs text-green-500 font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> +8% this month
            </p>
          </div>
          <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
            <Users size={28} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Bookings</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">8,920</h3>
            <p className="text-xs text-green-500 font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> +15% this month
            </p>
          </div>
          <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
            <CalendarCheck size={28} />
          </div>
        </div>

      </div>

      {/* Main Content Grid: Graph & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graph Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Platform Growth</h3>
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg px-3 py-1.5 outline-none">
              <option>Last 7 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDevotees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="devotees" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorDevotees)" />
                <Area type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Activity</h3>
            <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
          </div>
          
          <div className="space-y-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                {/* Avatar / Initial */}
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold shrink-0">
                  {activity.user.charAt(0)}
                </div>
                {/* Details */}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{activity.user}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{activity.action}</p>
                  <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{activity.time}</p>
                </div>
                {/* Status Badge */}
                <div>
                  <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider
                    ${activity.status === 'Completed' ? 'bg-green-100 text-green-600' : 
                      activity.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 
                      'bg-red-100 text-red-600'}`}
                  >
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-2.5 text-sm font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors">
            View All Activity
          </button>
        </div>

      </div>
    </div>
  );
}
