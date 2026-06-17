import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2, Box, Layers, Package } from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {product.category?.name || 'Uncategorized'} • ₹{product.sellingPrice || product.price}
              </p>
              
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
            <button className="px-3 py-1.5 hover:bg-slate-50 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400 rounded-lg text-sm font-medium transition-colors opacity-50 cursor-not-allowed">
              Orders (Soon)
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
