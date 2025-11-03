import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchOffices, updateAdminUser } from '../../api/axios';
import apiClient from '../../api/axios';

const AdminCreationForm = ({ initialData, onFormSubmit }) => {
  const isEditMode = !!initialData;
  const [offices, setOffices] = useState([]);
  const [formData, setFormData] = useState({
    admin_code: '',
    username: '',
    password: '',
    role: 'ADMIN',
    office: '',
    designation: '',
    shift: '',
    mobile_no: '',
    others: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        admin_code: initialData.admin_code || '',
        username: initialData.username || '',
        password: '',
        role: initialData.role || 'ADMIN',
        office: initialData.office || '',
        designation: initialData.designation || '',
        shift: initialData.shift || '',
        mobile_no: initialData.mobile_no || '',
        others: initialData.others || ''
      });
    } else {
      // Reset form for creation
      setFormData({
        admin_code: '',
        username: '',
        password: '',
        role: 'ADMIN',
        office: '',
        designation: '',
        shift: '',
        mobile_no: '',
        others: ''
      });
    }
  }, [initialData]);

  useEffect(() => {
    const loadOffices = async () => {
      const officeData = await fetchOffices();
      setOffices(officeData);
    };
    loadOffices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isEditMode) {
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        response = await updateAdminUser(initialData.admin_code, updateData);
        toast.success('Admin user updated successfully!');
      } else {
        response = await apiClient.post('/admin-users/', formData);
        toast.success('Admin user created successfully!');
      }
      onFormSubmit(response); // Pass the new/updated user data back to the parent
    } catch (error) {
      toast.error(isEditMode ? 'Failed to update admin user.' : 'Failed to create admin user.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          name="admin_code"
          placeholder="Admin Code"
          value={formData.admin_code}
          onChange={handleChange}
          required
          className="p-2 border rounded"
          disabled={isEditMode}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder={isEditMode ? "Leave blank to keep current password" : "Password"}
          value={formData.password}
          onChange={handleChange}
          className="p-2 border rounded"
          required={!isEditMode}
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="ADMIN">Admin</option>
          <option value="SUPERADMIN">Super Admin</option>
          <option value="HR">HR</option>
          <option value="CAFETERIA">Cafeteria</option>
          <option value="IT_SUPPORT">IT Support</option>
        </select>
        <select
          name="office"
          value={formData.office}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        >
          <option value="">Select Office</option>
          {offices.map(office => (
            <option key={office.id} value={office.id}>{office.office_name}</option>
          ))}
        </select>
        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={formData.designation}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="shift"
          placeholder="Shift"
          value={formData.shift}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="mobile_no"
          placeholder="Mobile Number"
          value={formData.mobile_no}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
      </div>
      <textarea
        name="others"
        placeholder="Others"
        value={formData.others}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <div className="flex space-x-4">
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {isEditMode ? 'Update Admin' : 'Create Admin'}
        </button>
        {isEditMode && (
          <button
            type="button"
            onClick={() => onFormSubmit(null)}
            className="w-full bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AdminCreationForm;