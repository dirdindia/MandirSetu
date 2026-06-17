import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Swal from 'sweetalert2';
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
  Loader2
} from 'lucide-react';


export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newCategory, setNewCategory] = useState({ name: '', description: '', image: '', isVisible: true });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // In a real scenario, you'd get these from the logged-in staff user's context/auth token
  const mandir_id = localStorage.getItem('mandir_id') || ''; 
  const dham_id = localStorage.getItem('dham_id') || '';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      // Build query string based on what's available
      let queryStr = '';
      if (mandir_id) queryStr += `?mandir_id=${mandir_id}`;
      else if (dham_id) queryStr += `?dham_id=${dham_id}`;

      const res = await axiosInstance.get(`/ecommerce/categories${queryStr}`);
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVisibility = async (category) => {
    const actionText = category.isVisible ? 'hide' : 'show';
    
    const result = await Swal.fire({
      title: 'Change Visibility?',
      text: `Are you sure you want to ${actionText} this category?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: `Yes, ${actionText} it!`
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosInstance.patch(`/ecommerce/categories/${category._id}/toggle-visibility`);
      setCategories(categories.map(cat => 
        cat._id === category._id ? { ...cat, isVisible: res.data.isVisible } : cat
      ));
      
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: `Category is now ${res.data.isVisible ? 'visible' : 'hidden'}.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to toggle visibility.'
      });
    }
  };

  const openEditModal = (category) => {
    setNewCategory({ 
      name: category.name, 
      description: category.description || '', 
      image: category.image || '', 
      isVisible: category.isVisible 
    });
    setEditingCategoryId(category._id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategoryId(null);
    setNewCategory({ name: '', description: '', image: '', isVisible: true });
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
    
    // Show loader
    Swal.fire({
      title: 'Deleting...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      await axiosInstance.delete(`/ecommerce/categories/${id}`);
      setCategories(categories.filter(cat => cat._id !== id));
      Swal.fire('Deleted!', 'Category has been deleted.', 'success');
    } catch (error) {
      console.error('Failed to delete category:', error);
      Swal.fire('Error!', 'Failed to delete category.', 'error');
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
      // The upload API returns an array of urls under `urls`
      if (res.data && res.data.urls && res.data.urls.length > 0) {
        setNewCategory({ ...newCategory, image: res.data.urls[0] });
        Swal.fire({
          icon: 'success',
          title: 'Uploaded!',
          text: 'Image uploaded successfully.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Failed to upload image. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name) return;
    
    setIsSaving(true);
    try {
      const payload = {
        ...newCategory,
        mandir_id: mandir_id || undefined,
        dham_id: dham_id || undefined
      };

      if (editingCategoryId) {
        // Update existing category
        const res = await axiosInstance.put(`/ecommerce/categories/${editingCategoryId}`, payload);
        setCategories(categories.map(cat => cat._id === editingCategoryId ? res.data : cat));
        
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Category updated successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        // Create new category
        const res = await axiosInstance.post(`/ecommerce/categories`, payload);
        setCategories([res.data, ...categories]);
        
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Category created successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save category:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to save category.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Categories</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage product categories for your Mandir.</p>
        </div>
        <button 
          onClick={() => {
            setEditingCategoryId(null);
            setNewCategory({ name: '', description: '', image: '', isVisible: true });
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm shadow-blue-500/30 transition-all flex items-center cursor-pointer"
        >
          <Plus size={18} className="mr-2" />
          Add Category
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
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Image</th>
                <th className="px-6 py-4 font-medium">Category Name</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium text-center">Visibility</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <Loader2 size={24} className="animate-spin mx-auto text-blue-500 mb-2" />
                    Loading categories...
                  </td>
                </tr>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      {category.image ? (
                        <img src={category.image} alt={category.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-700">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{category.name}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 truncate max-w-xs">{category.description || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleVisibility(category)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${category.isVisible ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                        title={category.isVisible ? "Visible to customers" : "Hidden from customers"}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${category.isVisible ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => openEditModal(category)}
                          className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors cursor-pointer" title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(category._id)}
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
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No categories found. Click "Add Category" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {editingCategoryId ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddCategory} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Prasad"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea 
                  rows="3"
                  placeholder="Short description about this category"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 relative group">
                    {isUploading ? (
                      <Loader2 size={24} className="text-blue-500 animate-spin" />
                    ) : newCategory.image ? (
                      <img src={newCategory.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={24} className="text-slate-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <label className="cursor-pointer bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center w-max">
                      <Upload size={16} className="mr-2" />
                      {isUploading ? 'Uploading...' : 'Upload Image'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                    <p className="text-xs text-slate-500 mt-2">Recommended: 400x400px. Max 2MB.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewCategory({...newCategory, isVisible: !newCategory.isVisible})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${newCategory.isVisible ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newCategory.isVisible ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Visible to Customers</p>
                  <p className="text-xs text-slate-500">Allow this category to be shown on the storefront</p>
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                  {isSaving ? 'Saving...' : (editingCategoryId ? 'Update Category' : 'Save Category')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
