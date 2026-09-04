import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    image: '',
    description: '',
    category: 'Festival'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await axiosInstance.post('/events', formData);
      setMessage({ type: 'success', text: 'Event created successfully!' });
      setFormData({
        title: '', date: '', time: '', location: '', image: '', description: '', category: 'Festival'
      });
    } catch (error) {
      console.error('Error creating event:', error);
      setMessage({ type: 'error', text: 'Failed to create event. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Create New Event</h1>
          <p className="text-slate-600 dark:text-slate-400">Add a new spiritual event, festival, or yatra to the platform.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
        {message.text && (
          <div className={`p-4 mb-6 rounded-lg font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Event Title *</label>
              <input 
                type="text" name="title" required value={formData.title} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g. Maha Shivratri Celebration"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category *</label>
              <select 
                name="category" required value={formData.category} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value="Festival">Festival</option>
                <option value="Ritual">Ritual</option>
                <option value="Yatra">Yatra</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date *</label>
              <input 
                type="text" name="date" required value={formData.date} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g. March 8, 2026 or Every Evening"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time *</label>
              <input 
                type="text" name="time" required value={formData.time} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g. 6:00 PM - 12:00 AM"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location *</label>
              <input 
                type="text" name="location" required value={formData.location} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g. Kashi Vishwanath Temple, Varanasi"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL *</label>
              <input 
                type="url" name="image" required value={formData.image} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="https://..."
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description *</label>
              <textarea 
                name="description" required value={formData.description} onChange={handleChange} rows="4"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Describe the event..."
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-8 rounded-lg shadow-md transition-colors disabled:opacity-70"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
