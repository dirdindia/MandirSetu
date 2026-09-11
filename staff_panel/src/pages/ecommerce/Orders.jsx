import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { 
  Search, Loader2, ChevronLeft, ChevronRight, Eye, Package, User, Trash2, Download
} from 'lucide-react';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/ecommerce/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      Swal.fire('Error', 'Failed to update order status', 'error');
    }
  };

  const handleDelete = async (orderId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/ecommerce/orders/${orderId}`);
        setOrders(orders.filter(order => order._id !== orderId));
        Swal.fire('Deleted!', 'The order has been deleted.', 'success');
      } catch (error) {
        console.error('Failed to delete order:', error);
        Swal.fire('Error', 'Failed to delete order', 'error');
      }
    }
  };

  const handleDownloadInvoice = (order) => {
    const doc = new jsPDF();
    const paymentId = order.paymentDetails?.razorpay_payment_id || 'N/A';
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(249, 115, 22); // orange-500
    doc.text("MandirSetu", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Order ID: ${order._id}`, 14, 30);
    doc.text(`Payment ID: ${paymentId}`, 14, 35);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 40);
    
    // Customer Details
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text("Bill To:", 14, 50);
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(order.customerDetails.fullName, 14, 57);
    doc.text(order.customerDetails.mobile, 14, 62);
    doc.text(order.customerDetails.email, 14, 67);
    doc.text(`${order.customerDetails.address}, ${order.customerDetails.city}`, 14, 72);
    doc.text(`${order.customerDetails.state} - ${order.customerDetails.pincode}`, 14, 77);

    // Table
    const tableColumn = ["Item", "Quantity", "Price", "Total"];
    const tableRows = [];

    order.items.forEach(item => {
      const itemData = [
        item.name,
        item.quantity.toString(),
        `Rs. ${item.price}`,
        `Rs. ${item.price * item.quantity}`
      ];
      tableRows.push(itemData);
    });

    autoTable(doc, {
      startY: 90,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [249, 115, 22] }, // orange header
      styles: { fontSize: 10 },
      margin: { top: 10 },
    });

    // Total Amount
    const finalY = doc.lastAutoTable.finalY || 90;
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text(`Total Amount: Rs. ${order.totalAmount}`, 14, finalY + 15);
    
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Thank you for shopping with MandirSetu!", 14, finalY + 30);

    // Download
    doc.save(`Invoice_${order._id}.pdf`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-maroon/10 text-blue-700  ';
      case 'Shipped': return 'bg-amber-100 text-amber-700  ';
      case 'Delivered': return 'bg-green-100 text-green-700  ';
      case 'Cancelled': return 'bg-red-100 text-red-700  ';
      default: return 'bg-gold/10 text-maroon-darker/80  ';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-maroon-darker ">Orders</h1>
          <p className="text-maroon-darker/60  text-sm mt-1">View and track customer orders.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white  p-4 rounded-2xl shadow-sm border border-gold/20  flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-maroon-darker/40" />
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gold/20  rounded-xl bg-premium  text-maroon-darker  focus:outline-none focus:ring-2 focus:ring-maroon transition-colors"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white  rounded-2xl shadow-sm border border-gold/20  overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-maroon-darker/60  bg-premium  uppercase border-b border-gold/20 ">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID / Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Total Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 ">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-maroon-darker/60">
                    <Loader2 size={24} className="animate-spin mx-auto text-maroon mb-2" />
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="hover:bg-premium  transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-maroon-darker  truncate max-w-[150px]">
                          #{order._id.substring(18).toUpperCase()}
                        </div>
                        <div className="text-xs text-maroon-darker/60  mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-maroon-darker/40" />
                          <div>
                            <p className="font-medium text-maroon-darker ">{order.customerDetails.fullName}</p>
                            <p className="text-xs text-maroon-darker/60">{order.customerDetails.mobile}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-maroon-darker/70 ">
                        {order.items.length} item(s)
                      </td>
                      <td className="px-6 py-4 font-semibold text-maroon-darker ">
                        ₹{order.totalAmount}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer focus:outline-none appearance-none bg-gold/10 ${getStatusColor(order.status)}`}
                          style={{ backgroundImage: 'none' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => toggleExpand(order._id)}
                            className="text-maroon-darker/60 hover:text-maroon  transition-colors cursor-pointer inline-flex items-center gap-1 bg-gold/10  px-3 py-1.5 rounded-lg text-xs font-medium"
                            title="View Details"
                          >
                            <Eye size={14} /> 
                          </button>
                          <button 
                            onClick={() => handleDownloadInvoice(order)}
                            className="text-maroon-darker/60 hover:text-orange-600  transition-colors cursor-pointer inline-flex items-center gap-1 bg-gold/10  px-3 py-1.5 rounded-lg text-xs font-medium"
                            title="Download Invoice"
                          >
                            <Download size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(order._id)}
                            className="text-maroon-darker/60 hover:text-red-600  transition-colors cursor-pointer inline-flex items-center gap-1 bg-gold/10  px-3 py-1.5 rounded-lg text-xs font-medium"
                            title="Delete Order"
                          >
                            <Trash2 size={14} /> 
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Expanded Content */}
                    {expandedOrderId === order._id && (
                      <tr className="bg-premium/50  border-b-0">
                        <td colSpan="6" className="px-6 py-4 border-t border-gold/20 ">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-maroon-darker  mb-3 text-xs uppercase tracking-wider text-maroon-darker/60">Order Items</h4>
                              <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center justify-between bg-white  p-3 rounded-xl border border-gold/20 ">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg bg-gold/10  flex items-center justify-center shrink-0">
                                        <Package size={18} className="text-maroon-darker/40" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-maroon-darker ">{item.name}</p>
                                        <p className="text-xs text-maroon-darker/60">Qty: {item.quantity} × ₹{item.price}</p>
                                      </div>
                                    </div>
                                    <div className="font-semibold text-maroon-darker  text-sm">
                                      ₹{item.quantity * item.price}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-maroon-darker  mb-3 text-xs uppercase tracking-wider text-maroon-darker/60">Shipping Details</h4>
                              <div className="bg-white  p-4 rounded-xl border border-gold/20  text-sm space-y-2">
                                <p><span className="text-maroon-darker/60">Name:</span> <span className="font-medium text-maroon-darker ">{order.customerDetails.fullName}</span></p>
                                <p><span className="text-maroon-darker/60">Phone:</span> <span className="font-medium text-maroon-darker ">{order.customerDetails.mobile}</span></p>
                                <p><span className="text-maroon-darker/60">Email:</span> <span className="font-medium text-maroon-darker ">{order.customerDetails.email}</span></p>
                                <p><span className="text-maroon-darker/60">Address:</span> <span className="font-medium text-maroon-darker ">{order.customerDetails.address}, {order.customerDetails.city}, {order.customerDetails.state} - {order.customerDetails.pincode}</span></p>
                              </div>

                              <h4 className="font-semibold text-maroon-darker  mt-4 mb-3 text-xs uppercase tracking-wider text-maroon-darker/60">Payment Info</h4>
                              <div className="bg-white  p-4 rounded-xl border border-gold/20  text-sm space-y-2">
                                <p><span className="text-maroon-darker/60">Status:</span> <span className="font-medium text-green-600">Success</span></p>
                                <p><span className="text-maroon-darker/60">Order ID:</span> <span className="font-medium text-maroon-darker ">{order.paymentDetails?.razorpay_order_id || 'N/A'}</span></p>
                                <p><span className="text-maroon-darker/60">Payment ID:</span> <span className="font-medium text-maroon-darker ">{order.paymentDetails?.razorpay_payment_id || 'N/A'}</span></p>
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
                  <td colSpan="6" className="px-6 py-12 text-center text-maroon-darker/60 ">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gold/20  flex items-center justify-between bg-premium ">
            <span className="text-sm text-maroon-darker/60 ">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
               <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gold/20  text-maroon-darker/70  hover:bg-gold/10  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gold/20  text-maroon-darker/70  hover:bg-gold/10  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
