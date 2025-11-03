import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { updateBooking, fetchAllHalls, fetchSessions } from '../../api/axios';

const EditBookingModal = ({ booking, onClose, onBookingUpdated }) => {
  const [formData, setFormData] = useState({
    slot_date: '',
    slot_time: '',
    hall: '',
    session: '',
  });
  const [halls, setHalls] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (booking) {
      setFormData({
        slot_date: booking.slot_date,
        slot_time: booking.slot_time,
        hall: booking.hall,
        session: booking.session,
      });
    }
  }, [booking]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hallsData, sessionsData] = await Promise.all([
          fetchAllHalls(),
          fetchSessions(),
        ]);
        setHalls(hallsData);
        setSessions(sessionsData);
      } catch (error) {
        toast.error('Failed to fetch halls or sessions.');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedBooking = await updateBooking(booking.id, formData);
      toast.success('Booking updated successfully!');
      onBookingUpdated(updatedBooking);
      onClose();
    } catch (error) {
      toast.error('Failed to update booking.');
      console.error(error);
    }
  };

  if (!booking) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <h3 className="mb-4 text-lg font-semibold">Edit Booking #{booking.id}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Slot Date</label>
            <p className="mt-1 text-gray-900">{formData.slot_date}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Session</label>
            <p className="mt-1 text-gray-900">
              {
                sessions.find((session) => session.id === formData.session)?.session_type || "N/A"
              }
            </p>
          </div>
          <div>
            <label htmlFor="hall" className="block text-sm font-medium text-gray-700">
              Hall
            </label>
            <select
              id="hall"
              name="hall"
              value={formData.hall}
              onChange={handleChange}
              className="block w-full p-2 mt-1 border rounded-md shadow-sm"
            >
              <option value="">Select a hall</option>
              {halls.map((hall) => (
                <option key={hall.id} value={hall.id}>
                  {hall.hall_name}
                </option>
              ))}
            </select>
          </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Slot Time</label>
              <p className="mt-1 text-gray-900">{formData.slot_time}</p>
            </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Update Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingModal;