
import React from 'react';
import BookingApprovalList from '../components/admin/BookingApprovalList';
import { motion } from 'framer-motion';

const BookingApprovalPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Booking Approvals</h1>
      <p className="text-gray-600 mb-6">Review and manage all hall booking requests.</p>
      <BookingApprovalList />
    </motion.div>
  );
};

export default BookingApprovalPage;
