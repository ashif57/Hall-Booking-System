import React from 'react';
import OfficeMaster from '../components/admin/OfficeMaster';
import { motion } from 'framer-motion';

const OfficeMasterPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Office Master</h1>
      <p className="text-gray-600 mb-6">Manage your office locations.</p>
      <OfficeMaster />
    </motion.div>
  );
};

export default OfficeMasterPage;