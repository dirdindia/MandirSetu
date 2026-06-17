import React, { useState } from 'react';
import { 
  IndianRupee, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  Filter
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

// --- Dummy Data ---
const salesData = [
  { name: 'Mon', sales: 4000, orders: 24 },
  { name: 'Tue', sales: 3000, orders: 18 },
  { name: 'Wed', sales: 5000, orders: 35 },
  { name: 'Thu', sales: 2780, orders: 15 },
  { name: 'Fri', sales: 6890, orders: 48 },
  { name: 'Sat', sales: 8390, orders: 62 },
  { name: 'Sun', sales: 10490, orders: 85 },
];

const topProductsData = [
  { name: 'Premium Prasad Box', sales: 400 },
  { name: 'Pure Desi Ghee 1L', sales: 300 },
  { name: 'Rudraksha Mala', sales: 200 },
  { name: 'Incense Sticks Set', sales: 150 },
  { name: 'Ganga Jal Bottle', sales: 100 },
];

const recentOrders = [
  { id: 'ORD-8921', customer: 'Rahul Sharma', amount: 1250, status: 'Delivered', date: 'Just now' },
  { id: 'ORD-8920', customer: 'Priya Singh', amount: 450, status: 'Processing', date: '10 mins ago' },
  { id: 'ORD-8919', customer: 'Amit Kumar', amount: 2100, status: 'Pending', date: '1 hour ago' },
  { id: 'ORD-8918', customer: 'Neha Gupta', amount: 850, status: 'Delivered', date: '2 hours ago' },
  { id: 'ORD-8917', customer: 'Vikram Patel', amount: 3200, status: 'Cancelled', date: '3 hours ago' },
  { id: 'ORD-8916', customer: 'Anjali Desai', amount: 150, status: 'Delivered', date: '5 hours ago' },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-all hover:shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={24} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      {trend === 'up' ? (
        <span className="flex items-center text-emerald-500 font-medium bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
          <TrendingUp size={16} className="mr-1" />
          +{trendValue}%
        </span>
      ) : (
        <span className="flex items-center text-rose-500 font-medium bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded-lg">
          <TrendingDown size={16} className="mr-1" />
          -{trendValue}%
        </span>
      )}
      <span className="text-slate-400 ml-2">vs last week</span>
    </div>
  </div>
);

const getStatusBadge = (status) => {
  switch (status) {
    case 'Delivered':
      return <span className="flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"><CheckCircle2 size={12} className="mr-1" /> Delivered</span>;
    case 'Processing':
      return <span className="flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"><Clock size={12} className="mr-1" /> Processing</span>;
    case 'Pending':
      return <span className="flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"><Clock size={12} className="mr-1" /> Pending</span>;
    case 'Cancelled':
      return <span className="flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"><XCircle size={12} className="mr-1" /> Cancelled</span>;
    default:
      return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">{status}</span>;
  }
};

export default function Overview() {
  const [timeRange, setTimeRange] = useState('7days');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">E-Commerce Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track your Mandir's store performance and recent activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="year">This Year</option>
          </select>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm shadow-blue-500/30 transition-all flex items-center">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="₹ 40,540" 
          icon={IndianRupee} 
          trend="up" 
          trendValue="12.5" 
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
        />
        <StatCard 
          title="Total Orders" 
          value="287" 
          icon={ShoppingBag} 
          trend="up" 
          trendValue="8.2" 
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
        />
        <StatCard 
          title="Avg. Order Value" 
          value="₹ 141.25" 
          icon={TrendingUp} 
          trend="down" 
          trendValue="2.1" 
          colorClass="bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
        />
        <StatCard 
          title="Active Products" 
          value="45" 
          icon={Package} 
          trend="up" 
          trendValue="4.5" 
          colorClass="bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Sales Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Revenue Overview</h2>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><MoreVertical size={20} /></button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Top Products</h2>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><MoreVertical size={20} /></button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={120} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [value, 'Units Sold']}
                />
                <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Orders</h2>
          <button className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Time</th>
                
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{order.id}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{order.customer}</td>
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">₹{order.amount}</td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{order.date}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
