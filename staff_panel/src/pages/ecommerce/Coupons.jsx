import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Swal from 'sweetalert2';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Image as ImageIcon,
  MoreVertical,
  X,
  Check,
  Upload,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;
  
  const [newCoupon, setNewCoupon] = useState({ 
    code: '', 
    discountType: 'percentage', 
    discountValue: '', 
    banner: '', 
    isActive: true,
    applicabilityType: 'all',
    applicableCategories: [],
    applicableProducts: []
  });
  const [editingCouponId, setEditingCouponId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const mandir_id = localStorage.getItem('mandir_id') || ''; 
  const dham_id = localStorage.getItem('dham_id') || '';

  useEffect(() => {
    fetchCoupons();
  }, [currentPage, searchQuery]);

  const loadCategoryOptions = async (inputValue) => {
    try {
      const params = new URLSearchParams();
      if (mandir_id) params.append('mandir_id', mandir_id);
      else if (dham_id) params.append('dham_id', dham_id);
      if (inputValue) params.append('search', inputValue);

      const queryStr = params.toString() ? `?${params.toString()}` : '';
      const res = await axiosInstance.get(`/ecommerce/categories${queryStr}`);
      return res.data.map(c => ({ value: c._id, label: c.name }));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  };

  const loadProductOptions = async (inputValue) => {
    try {
      const params = new URLSearchParams();
      if (mandir_id) params.append('mandir_id', mandir_id);
      else if (dham_id) params.append('dham_id', dham_id);
      if (inputValue) params.append('search', inputValue);
      params.append('limit', '50'); // limit async fetch to 50

      const queryStr = `?${params.toString()}`;
      const res = await axiosInstance.get(`/ecommerce/products${queryStr}`);
      return res.data.data.map(p => ({ value: p._id, label: p.name }));
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  };

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      let queryStr = `?page=${currentPage}&limit=${limit}`;
      if (searchQuery) queryStr += `&search=${searchQuery}`;
      if (mandir_id) queryStr += `&mandir_id=${mandir_id}`;
      else if (dham_id) queryStr += `&dham_id=${dham_id}`;

      const res = await axiosInstance.get(`/ecommerce/coupons${queryStr}`);
      setCoupons(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalItems(res.data.totalItems || 0);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (coupon) => {
    const actionText = coupon.isActive ? 'deactivate' : 'activate';
    
    const result = await Swal.fire({
      title: 'Change Status?',
      text: `Are you sure you want to ${actionText} this coupon?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: `Yes, ${actionText} it!`
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosInstance.patch(`/ecommerce/coupons/${coupon._id}/toggle-status`);
      setCoupons(coupons.map(c => 
        c._id === coupon._id ? { ...c, isActive: res.data.isActive } : c
      ));
      
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: `Coupon is now ${res.data.isActive ? 'active' : 'inactive'}.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      console.error('Failed to toggle status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to toggle status.'
      });
    }
  };

  const openEditModal = (coupon) => {
    setNewCoupon({ 
      code: coupon.code, 
      discountType: coupon.discountType, 
      discountValue: coupon.discountValue, 
      banner: coupon.banner || '', 
      isActive: coupon.isActive,
      applicabilityType: coupon.applicabilityType || 'all',
      applicableCategories: coupon.applicableCategories ? coupon.applicableCategories.map(c => ({ value: c._id, label: c.name })) : [],
      applicableProducts: coupon.applicableProducts ? coupon.applicableProducts.map(p => ({ value: p._id, label: p.name })) : []
    });
    setEditingCouponId(coupon._id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCouponId(null);
    setNewCoupon({ 
      code: '', discountType: 'percentage', discountValue: '', banner: '', isActive: true,
      applicabilityType: 'all', applicableCategories: [], applicableProducts: []
    });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;
    
    Swal.fire({
      title: 'Deleting...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      await axiosInstance.delete(`/ecommerce/coupons/${id}`);
      Swal.fire('Deleted!', 'Coupon has been deleted.', 'success');
      fetchCoupons(); // Re-fetch to handle pagination correctly
    } catch (error) {
      console.error('Failed to delete coupon:', error);
      Swal.fire('Error!', 'Failed to delete coupon.', 'error');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('files', file);

    setIsUploading(true);
    try {
      const res = await axiosInstance.post(`/upload/upload-files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.urls && res.data.urls.length > 0) {
        setNewCoupon({ ...newCoupon, banner: res.data.urls[0] });
        Swal.fire({
          icon: 'success',
          title: 'Uploaded!',
          text: 'Banner uploaded successfully.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      }
    } catch (error) {
      console.error('Banner upload failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Failed to upload banner. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discountValue) return;
    
    setIsSaving(true);
    try {
      const payload = {
        ...newCoupon,
        applicableCategories: newCoupon.applicableCategories.map(c => c.value),
        applicableProducts: newCoupon.applicableProducts.map(p => p.value),
        mandir_id: mandir_id || undefined,
        dham_id: dham_id || undefined
      };

      if (editingCouponId) {
        await axiosInstance.put(`/ecommerce/coupons/${editingCouponId}`, payload);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Coupon updated successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await axiosInstance.post(`/ecommerce/coupons`, payload);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Coupon created successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      }
      
      handleCloseModal();
      fetchCoupons(); // Refresh list to get accurate pagination
    } catch (error) {
      console.error('Failed to save coupon:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.message || 'Failed to save coupon.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Search trigger (debounced conceptually, using Enter or blur here but simpler to just trigger on submit)
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // reset to first page on new search
    fetchCoupons();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Coupons</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage discount coupons and promotional banners.</p>
        </div>
        <button 
          onClick={() => {
            setEditingCouponId(null);
            setNewCoupon({ code: '', discountType: 'percentage', discountValue: '', banner: '', isActive: true });
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm shadow-orange-500/30 transition-all flex items-center cursor-pointer"
        >
          <Plus size={18} className="mr-2" />
          Add Coupon
        </button>
      </div>

      {/* Filters and Search */}
      <form onSubmit={handleSearch} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search coupon code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
          />
        </div>
        <button type="submit" className="hidden">Search</button>
      </form>

      {/* Coupons Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Banner</th>
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Discount</th>
                <th className="px-6 py-4 font-medium">Applicability</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <Loader2 size={24} className="animate-spin mx-auto text-orange-500 mb-2" />
                    Loading coupons...
                  </td>
                </tr>
              ) : coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      {coupon.banner ? (
                        <img src={coupon.banner} alt={coupon.code} className="w-20 h-10 rounded object-cover border border-slate-200 dark:border-slate-700" />
                      ) : (
                        <div className="w-20 h-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-700">
                          <ImageIcon size={16} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{coupon.code}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs">
                      {coupon.applicabilityType === 'all' && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">All Products</span>}
                      {coupon.applicabilityType === 'specific_categories' && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{coupon.applicableCategories?.length || 0} Categories</span>}
                      {coupon.applicabilityType === 'specific_products' && <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">{coupon.applicableProducts?.length || 0} Products</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(coupon)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${coupon.isActive ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                        title={coupon.isActive ? "Active" : "Inactive"}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${coupon.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => openEditModal(coupon)}
                          className="text-slate-400 hover:text-orange-500 transition-colors cursor-pointer" title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(coupon._id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer" title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No coupons found. Click "Add Coupon" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Server Side Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing page <span className="font-medium text-slate-800 dark:text-slate-200">{currentPage}</span> of <span className="font-medium text-slate-800 dark:text-slate-200">{totalPages}</span> 
              {' '}({totalItems} total items)
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {editingCouponId ? 'Edit Coupon' : 'Add New Coupon'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveCoupon} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Coupon Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. DIWALI50"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Discount Type</label>
                  <select 
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({...newCoupon, discountType: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Discount Value</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    placeholder="e.g. 50"
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({...newCoupon, discountValue: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Applicability Section */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Coupon Applicability</label>
                
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="applicability" 
                      value="all" 
                      checked={newCoupon.applicabilityType === 'all'} 
                      onChange={(e) => setNewCoupon({...newCoupon, applicabilityType: e.target.value})}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    All Products
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="applicability" 
                      value="specific_categories" 
                      checked={newCoupon.applicabilityType === 'specific_categories'} 
                      onChange={(e) => setNewCoupon({...newCoupon, applicabilityType: e.target.value})}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    Specific Categories
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="applicability" 
                      value="specific_products" 
                      checked={newCoupon.applicabilityType === 'specific_products'} 
                      onChange={(e) => setNewCoupon({...newCoupon, applicabilityType: e.target.value})}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    Specific Products
                  </label>
                </div>

                {newCoupon.applicabilityType === 'specific_categories' && (
                  <div>
                    <AsyncSelect
                      isMulti
                      cacheOptions
                      defaultOptions
                      loadOptions={loadCategoryOptions}
                      value={newCoupon.applicableCategories}
                      onChange={(selected) => setNewCoupon({...newCoupon, applicableCategories: selected || []})}
                      placeholder="Search categories..."
                      className="text-sm"
                      classNamePrefix="select"
                      menuPosition="fixed"
                    />
                  </div>
                )}

                {newCoupon.applicabilityType === 'specific_products' && (
                  <div>
                    <AsyncSelect
                      isMulti
                      cacheOptions
                      defaultOptions
                      loadOptions={loadProductOptions}
                      value={newCoupon.applicableProducts}
                      onChange={(selected) => setNewCoupon({...newCoupon, applicableProducts: selected || []})}
                      placeholder="Search products..."
                      className="text-sm"
                      classNamePrefix="select"
                      menuPosition="fixed"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Coupon Banner (Visible to User)</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 relative group">
                    {isUploading ? (
                      <Loader2 size={20} className="text-orange-500 animate-spin" />
                    ) : newCoupon.banner ? (
                      <img src={newCoupon.banner} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={20} className="text-slate-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <label className="cursor-pointer bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center w-max">
                      <Upload size={16} className="mr-2" />
                      {isUploading ? 'Uploading...' : 'Upload Banner'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                    <p className="text-xs text-slate-500 mt-2">Recommended: 800x400px. Max 2MB.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewCoupon({...newCoupon, isActive: !newCoupon.isActive})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${newCoupon.isActive ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newCoupon.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Status</p>
                  <p className="text-xs text-slate-500">Allow users to apply this coupon</p>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 mt-6">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                  {isSaving ? 'Saving...' : (editingCouponId ? 'Update Coupon' : 'Save Coupon')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
