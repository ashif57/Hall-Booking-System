import React, { useState, useEffect } from 'react';
import AdminCreationForm from '../components/admin/AdminCreationForm';
import AdminUserList from '../components/admin/AdminUserList';
import { motion } from 'framer-motion';
import { fetchAdminUsers } from '../api/axios';

const AdminCreationPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadAdminUsers = async () => {
    setLoading(true);
    try {
      const usersData = await fetchAdminUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching admin users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminUsers();
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleFormSubmit = (submittedUser) => {
    if (submittedUser) {
      // If a user was submitted (created or updated)
      const isExisting = users.some(u => u.admin_code === submittedUser.admin_code);
      if (isExisting) {
        // Update existing user
        setUsers(users.map(u => u.admin_code === submittedUser.admin_code ? submittedUser : u));
      } else {
        // Add new user
        setUsers([...users, submittedUser]);
      }
    }
    // Clear the form by resetting the selected user
    setSelectedUser(null);
    // Reload the users to get the latest data
    loadAdminUsers();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {selectedUser ? 'Edit Admin User' : 'Create Admin User'}
        </h1>
        <p className="text-gray-600 mb-6">
          {selectedUser ? 'Edit an existing administrator.' : 'Add a new administrator to the system.'}
        </p>
        <AdminCreationForm initialData={selectedUser} onFormSubmit={handleFormSubmit} />
      </div>
      <AdminUserList users={users} onSelectUser={handleSelectUser} />
    </motion.div>
  );
};

export default AdminCreationPage;