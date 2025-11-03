import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Users, XCircle, CheckCircle, Clock as PendingIcon, AlertCircle, Edit3, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { fetchBookingsByEmail, cancelBooking } from '../api/axios';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleLogout = () => {
    // Remove all localStorage items
    localStorage.clear();
    // Navigate to home page
    navigate('/');
  };

  useEffect(() => {
    // Get user email from localStorage or other storage
    // In a real implementation, this would come from the authentication context
    const email = localStorage.getItem('userEmail') || '';
    setUserEmail(email);
    loadBookings(email);
  }, []);

  const loadBookings = async (email) => {
    try {
      setLoading(true);
      // Fetch bookings for the specific email
      const data = await fetchBookingsByEmail(email);
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      await cancelBooking(selectedBooking.id);
      toast.success('Booking cancelled successfully!');
      // Update the booking status locally
      setBookings(bookings.map(booking =>
          booking.id === selectedBooking.id
            ? { ...booking, status: 'Cancelled' }
            : booking
      ));
    } catch (error) {
      toast.error('Failed to cancel booking.');
      console.error('Error cancelling booking:', error);
    } finally {
      setShowCancelModal(false);
      setSelectedBooking(null);
    }
  };

  const openCancelModal = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'Pending':
        return <PendingIcon className="text-yellow-500" size={20} />;
      case 'Rejected':
      case 'Cancelled':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <AlertCircle className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-50"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking History</h1>
            <p className="text-gray-600">View and manage your meeting room bookings</p>
            {userEmail && (
              <p className="text-gray-500 mt-2">Showing bookings for: {userEmail}</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 font-medium text-gray-600 transition-colors duration-300 rounded-md hover:bg-blue-600 hover:text-white"
          >
            <ArrowLeft size={18} className="mr-2" /> Back to Home
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center mb-8 gap-2">
          {['all', 'approved', 'pending', 'rejected', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === status
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <Calendar className="mx-auto text-gray-400" size={48} />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="mt-2 text-gray-500">
              {filter === 'all' 
                ? "You haven't made any bookings yet." 
                : `You don't have any ${filter} bookings.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Header with status */}
                <div className={`p-4 border-b flex justify-between items-center ${getStatusColor(booking.status)}`}>
                  <div className="flex items-center">
                    {getStatusIcon(booking.status)}
                    <span className="ml-2 font-medium">{booking.status}</span>
                  </div>
                  <div className="text-sm font-mono">#{booking.id}</div>
                </div>

                {/* Booking details */}
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{booking.hall_name}</h3>
                  <p className="text-gray-600 mb-4 flex items-start">
                    <MapPin className="mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>{booking.office_name}</span>
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="mr-2" size={16} />
                      <span>{formatDate(booking.slot_date)}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="mr-2" size={16} />
                      <span>{booking.slot_time}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <User className="mr-2" size={16} />
                      <span>{booking.emp_name} ({booking.emp_code})</span>
                    </div>
                    {booking.team_name && (
                      <div className="flex items-center text-gray-700">
                        <Users className="mr-2" size={16} />
                        <span>{booking.team_name}</span>
                      </div>
                    )}
                  </div>

                  {booking.description && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-gray-600">{booking.description}</p>
                    </div>
                  )}

                  {/* Additional info badges */}
                  <div className="mt-4 flex-wrap gap-2">
                    {booking.it_support && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        IT Support Needed
                      </span>
                    )}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {booking.session_type}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {booking.shift} Shift
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 py-4 bg-gray-50 flex justify-between">
                  <span className="text-xs text-gray-500">
                    Booked on {formatDate(booking.book_date)}
                  </span>
                  {(booking.status === 'Approved' || booking.status === 'Pending') && (
                    <button
                      onClick={() => openCancelModal(booking)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancel Booking Modal */}
        {showCancelModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cancel Booking</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel your booking for <strong>{selectedBooking.hall_name}</strong> on {formatDate(selectedBooking.slot_date)} at {selectedBooking.slot_time}?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;