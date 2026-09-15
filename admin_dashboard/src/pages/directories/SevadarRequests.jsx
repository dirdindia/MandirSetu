import React, { useState, useEffect } from 'react';
import { MapPin, Phone, User, Calendar, CheckCircle, XCircle, ChevronLeft, ChevronRight, Eye, Briefcase } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import Swal from 'sweetalert2';

export default function SevadarRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async (currentPage) => {
    try {
      setLoading(true);
      // Fetching all staff and filtering on frontend, ideally should use a query param if backend supports it
      const res = await axiosInstance.get(`/staff?page=${currentPage}&limit=50`);
      
      const allStaff = res.data.data || res.data || [];
      // Filter for Pending status
      const pendingStaff = allStaff.filter(person => person.status === 'Pending');
      
      setRequests(pendingStaff);
      
      // We're using local filtering so pagination metadata might be slightly off. 
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(page);
  }, [page]);

  const handleApprove = async (id) => {
    const result = await Swal.fire({
      title: 'Approve Request?',
      text: "This user will become an active Sevadar.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, approve!'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.put(`/staff/${id}`, { status: 'Active' });
        Swal.fire('Approved!', 'Sevadar request has been approved.', 'success');
        fetchRequests(page);
      } catch (error) {
        Swal.fire('Error!', 'Failed to approve request.', 'error');
      }
    }
  };

  const handleReject = async (id) => {
    const result = await Swal.fire({
      title: 'Reject Request?',
      text: "This will permanently delete this application request.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, reject & delete!'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/staff/${id}`);
        Swal.fire('Rejected!', 'The application has been removed.', 'success');
        fetchRequests(page);
      } catch (error) {
        Swal.fire('Error!', 'Failed to reject request.', 'error');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-maroon mb-2">Sevadar Requests</h1>
        <p className="text-maroon-darker/60 font-medium">Review and manage pending Sevadar applications from the public portal.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gold/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-maroon/5 border-b border-gold/20 text-maroon-darker text-sm">
                <th className="p-4 font-bold">Applicant Details</th>
                <th className="p-4 font-bold">Role Applied For</th>
                <th className="p-4 font-bold">Location Info</th>
                <th className="p-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-maroon-darker/60 font-medium">
                    Loading requests...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                      <User size={32} className="text-slate-400" />
                    </div>
                    <p className="text-maroon-darker/60 font-medium">No pending Sevadar requests at the moment.</p>
                  </td>
                </tr>
              ) : (
                requests.map((person) => (
                  <tr key={person._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        {person.profilePic ? (
                          <img src={person.profilePic} alt={person.name} className="w-12 h-12 rounded-xl object-cover shadow-sm border border-slate-200" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-maroon/10 flex items-center justify-center text-maroon font-bold text-lg border border-maroon/20">
                            {person.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-maroon-darker text-sm">{person.name}</div>
                          <div className="text-xs text-maroon-darker/60 flex items-center gap-1 mt-1">
                            <Phone size={12} /> {person.contact?.phone || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gold/10 text-maroon-darker font-semibold text-xs border border-gold/20">
                        <Briefcase size={12} /> {person.employment?.role || 'Sevadar'}
                      </div>
                      <div className="text-[10px] text-maroon-darker/50 mt-1.5 uppercase font-bold tracking-wider">
                        Applied On: {new Date(person.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-maroon-darker mb-1">
                         {person.employment?.assignedMandir?.name || person.employment?.assignedDham?.name || 'Any Location'}
                      </div>
                      <div className="text-xs text-maroon-darker/60 flex items-center gap-1">
                        <MapPin size={12} /> {person.address?.city || 'City Unknown'}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => setSelectedRequest(person)}
                          className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                          title="View Full Application"
                        >
                          <Eye size={14} /> View
                        </button>
                        <button 
                          onClick={() => handleApprove(person._id)}
                          className="px-3 py-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button 
                          onClick={() => handleReject(person._id)}
                          className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Details (Basic) */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>Page {page} of {totalPages}</div>
          <div className="flex gap-2">
             <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-50"><ChevronLeft size={18} /></button>
             <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-50"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedRequest(null)}>
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="bg-maroon p-6 text-white flex items-center justify-between">
              <h3 className="text-xl font-bold font-serif">Application Details</h3>
              <button onClick={() => setSelectedRequest(null)} className="text-white/60 hover:text-white"><XCircle size={24} /></button>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Header Info */}
              <div className="flex items-start gap-4">
                 {selectedRequest.media?.profilePic ? (
                    <img src={selectedRequest.media.profilePic} alt="Profile" className="w-24 h-24 rounded-2xl object-cover shadow-sm border border-slate-200" />
                 ) : (
                    <div className="w-24 h-24 rounded-2xl bg-maroon/10 flex items-center justify-center text-maroon font-bold text-4xl border border-maroon/20">
                      {selectedRequest.name?.charAt(0)}
                    </div>
                 )}
                 <div>
                    <h4 className="text-2xl font-bold text-maroon">{selectedRequest.name}</h4>
                    <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-wider">{selectedRequest.employment?.role}</p>
                    <p className="text-xs text-maroon-darker/60 mt-1">Applied: {new Date(selectedRequest.createdAt).toLocaleString()}</p>
                 </div>
              </div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Personal Information */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h5 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><User size={14}/> Personal Details</h5>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-3"><span className="text-slate-500">Gender:</span> <span className="col-span-2 font-medium text-maroon-darker">{selectedRequest.gender || 'N/A'}</span></div>
                    <div className="grid grid-cols-3"><span className="text-slate-500">DOB:</span> <span className="col-span-2 font-medium text-maroon-darker">{selectedRequest.dob ? new Date(selectedRequest.dob).toLocaleDateString() : 'N/A'}</span></div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h5 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><Phone size={14}/> Contact Info</h5>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-3"><span className="text-slate-500">Phone:</span> <span className="col-span-2 font-medium text-maroon-darker">{selectedRequest.contact?.phone || 'N/A'}</span></div>
                    <div className="grid grid-cols-3"><span className="text-slate-500">Email:</span> <span className="col-span-2 font-medium text-maroon-darker">{selectedRequest.contact?.email || 'N/A'}</span></div>
                    <div className="grid grid-cols-3"><span className="text-slate-500">Emergency:</span> <span className="col-span-2 font-medium text-maroon-darker">{selectedRequest.contact?.emergencyContact || 'N/A'}</span></div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 md:col-span-2">
                  <h5 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><MapPin size={14}/> Location & Address</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="grid grid-cols-3 md:col-span-2"><span className="text-slate-500">Address:</span> <span className="col-span-2 font-medium text-maroon-darker">{selectedRequest.address || 'N/A'}</span></div>
                    <div className="grid grid-cols-3"><span className="text-slate-500">City:</span> <span className="col-span-2 font-medium text-maroon-darker">{selectedRequest.city || 'N/A'}</span></div>
                    <div className="grid grid-cols-3"><span className="text-slate-500">State:</span> <span className="col-span-2 font-medium text-maroon-darker">{selectedRequest.state || 'N/A'}</span></div>
                    <div className="grid grid-cols-3"><span className="text-slate-500">Pincode:</span> <span className="col-span-2 font-medium text-maroon-darker">{selectedRequest.pincode || 'N/A'}</span></div>
                    <div className="grid grid-cols-3"><span className="text-slate-500">Coordinates:</span> <span className="col-span-2 font-medium text-maroon-darker">{selectedRequest.geolocation?.coordinates ? `${selectedRequest.geolocation.coordinates[1]}, ${selectedRequest.geolocation.coordinates[0]}` : 'N/A'}</span></div>
                  </div>
                </div>

                {/* Employment & Documents */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 md:col-span-2">
                  <h5 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><Briefcase size={14}/> Application Info</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="grid grid-cols-3"><span className="text-slate-500">Role:</span> <span className="col-span-2 font-medium text-maroon-darker">{selectedRequest.employment?.role || 'N/A'}</span></div>
                    <div className="grid grid-cols-3"><span className="text-slate-500">Pref. Mandir:</span> <span className="col-span-2 font-medium text-maroon-darker">{selectedRequest.employment?.assignedMandir?.name || 'Any'}</span></div>
                    <div className="grid grid-cols-3"><span className="text-slate-500">Pref. Dham:</span> <span className="col-span-2 font-medium text-maroon-darker">{selectedRequest.employment?.assignedDham?.name || 'Any'}</span></div>
                    <div className="grid grid-cols-3"><span className="text-slate-500">Doc Type:</span> <span className="col-span-2 font-medium text-maroon-darker">{selectedRequest.media?.documentType || 'N/A'}</span></div>
                    <div className="grid grid-cols-3 md:col-span-2">
                      <span className="text-slate-500">Document:</span> 
                      <span className="col-span-2 font-medium">
                        {selectedRequest.media?.documentUrl ? (
                          <a href={selectedRequest.media.documentUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View Uploaded Document</a>
                        ) : (
                          <span className="text-slate-400">Not provided</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
               <button onClick={() => { setSelectedRequest(null); handleReject(selectedRequest._id); }} className="px-5 py-2 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors">Reject</button>
               <button onClick={() => { setSelectedRequest(null); handleApprove(selectedRequest._id); }} className="px-5 py-2 bg-green-600 text-white font-bold hover:bg-green-700 rounded-xl transition-colors shadow-sm">Approve Sevadar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
