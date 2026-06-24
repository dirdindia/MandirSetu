import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { 
  Search, Loader2, ChevronLeft, ChevronRight, Eye, Package, User
} from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Auth context for specific endpoints
  const mandir_id = localStorage.getItem('mandir_id') || ''; 
  const dham_id = localStorage.getItem('dham_id') || '';

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      let queryStr = `?page=${page}&limit=10&search=${searchQuery}`;
      if (mandir_id) queryStr += `&mandir_id=${mandir_id}`;
      else if (dham_id) queryStr += `&dham_id=${dham_id}`;

      const res = await axiosInstance.get(`/ecommerce/orders${queryStr}`);
      setOrders(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Shipped': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Orders</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">View and track customer orders.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID / Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Total Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <Loader2 size={24} className="animate-spin mx-auto text-blue-500 mb-2" />
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                          #{order._id.substring(18).toUpperCase()}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-200">{order.customerDetails.fullName}</p>
                            <p className="text-xs text-slate-500">{order.customerDetails.mobile}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {order.items.length} item(s)
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                        ₹{order.totalAmount}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => toggleExpand(order._id)}
                          className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-500 transition-colors cursor-pointer inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium"
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                    {/* Expanded Content */}
                    {expandedOrderId === order._id && (
                      <tr className="bg-slate-50/50 dark:bg-slate-800/20 border-b-0">
                        <td colSpan="6" className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 text-xs uppercase tracking-wider text-slate-500">Order Items</h4>
                              <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                        <Package size={18} className="text-slate-400" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.name}</p>
                                        <p className="text-xs text-slate-500">Qty: {item.quantity} × ₹{item.price}</p>
                                      </div>
                                    </div>
                                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                                      ₹{item.quantity * item.price}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 text-xs uppercase tracking-wider text-slate-500">Shipping Details</h4>
                              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-sm space-y-2">
                                <p><span className="text-slate-500">Name:</span> <span className="font-medium text-slate-800 dark:text-slate-200">{order.customerDetails.fullName}</span></p>
                                <p><span className="text-slate-500">Phone:</span> <span className="font-medium text-slate-800 dark:text-slate-200">{order.customerDetails.mobile}</span></p>
                                <p><span className="text-slate-500">Email:</span> <span className="font-medium text-slate-800 dark:text-slate-200">{order.customerDetails.email}</span></p>
                                <p><span className="text-slate-500">Address:</span> <span className="font-medium text-slate-800 dark:text-slate-200">{order.customerDetails.address}, {order.customerDetails.city}, {order.customerDetails.state} - {order.customerDetails.pincode}</span></p>
                              </div>

                              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-3 text-xs uppercase tracking-wider text-slate-500">Payment Info</h4>
                              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-sm space-y-2">
                                <p><span className="text-slate-500">Status:</span> <span className="font-medium text-green-600">Success</span></p>
                                <p><span className="text-slate-500">Order ID:</span> <span className="font-medium text-slate-800 dark:text-slate-200">{order.paymentDetails?.razorpay_order_id || 'N/A'}</span></p>
                                <p><span className="text-slate-500">Payment ID:</span> <span className="font-medium text-slate-800 dark:text-slate-200">{order.paymentDetails?.razorpay_payment_id || 'N/A'}</span></p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/30">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
               <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
