import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { fetchOffices, addOffice, updateOffice, deleteOffice, fetchAdminUsers, fetchEntities } from '../../api/axios';

const OfficeMaster = () => {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOffice, setCurrentOffice] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedOffices, fetchedAdminUsers, fetchedEntities] = await Promise.all([
          fetchOffices(),
          fetchAdminUsers(),
          fetchEntities(),
        ]);
        setOffices(fetchedOffices.filter(office => !office.is_deleted));
        setAdminUsers(fetchedAdminUsers);
        setEntities(fetchedEntities);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleOpenModal = (office = null) => {
    setCurrentOffice(office);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentOffice(null);
  };

  const handleSave = async (officeData) => {
    try {
      if (currentOffice) {
        await updateOffice(currentOffice.id, officeData);
      } else {
        await addOffice(officeData);
      }
      // Refresh list
      const fetchedOffices = await fetchOffices();
      setOffices(fetchedOffices.filter(office => !office.is_deleted));
      handleCloseModal();
    } catch (err) {
      setError('Failed to save office');
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this office?')) {
      try {
        await deleteOffice(id);
        // Refresh list
        const fetchedOffices = await fetchOffices();
        setOffices(prevOffices => prevOffices.filter(office => office.id !== id));
      } catch (err) {
        setError('Failed to delete office');
      }
    }
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md ">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">Office Master</h3>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Office
        </button>
      </div>
      <div className="p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {offices.map((office) => (
              <tr key={office.id}>
                <td className="px-6 py-4 whitespace-nowrap">{office.office_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{office.office_city}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(office)} className="text-indigo-600 hover:text-indigo-900">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(office.id)} className="text-red-600 hover:text-red-900 ml-4">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <OfficeModal
          office={currentOffice}
          onClose={handleCloseModal}
          onSave={handleSave}
          adminUsers={adminUsers}
          entities={entities}
        />
      )}
    </div>
  );
};

const OfficeModal = ({ office, onClose, onSave, adminUsers, entities }) => {
  const [formData, setFormData] = useState({
    office_code: office?.office_code || '',
    office_name: office?.office_name || '',
    office_tag: office?.office_tag || '',
    office_street: office?.office_street || '',
    office_area: office?.office_area || '',
    office_city: office?.office_city || '',
    office_state: office?.office_state || '',
    office_country: office?.office_country || '',
    office_pin_code: office?.office_pin_code || '',
    office_spoc: office?.office_spoc || null,
    entities: office?.entities || [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'entities') {
      const entityId = parseInt(value, 10);
      setFormData(prev => {
        const currentEntities = prev.entities || [];
        if (checked) {
          return { ...prev, entities: [...currentEntities, entityId] };
        } else {
          return { ...prev, entities: currentEntities.filter(id => id !== entityId) };
        }
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = { ...formData };
    if (!dataToSend.office_spoc) {
      delete dataToSend.office_spoc;
    }
    onSave(dataToSend);
  };

  return (
    <div >
      <div className="bg-white p-6 rounded-lg shadow-xl w-full grid mx-auto my-10">
        <h2 className="text-xl font-bold mb-4">{office ? 'Edit Office' : 'Add Office'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4 grid gap-4 grid-cols-2">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor={key}>
                {key.split('_').join(' ').replace(/\b\w/g, l => l.toUpperCase())}
              </label>
              {key === 'office_spoc' ? (
                <select
                  id={key}
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleChange}
                  className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select SPOC</option>
                  {adminUsers.map(user => (
                    <option key={user.admin_code} value={user.admin_code}>{user.username}</option>
                  ))}
                </select>
              ) : key === 'entities' ? (
                <div className="grid grid-cols-1 gap-2 border rounded p-2 h-24 overflow-y-auto">
                  {entities.map(entity => (
                    <label key={entity.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="entities"
                        value={entity.id}
                        checked={formData.entities.includes(entity.id)}
                        onChange={handleChange}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span>{entity.entity_name}</span>
                    </label>
                  ))}
                </div>
              ) : (
               <input
                 id={key}
                 name={key}
                 type="text"
                 value={formData[key]}
                 onChange={handleChange}
                 className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                 required
               />
             )}
            </div>
          ))}
          <div className="flex items-center justify-end pt-4">
             <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            >
              Save
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
            >
              Cancel
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default OfficeMaster;