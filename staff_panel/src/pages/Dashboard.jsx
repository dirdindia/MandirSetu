import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    const role = localStorage.getItem('user-role');

    if (!token || role !== 'staff') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Staff Overview</h2>
        <p className="text-slate-500 text-sm mt-1">Welcome back! Here's your task summary for today.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Assigned Tasks</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">124</h3>
            <p className="text-xs text-blue-500 font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> +12 this week
            </p>
          </div>
          <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
            <ClipboardList size={28} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Completed Tasks</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">89</h3>
            <p className="text-xs text-emerald-500 font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> 72% completion rate
            </p>
          </div>
          <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
            <CheckSquare size={28} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending Approvals</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">35</h3>
            <p className="text-xs text-amber-500 font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> Requires attention
            </p>
          </div>
          <div className="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
            <Clock size={28} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Today's Bookings</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">42</h3>
            <p className="text-xs text-purple-500 font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> +5 vs yesterday
            </p>
          </div>
          <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
            <CalendarCheck size={28} />
          </div>
        </div>

      </div>

      {/* Main Content Grid: Graph & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graph Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Task Performance</h3>
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg px-3 py-1.5 outline-none">
              <option>Last 7 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAssigned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="tasksAssigned" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAssigned)" />
                <Area type="monotone" dataKey="tasksCompleted" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
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

          <button className="w-full mt-6 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-xl transition-colors">
            View All Activity
          </button>
        </div>

      </div>
    </div>
  );
}
