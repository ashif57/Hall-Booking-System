import React, { useState, useEffect, useCallback } from 'react';
import { Check, X, Loader, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchAllBookings, approveBooking, rejectBooking, fetchOffices, fetchCategories, fetchSessions } from '../../api/axios';
import EditBookingModal from './EditBookingModal';

const BookingApprovalList = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending'); // Default filter to Pending
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectBookingId, setRejectBookingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [editingBooking, setEditingBooking] = useState(null);
  const [offices, setOffices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSession, setSelectedSession] = useState('');

  const getBookings = useCallback(async () => {
    try {
      setLoading(true);
      const [bookingsData, officesData, categoriesData, sessionsData] = await Promise.all([
        fetchAllBookings(),
        fetchOffices(),
        fetchCategories(),
        fetchSessions()
      ]);
      setAllBookings(bookingsData);
      setOffices(officesData);
      setCategories(categoriesData);
      setSessions(sessionsData);
    } catch (error) {
      toast.error('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getBookings();
  }, [getBookings]);

  const handleApprove = async (id) => {
    try {
      await approveBooking(id);
      toast.success(`Booking #${id} approved!`);
      getBookings(); // Refetch all bookings
    } catch (error) {
      toast.error('Failed to approve booking.');
    }
  };

  const openRejectModal = (id) => {
    setRejectBookingId(id);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectBookingId) return;
    
    try {
      await rejectBooking(rejectBookingId, rejectReason);
      toast.error(`Booking #${rejectBookingId} rejected.`);
      setShowRejectModal(false);
      setRejectBookingId(null);
      setRejectReason('');
      getBookings(); // Refetch all bookings
    } catch (error) {
      toast.error('Failed to reject booking.');
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
  };

  const handleBookingUpdated = (updatedBooking) => {
    setAllBookings(prevBookings => prevBookings.map(b => b.id === updatedBooking.id ? updatedBooking : b));
  };

  const filteredBookings = allBookings.filter(booking => {
    const statusFilter = filter === 'All' || booking.status === filter;
    const officeFilter = selectedOffice === '' || booking.office === parseInt(selectedOffice);
    const categoryFilter = selectedCategory === '' || booking.hall_category === selectedCategory;
    const sessionFilter = selectedSession === '' || booking.session === parseInt(selectedSession);

    return statusFilter && officeFilter && categoryFilter && sessionFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Approvals & Management</h2> */}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'].map((statusOption) => (
          <button
            key={statusOption}
            onClick={() => setFilter(statusOption)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === statusOption
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-200 text-text-charcoal hover:bg-gray-300'
            }`}
          >
            {statusOption}
          </button>
        ))}
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Office Filter */}
        <select
          value={selectedOffice}
          onChange={(e) => setSelectedOffice(e.target.value)}
          className="px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-text-charcoal"
        >
          <option value="">All Offices</option>
          {offices.map((office) => (
            <option key={office.id} value={office.id}>
              {office.office_name}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-text-charcoal"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Session Filter */}
        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
          className="px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-text-charcoal"
        >
          <option value="">All Sessions</option>
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.session_type}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left bg-white border-collapse">
          <thead className="bg-background-ivory-white">
            <tr>
              <th className="p-4 font-semibold text-text-charcoal">ID</th>
              <th className="p-4 font-semibold text-text-charcoal">User</th>
              <th className="p-4 font-semibold text-text-charcoal">Hall</th>
              <th className="p-4 font-semibold text-text-charcoal">Date & Time</th>
              <th className="p-4 font-semibold text-text-charcoal">Status</th>
              <th className="p-4 font-semibold text-text-charcoal text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking, index) => (
              <tr key={booking.id} className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="p-4 font-mono text-sm text-gray-800">{booking.id}</td>
                <td className="p-4 text-gray-800">{booking.emp_name}</td>
                <td className="p-4 text-gray-800">{booking.hall_name}</td>
                <td className="p-4 text-gray-800">{booking.slot_date} <span className="text-gray-500">({booking.slot_time})</span></td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    booking.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    booking.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-background-ivory-white text-text-charcoal' // For 'Cancelled' and any other status
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center space-x-2">
                    {booking.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(booking.id)}
                          className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition"
                          title="Approve Booking"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => openRejectModal(booking.id)}
                          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                          title="Reject Booking"
                        >
                          <X size={18} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleEdit(booking)}
                      className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                      title="Edit Booking"
                    >
                      <Edit size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBookings.length === 0 && !loading && (
        <div className="text-center p-8 text-gray-500">
          No {filter.toLowerCase()} bookings found.
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reject Booking</h3>
            <p className="mb-4">Please provide a reason for rejecting this booking:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows="4"
              placeholder="Enter rejection reason..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-background-ivory-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reject Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <EditBookingModal
        booking={editingBooking}
        onClose={() => setEditingBooking(null)}
        onBookingUpdated={handleBookingUpdated}
      />
    </div>
  );
};

export default BookingApprovalList;
