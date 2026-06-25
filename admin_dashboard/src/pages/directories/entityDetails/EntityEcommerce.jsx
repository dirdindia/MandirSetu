import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2, Box, Layers, Package, Download } from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function EntityEcommerce() {
  const { endpointBase, type } = useOutletContext();
  const [dataList, setDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // activeSubTab: categories, products, orders
  const [activeSubTab, setActiveSubTab] = useState('categories');

  useEffect(() => {
    fetchData(page, activeSubTab);
  }, [page, endpointBase, activeSubTab]);

  const fetchData = async (targetPage, tab) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`${endpointBase}/full-details?type=${tab}&page=${targetPage}&limit=10`);
      setDataList(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalItems(res.data.totalItems || 0);
      setPage(res.data.currentPage || 1);
    } catch (error) {
      console.error(`Failed to fetch ${tab}:`, error);
      setDataList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    if (tab === activeSubTab) return;
    setActiveSubTab(tab);
    setPage(1);
    setDataList([]);
  };

  const renderCategories = () => {
    return dataList.map((item) => (
      <li key={item._id} className="p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-100 dark:border-slate-800/60 last:border-0">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Layers size={24} />
                )}
            </div>
            <div>
              <h4 className="font-medium text-slate-800 dark:text-slate-200">{item.name}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{item.description || 'No description'}</p>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Visibility: {item.isVisible ? 'Visible' : 'Hidden'}
                </div>
                {item.onboardedBy && (
                  <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    Onboarded by: {item.onboardedBy.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </li>
    ));
  };

  const renderProducts = () => {
    return dataList.map((product) => (
      <li key={product._id} className="p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-100 dark:border-slate-800/60 last:border-0">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 border border-slate-200 dark:border-slate-700">
                {product.displayImage ? (
                  <img src={product.displayImage} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Package size={24} />
                )}
            </div>
            <div>
              <h4 className="font-medium text-slate-800 dark:text-slate-200">{product.name}</h4>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 flex items-baseline gap-2">
                <span>{product.category?.name || 'Uncategorized'}</span>
                <span>•</span>
                {product.sellingPrice ? (
                  <>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">₹{product.sellingPrice} {product.unit && <span className="text-xs text-slate-500 font-normal">/ {product.unit}</span>}</span>
                    <span className="text-xs text-slate-400 line-through">₹{product.price}</span>
                  </>
                ) : (
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹{product.price} {product.unit && <span className="text-xs text-slate-500 font-normal">/ {product.unit}</span>}</span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Stock: {product.stock}
                </div>
                <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Visibility: {product.isVisible ? 'Visible' : 'Hidden'}
                </div>
                {product.onboardedBy && (
                  <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    Onboarded by: {product.onboardedBy.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </li>
    ));
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

  const renderOrders = () => {
    return dataList.map((order) => (
      <li key={order._id} className="p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-100 dark:border-slate-800/60 last:border-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="font-medium text-slate-800 dark:text-slate-200">
              Order #{order._id.substring(18).toUpperCase()}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s)
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:items-end w-full sm:w-auto bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Customer</p>
            <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{order.customerDetails.fullName}</p>
            <p className="text-xs text-slate-500">{order.customerDetails.mobile}</p>
          </div>
          
          <div className="flex flex-col sm:items-end w-full sm:w-auto">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total</p>
            <div className="flex items-center gap-3">
              <p className="font-bold text-slate-800 dark:text-slate-200">₹{order.totalAmount}</p>
              <button 
                onClick={() => handleDownloadInvoice(order)}
                className="text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 p-1.5 rounded-lg transition-colors cursor-pointer"
                title="Download Invoice"
              >
                <Download size={18} />
              </button>
            </div>
          </div>
        </div>
      </li>
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center overflow-x-auto">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mr-4 shrink-0">
          <Box className="text-blue-500" />
          E-Commerce
        </h2>
        
        <div className="flex gap-2 shrink-0">
            <button 
              onClick={() => handleTabChange('categories')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeSubTab === 'categories' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'hover:bg-slate-50 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400'}`}
            >
              Categories
            </button>
            <button 
              onClick={() => handleTabChange('products')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeSubTab === 'products' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'hover:bg-slate-50 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400'}`}
            >
              Products
            </button>
            <button 
              onClick={() => handleTabChange('orders')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeSubTab === 'orders' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'hover:bg-slate-50 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400'}`}
            >
              Orders
            </button>
        </div>
      </div>

      <div className="p-0 flex-1">
        {isLoading ? (
          <div className="p-12 flex items-center justify-center text-slate-500">
            <Loader2 size={24} className="animate-spin text-blue-500" />
          </div>
        ) : dataList.length > 0 ? (
          <ul className="flex flex-col">
            {activeSubTab === 'categories' ? renderCategories() : null}
            {activeSubTab === 'products' ? renderProducts() : null}
            {activeSubTab === 'orders' ? renderOrders() : null}
          </ul>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <p>No {activeSubTab} found for this {type}.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <span className="text-sm text-slate-500">
            Showing page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[3rem] text-center">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
