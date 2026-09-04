import React, { useState, useEffect } from 'react';
import { Trash2, Calendar, MapPin, Search } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axiosInstance.delete(`/events/${id}`);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const filteredEvents = events.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Events List</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage all spiritual events across the platform.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <input 
            type="text" 
            placeholder="Search events..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
          />
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Event</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Date & Time</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Category</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-500">Loading events...</td></tr>
              ) : filteredEvents.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-500">No events found.</td></tr>
              ) : (
                filteredEvents.map(event => (
                  <tr key={event._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img src={event.image} alt={event.title} className="w-16 h-16 rounded-lg object-cover bg-slate-200" />
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white">{event.title}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin size={12}/> {event.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1"><Calendar size={14}/> {event.date}</span>
                        <span className="text-xs text-slate-500">{event.time}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 rounded-full text-xs font-medium">
                        {event.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleDelete(event._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
