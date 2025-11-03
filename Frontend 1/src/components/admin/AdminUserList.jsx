import React from 'react';

const AdminUserList = ({ users, onSelectUser }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Existing Admin Users</h2>
      <ul className="space-y-4">
        {users.map(user => (
          <li
            key={user.admin_code}
            onClick={() => onSelectUser(user)}
            className="cursor-pointer p-4 border rounded-lg hover:bg-gray-100 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{user.username}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <button className="text-blue-600 hover:underline">Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUserList;