import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { 
  ClipboardList, 
  CheckSquare, 
  Clock, 
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
  { name: 'Jan', tasksAssigned: 40, tasksCompleted: 24 },
  { name: 'Feb', tasksAssigned: 30, tasksCompleted: 13 },
  { name: 'Mar', tasksAssigned: 20, tasksCompleted: 98 },
  { name: 'Apr', tasksAssigned: 27, tasksCompleted: 39 },
  { name: 'May', tasksAssigned: 18, tasksCompleted: 48 },
  { name: 'Jun', tasksAssigned: 23, tasksCompleted: 38 },
  { name: 'Jul', tasksAssigned: 34, tasksCompleted: 43 },
];

const recentActivities = [
  { id: 1, user: 'Amit Singh', action: 'Verified new Mandir registration', time: '10 mins ago', status: 'Completed' },
  { id: 2, user: 'Priya Gupta', action: 'Assigned to review Dham documents', time: '1 hour ago', status: 'Pending' },
  { id: 3, user: 'Amit Singh', action: 'Approved Sevadar profile update', time: '3 hours ago', status: 'Completed' },
  { id: 4, user: 'Vikas Kumar', action: 'Failed to verify bank details', time: '5 hours ago', status: 'Cancelled' },
  { id: 5, user: 'Neha Verma', action: 'Completed background check for Staff', time: '1 day ago', status: 'Completed' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    const role = localStorage.getItem('user-role');

    if (!token || role !== 'staff') {
      navigate('/login');
    } else {
      const fetchProfile = async () => {
        try {
          const res = await api.get('/staff/me');
          setProfile(res.data.data);
        } catch (error) {
          console.error("Failed to fetch profile", error);
        }
      };
      fetchProfile();
    }
  }, [navigate]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-serif font-bold text-maroon-darker">Staff Overview</h2>
          <p className="text-maroon-darker/60 text-sm mt-1">Welcome back! Here's your task summary for today.</p>
        </div>
        {profile?.employment?.assignedMandir && (
          <div className="px-4 py-2 bg-gold/20 text-maroon-darker rounded-xl font-bold border border-gold/40">
            Assigned Mandir: {profile.employment.assignedMandir.name} ({profile.employment.assignedMandir.city})
          </div>
        )}
        {profile?.employment?.assignedDham && (
          <div className="px-4 py-2 bg-gold/20 text-maroon-darker rounded-xl font-bold border border-gold/40">
            Assigned Dham: {profile.employment.assignedDham.name} ({profile.employment.assignedDham.city})
          </div>
        )}
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-6 border border-gold/20 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-semibold text-maroon-darker/60 uppercase tracking-wider">Assigned Tasks</p>
            <h3 className="text-3xl font-serif font-bold text-maroon-darker mt-1">124</h3>
            <p className="text-xs text-maroon font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> +12 this week
            </p>
          </div>
          <div className="w-14 h-14 rounded-xl bg-maroon/10 text-maroon flex items-center justify-center">
            <ClipboardList size={28} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 border border-gold/20 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-semibold text-maroon-darker/60 uppercase tracking-wider">Completed Tasks</p>
            <h3 className="text-3xl font-serif font-bold text-maroon-darker mt-1">89</h3>
            <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> 72% completion rate
            </p>
          </div>
          <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckSquare size={28} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-6 border border-gold/20 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-semibold text-maroon-darker/60 uppercase tracking-wider">Pending Approvals</p>
            <h3 className="text-3xl font-serif font-bold text-maroon-darker mt-1">35</h3>
            <p className="text-xs text-amber-600 font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> Requires attention
            </p>
          </div>
          <div className="w-14 h-14 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={28} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-6 border border-gold/20 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-semibold text-maroon-darker/60 uppercase tracking-wider">Today's Bookings</p>
            <h3 className="text-3xl font-serif font-bold text-maroon-darker mt-1">42</h3>
            <p className="text-xs text-purple-600 font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> +5 vs yesterday
            </p>
          </div>
          <div className="w-14 h-14 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <CalendarCheck size={28} />
          </div>
        </div>

      </div>

      {/* Main Content Grid: Graph & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graph Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gold/20 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-serif font-bold text-maroon-darker">Task Performance</h3>
            <select className="bg-premium border border-gold/30 text-maroon-darker/80 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-maroon">
              <option>Last 7 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAssigned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#3a0d0a', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#3a0d0a', fontSize: 12}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d4af37" opacity={0.3} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.2)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold', color: '#791916' }}
                />
                <Area type="monotone" dataKey="tasksAssigned" stroke="#d4af37" strokeWidth={3} fillOpacity={1} fill="url(#colorAssigned)" />
                <Area type="monotone" dataKey="tasksCompleted" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-2xl border border-gold/20 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-serif font-bold text-maroon-darker">Recent Activity</h3>
            <button className="text-maroon-darker/50 hover:text-maroon"><MoreVertical size={20} /></button>
          </div>
          
          <div className="space-y-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                {/* Avatar / Initial */}
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-maroon font-bold shrink-0">
                  {activity.user.charAt(0)}
                </div>
                {/* Details */}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-maroon-darker">{activity.user}</p>
                  <p className="text-xs text-maroon-darker/60 mt-0.5 line-clamp-1">{activity.action}</p>
                  <p className="text-[10px] font-bold text-maroon-darker/40 mt-1 uppercase tracking-wider">{activity.time}</p>
                </div>
                {/* Status Badge */}
                <div>
                  <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider
                    ${activity.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                      activity.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 
                      'bg-red-50 text-red-600'}`}
                  >
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-2.5 text-sm font-bold text-maroon bg-maroon/5 hover:bg-gold/10 rounded-xl transition-colors border border-maroon/10">
            View All Activity
          </button>
        </div>

      </div>
    </div>
  );
}
