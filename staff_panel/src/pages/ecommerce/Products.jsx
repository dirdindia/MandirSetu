import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Swal from 'sweetalert2';
import { 
  Plus, Search, Edit, Trash2, Image as ImageIcon, 
  MoreVertical, X, Check, Upload, Loader2, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form State
  const initialProductState = {
    name: '', description: '', category: '', price: '', 
    sellingPrice: '', stock: 0, displayImage: '', gallery: [], isVisible: true
  };
  const [newProduct, setNewProduct] = useState(initialProductState);
  const [editingProductId, setEditingProductId] = useState(null);
  
  // Loading states
  const [isUploadingDisplay, setIsUploadingDisplay] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Auth context for specific endpoints
  const mandir_id = localStorage.getItem('mandir_id') || ''; 
  const dham_id = localStorage.getItem('dham_id') || '';

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  // Use a simple debounce logic for search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const fetchCategories = async () => {
    try {
      let queryStr = '';
      if (mandir_id) queryStr += `?mandir_id=${mandir_id}`;
      else if (dham_id) queryStr += `?dham_id=${dham_id}`;
      
      const res = await axiosInstance.get(`/ecommerce/categories${queryStr}`);
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let queryStr = `?page=${page}&limit=10&search=${searchQuery}`;
      if (mandir_id) queryStr += `&mandir_id=${mandir_id}`;
      else if (dham_id) queryStr += `&dham_id=${dham_id}`;

      const res = await axiosInstance.get(`/ecommerce/products${queryStr}`);
      setProducts(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVisibility = async (product) => {
    const actionText = product.isVisible ? 'hide' : 'show';
    
    const result = await Swal.fire({
      title: 'Change Visibility?',
      text: `Are you sure you want to ${actionText} this product?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: `Yes, ${actionText} it!`
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosInstance.patch(`/ecommerce/products/${product._id}/toggle-visibility`);
      setProducts(products.map(p => 
        p._id === product._id ? { ...p, isVisible: res.data.isVisible } : p
      ));
      
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: `Product is now ${res.data.isVisible ? 'visible' : 'hidden'}.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Failed to toggle visibility.' });
    }
  };

  const openEditModal = (product) => {
    setNewProduct({ 
      name: product.name, 
      description: product.description || '', 
      category: product.category ? product.category._id : '', 
      price: product.price,
      sellingPrice: product.sellingPrice || '',
      stock: product.stock || 0,
      displayImage: product.displayImage || '', 
      gallery: product.gallery || [],
      isVisible: product.isVisible 
    });
    setEditingProductId(product._id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProductId(null);
    setNewProduct(initialProductState);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    Swal.fire({ title: 'Deleting...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }});

    try {
      await axiosInstance.delete(`/ecommerce/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      Swal.fire('Deleted!', 'Product has been deleted.', 'success');
      fetchProducts(); // Refresh if page needs adjustment
    } catch (error) {
      console.error('Failed to delete product:', error);
      Swal.fire('Error!', 'Failed to delete product.', 'error');
    }
  };

  const handleDisplayImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('files', file);

    setIsUploadingDisplay(true);
    try {
      const res = await axiosInstance.post(`/upload/upload-files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.urls && res.data.urls.length > 0) {
        setNewProduct({ ...newProduct, displayImage: res.data.urls[0] });
      }
    } catch (error) {
      console.error('Display image upload failed:', error);
      Swal.fire({ icon: 'error', title: 'Upload Failed', text: 'Failed to upload image.' });
    } finally {
      setIsUploadingDisplay(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    setIsUploadingGallery(true);
    try {
      const res = await axiosInstance.post(`/upload/upload-files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.urls && res.data.urls.length > 0) {
        setNewProduct(prev => ({ 
          ...prev, 
          gallery: [...prev.gallery, ...res.data.urls] 
        }));
      }
    } catch (error) {
      console.error('Gallery upload failed:', error);
      Swal.fire({ icon: 'error', title: 'Upload Failed', text: 'Failed to upload gallery images.' });
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    setNewProduct(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      Swal.fire({ icon: 'warning', title: 'Missing Fields', text: 'Name, Price and Category are required.' });
      return;
    }
    
    setIsSaving(true);
    try {
      const payload = {
        ...newProduct,
        mandir_id: mandir_id || undefined,
        dham_id: dham_id || undefined
      };

      if (editingProductId) {
        await axiosInstance.put(`/ecommerce/products/${editingProductId}`, payload);
        Swal.fire({ icon: 'success', title: 'Success!', text: 'Product updated successfully.', timer: 2000, showConfirmButton: false });
      } else {
        await axiosInstance.post(`/ecommerce/products`, payload);
        Swal.fire({ icon: 'success', title: 'Success!', text: 'Product created successfully.', timer: 2000, showConfirmButton: false });
      }
      
      handleCloseModal();
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Failed to save product.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Products</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage physical products, prasad, and merchandise.</p>
        </div>
        <button 
          onClick={() => { setIsModalOpen(true); }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm shadow-blue-500/30 transition-all flex items-center cursor-pointer"
        >
          <Plus size={18} className="mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium text-center">Visibility</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <Loader2 size={24} className="animate-spin mx-auto text-blue-500 mb-2" />
                    Loading products...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {product.displayImage ? (
                          <img src={product.displayImage} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-700">
                            <ImageIcon size={20} />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200">{product.name}</p>
                          {product.gallery?.length > 0 && (
                            <p className="text-xs text-slate-400">{product.gallery.length} extra images</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {product.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        {product.sellingPrice ? (
                          <>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">₹{product.sellingPrice}</span>
                            <span className="text-xs text-slate-400 line-through">₹{product.price}</span>
                          </>
                        ) : (
                          <span className="font-semibold text-slate-800 dark:text-slate-200">₹{product.price}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : product.stock > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleVisibility(product)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${product.isVisible ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.isVisible ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors cursor-pointer" title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-500 transition-colors cursor-pointer" title="Delete"
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
                    No products found. Click "Add Product" to create one.
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

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-start justify-center z-50 p-4 sm:p-6 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 my-8 sm:my-10 relative">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 rounded-t-2xl z-10">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {editingProductId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name *</label>
                  <input 
                    type="text" required
                    placeholder="e.g. Rudraksh Mala"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                  <select 
                    required
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Original Price (₹) *</label>
                  <input 
                    type="number" required min="0"
                    placeholder="1000"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Selling Price (₹) <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <input 
                    type="number" min="0"
                    placeholder="800"
                    value={newProduct.sellingPrice}
                    onChange={(e) => setNewProduct({...newProduct, sellingPrice: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea 
                  rows="3"
                  placeholder="Detailed description about the product"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Display Image Upload */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Main Display Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {isUploadingDisplay ? (
                      <Loader2 size={24} className="text-blue-500 animate-spin" />
                    ) : newProduct.displayImage ? (
                      <img src={newProduct.displayImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={28} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="cursor-pointer bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium inline-flex items-center">
                      <Upload size={16} className="mr-2" />
                      {isUploadingDisplay ? 'Uploading...' : 'Choose Image'}
                      <input type="file" accept="image/*" className="hidden" onChange={handleDisplayImageUpload} disabled={isUploadingDisplay} />
                    </label>
                    <p className="text-xs text-slate-500 mt-2">Used as the main thumbnail. Recommended: 800x800px.</p>
                  </div>
                </div>
              </div>

              {/* Gallery Upload */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Gallery Images</label>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {newProduct.gallery.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group">
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    
                    <label className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex flex-col items-center justify-center cursor-pointer text-slate-500">
                      {isUploadingGallery ? (
                        <Loader2 size={20} className="animate-spin text-blue-500" />
                      ) : (
                        <>
                          <Plus size={20} className="mb-1" />
                          <span className="text-[10px] font-medium">Add More</span>
                        </>
                      )}
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} disabled={isUploadingGallery} />
                    </label>
                  </div>
                  <p className="text-xs text-slate-500">Upload multiple images to show different angles of the product.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Stock *</label>
                  <input 
                    type="number" required min="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setNewProduct({...newProduct, isVisible: !newProduct.isVisible})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${newProduct.isVisible ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newProduct.isVisible ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <div className="-mt-1">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Visible on Store</p>
                    <p className="text-[10px] text-slate-500">Show to customers</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-900 rounded-b-2xl -mx-6 px-6 pb-2">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving || isUploadingDisplay || isUploadingGallery}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                  {isSaving ? 'Saving...' : (editingProductId ? 'Update Product' : 'Save Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
