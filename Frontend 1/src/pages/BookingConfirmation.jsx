
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Loader, AlertTriangle } from 'lucide-react';
import apiClient from '../api/axios';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await apiClient.get(`/bookings/${bookingId}/`);
        setBookingDetails(response.data);
      } catch (err) {
        setError('Failed to load booking details. Please try again later.');
        console.error('Failed to load booking details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">An Error Occurred</h1>
          <p className="text-gray-600 mt-2">{error}</p>
          <div className="mt-8">
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Booking Request Received!</h1>
        <p className="text-gray-600 mt-2">Your booking is awaiting approval.</p>

        {bookingDetails && (
          <div className="text-left bg-gray-50 rounded-lg p-4 my-6 border border-gray-200">
              <h2 className="font-semibold text-lg mb-3">Booking Summary</h2>
              <div className="space-y-2 text-sm text-text-charcoal">
                  <p><strong>Booking ID:</strong> {bookingDetails.id}</p>
                  <p><strong>Hall:</strong> {bookingDetails.hall_name}</p>
                  <p><strong>Date:</strong> {bookingDetails.slot_date}</p>
                  <p><strong>Time Slot:</strong> {bookingDetails.slot_time}</p>
                  <p><strong>Status:</strong>
                      <span className={`font-semibold px-2 py-1 rounded-full ml-2 text-xs ${
                        bookingDetails.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        bookingDetails.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                          {bookingDetails.status}
                      </span>
                  </p>
              </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center bg-blue-50 p-4 rounded-lg">
            <Mail className="h-6 w-6 text-blue-500 mr-3"/>
            <p className="text-sm text-blue-800">An email with your booking details has been sent to your registered address.</p>
        </div>

        <div className="mt-8">
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                &larr; Back to Home
            </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingConfirmation;
