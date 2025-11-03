
import React from 'react';
import SectionMaster from '../components/admin/SectionMaster';
import { motion } from 'framer-motion';

const SectionMasterPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Session Master</h1>
      <p className="text-gray-600 mb-6">Manage the mapping between session types and their preferred halls.</p>
      <SectionMaster />
    </motion.div>
  );
};

export default SectionMasterPage;
