import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, PlusCircle, Save, X, Filter, Search } from 'lucide-react';
import { fetchOffices, fetchAdminUsers, fetchAllHalls, postHall, updateHall, fetchCategories } from '../api/axios';
import toast from 'react-hot-toast';

const HallCard = ({ hall, editingHall, formErrors, offices, adminUsers, categories, loading, handleUpdateHall, cancelEdit, setEditingHall, handleDeleteHall, handleInputChange, getOfficeName, getAdminName }) => (
  <div className="p-4 mb-4 bg-white border rounded-lg shadow-sm">
    <div className="flex flex-col md:flex-row md:items-start">
      <div className="mb-4 md:w-1/4 md:mb-0">
        {hall.image ? (
          <img src={hall.image} alt={hall.hall_name} className="object-cover w-full h-40 rounded" />
        ) : (
          <div className="flex items-center justify-center w-full h-40 bg-gray-200 rounded">
            <span className="text-gray-500">No image</span>
          </div>
        )}
      </div>
      
      <div className="md:w-3/4 md:pl-4">
        <div className="flex flex-col mb-2 md:flex-row md:items-center md:justify-between">
          <h3 className="text-xl font-semibold text-gray-800">{hall.hall_name}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${hall.is_freeze ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {hall.is_freeze ? 'Frozen' : 'Active'}
          </span>
        </div>
        
        <div className="grid grid-cols-1 gap-2 mb-3 text-sm md:grid-cols-2">
          <div><span className="font-medium">Capacity:</span> {hall.capacity}</div>
          <div><span className="font-medium">Code:</span> {hall.hall_code}</div>
          <div><span className="font-medium">Office:</span> {getOfficeName(hall.office)}</div>
          <div><span className="font-medium">Category:</span> {hall.category}</div>
        </div>
        
        {hall.about && (
          <div className="mb-3 text-sm">
            <span className="font-medium">About:</span> 
            <p className="mt-1 text-gray-600">{hall.about}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-2 mb-4 text-sm md:grid-cols-3">
          <div><span className="font-medium">Day SPOC:</span> {getAdminName(hall.day_spoc)}</div>
          <div><span className="font-medium">Mid SPOC:</span> {getAdminName(hall.mid_spoc)}</div>
          <div><span className="font-medium">Night SPOC:</span> {getAdminName(hall.night_spoc)}</div>
        </div>

        <div className="grid grid-cols-1 gap-2 mb-4 text-sm md:grid-cols-3">
          <div><span className="font-medium">Wifi:</span> {hall.wifi ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">TV:</span> {hall.tv ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Whiteboard:</span> {hall.whiteboard ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Speaker:</span> {hall.speaker ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Mic:</span> {hall.mic ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Extension Power Box:</span> {hall.extension_power_box ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Stationaries:</span> {hall.stationaries ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Chairs & Tables:</span> {hall.chairs_tables ? 'Yes' : 'No'}</div>
        </div> 
        
        <div className="flex space-x-2">
          {editingHall && editingHall.id === hall.id ? (
            <>
              <button onClick={handleUpdateHall} disabled={loading} className="flex items-center px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50">
                <Save size={16} className="mr-1" /> Save
              </button>
              <button onClick={cancelEdit} className="flex items-center px-3 py-1 text-sm text-text-charcoal bg-gray-200 rounded hover:bg-gray-300">
                <X size={16} className="mr-1" /> Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditingHall(hall)} disabled={!!editingHall} className="flex items-center px-3 py-1 text-sm text-white bg-secondary-royal-gold rounded hover:bg-accent-champagne disabled:opacity-50">
                <Edit size={16} className="mr-1" /> Edit
              </button>
              <button onClick={() => handleDeleteHall(hall.id)} disabled={loading} className="flex items-center px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50">
                <Trash2 size={16} className="mr-1" /> Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
    
    {editingHall && editingHall.id === hall.id && (
      <div className="pt-4 mt-4 border-t">
        <h4 className="mb-3 font-medium text-text-charcoal">Edit Hall Details</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-text-charcoal">Hall Name *</label>
            <input 
              type="text" 
              name="hall_name" 
              value={editingHall.hall_name} 
              onChange={handleInputChange} 
              className={`p-2 border rounded ${formErrors.hall_name ? 'border-red-500' : ''}`} 
            />
            {formErrors.hall_name && <p className="mt-1 text-xs text-red-500">{formErrors.hall_name}</p>}
          </div>
          
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-text-charcoal">Capacity *</label>
            <input 
              type="number" 
              name="capacity" 
              value={editingHall.capacity} 
              onChange={handleInputChange} 
              className={`p-2 border rounded ${formErrors.capacity ? 'border-red-500' : ''}`} 
            />
            {formErrors.capacity && <p className="mt-1 text-xs text-red-500">{formErrors.capacity}</p>}
          </div>
          
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-text-charcoal">Hall Code *</label>
            <input 
              type="text" 
              name="hall_code" 
              value={editingHall.hall_code} 
              onChange={handleInputChange} 
              className={`p-2 border rounded ${formErrors.hall_code ? 'border-red-500' : ''}`} 
            />
            {formErrors.hall_code && <p className="mt-1 text-xs text-red-500">{formErrors.hall_code}</p>}
          </div>
          
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-text-charcoal">Office *</label>
            <select 
              name="office" 
              value={editingHall.office} 
              onChange={handleInputChange} 
              className={`p-2 border rounded ${formErrors.office ? 'border-red-500' : ''}`}
            >
              <option value="">Select Office</option>
              {offices.map(o => <option key={o.id} value={o.id}>{o.office_name}</option>)}
            </select>
            {formErrors.office && <p className="mt-1 text-xs text-red-500">{formErrors.office}</p>}
          </div>
          
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-text-charcoal">Category *</label>
            <select
              name="category"
              value={editingHall.category}
              onChange={handleInputChange}
              className={`p-2 border rounded ${formErrors.category ? 'border-red-500' : ''}`}
            >
              <option value="">Select Category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {formErrors.category && <p className="mt-1 text-xs text-red-500">{formErrors.category}</p>}
          </div>
          
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-text-charcoal">Day SPOC</label>
            <select
              name="day_spoc"
              value={editingHall.day_spoc || ''}
              onChange={handleInputChange}
              className="p-2 border rounded"
            >
              <option value="">Select Day SPOC</option>
              {adminUsers.map(u => <option key={u.admin_code} value={u.admin_code}>{u.username || u.admin_code}</option>)}
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-text-charcoal">Mid SPOC</label>
            <select 
              name="mid_spoc" 
              value={editingHall.mid_spoc || ''}
              onChange={handleInputChange} 
              className="p-2 border rounded"
            >
              <option value="">Select Mid SPOC</option>
              {adminUsers.map(u => <option key={u.admin_code} value={u.admin_code}>{u.username || u.admin_code}</option>)}
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-text-charcoal">Night SPOC</label>
            <select 
              name="night_spoc" 
              value={editingHall.night_spoc || ''}
              onChange={handleInputChange} 
              className="p-2 border rounded"
            >
              <option value="">Select Night SPOC</option>
              {adminUsers.map(u => <option key={u.admin_code} value={u.admin_code}>{u.username || u.admin_code}</option>)}
            </select>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className='p-2'>
            <input 
            type="checkbox"
            name="wifi"
            checked={editingHall.wifi}
            onChange={handleInputChange}
            className="mr-2"
            />
            <label className="text-sm font-medium text-text-charcoal">Wifi</label></div>
            <div className='p-2'>
            <input 
            type="checkbox"
            name="tv"
            checked={editingHall.tv}
            onChange={handleInputChange}
            className="mr-2"
            />
            <label className="text-sm font-medium text-text-charcoal">Tv/Monitor</label></div>
            <div className='p-2'>
            <input 
            type="checkbox"
            name="whiteboard"
            checked={editingHall.whiteboard}
            onChange={handleInputChange}
            className="mr-2"
            />
            <label className="text-sm font-medium text-text-charcoal">White Board</label></div>
            <div className='p-2'>
            <input 
            type="checkbox"
            name="speaker"
            checked={editingHall.speaker}
            onChange={handleInputChange}
            className="mr-2"
            />
            <label className="text-sm font-medium text-text-charcoal">Speaker</label></div>
            <div className='p-2'>
            <input 
            type="checkbox"
            name="mic"
            checked={editingHall.mic}
            onChange={handleInputChange}
            className="mr-2"
            />
            <label className="text-sm font-medium text-text-charcoal">Mic</label></div>
            <div className='p-2'>
            <input 
            type="checkbox"
            name="extension_power_box"
            checked={editingHall.extension_power_box}
            onChange={handleInputChange}
            className="mr-2"
            />
            <label className="text-sm font-medium text-text-charcoal">Power Extention Box</label></div>
            <div className='p-2'>
            <input 
            type="checkbox"
            name="stationaries"
            checked={editingHall.stationaries}
            onChange={handleInputChange}
            className="mr-2"
            />
            <label className="text-sm font-medium text-text-charcoal">Stationaries</label></div>
            <div className='p-2'>
            <input 
            type="checkbox"
            name="chairs_tables"
            checked={editingHall.chairs_tables}
            onChange={handleInputChange}
            className="mr-2"
            />
            <label className="text-sm font-medium text-text-charcoal">Chairs & Tables</label></div>
          </div>


          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-text-charcoal">Image</label>
            <input 
              type="file" 
              name="image" 
              onChange={handleInputChange} 
              className="p-2 border rounded" 
            />
          </div>
          
          <div className="flex flex-col md:col-span-2">
            <label className="mb-1 text-sm font-medium text-text-charcoal">About the Hall</label>
            <textarea 
              name="about" 
              value={editingHall.about} 
              onChange={handleInputChange} 
              className="p-2 border rounded" 
              rows="3"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_freeze"
              checked={editingHall.is_freeze}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label className="text-sm font-medium text-text-charcoal">Freeze this hall</label>
          </div>
        </div>
      </div>
    )}
  </div>
);

const HallManagementPage = () => {
  const [offices, setOffices] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [halls, setHalls] = useState([]);
  const [filteredHalls, setFilteredHalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHall, setEditingHall] = useState(null);
  const [showFrozen, setShowFrozen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOffice, setSelectedOffice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const [newHall, setNewHall] = useState({
    hall_name: "",
    capacity: "",
    hall_code: "",
    office: "",
    category: "",
    about: "",
    day_spoc: "",
    mid_spoc: "",
    night_spoc: "",
    image: null,
    is_freeze: false,
    wifi: false,
    tv: false,
    whiteboard: false,
    speaker: false,
    mic: false,
    extension_power_box: false,
    stationaries: false,
    chairs_tables: false
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [officeData, adminData, categoriesData] = await Promise.all([
          fetchOffices(),
          fetchAdminUsers(),
          fetchCategories()
        ]);
        setOffices(officeData);
        setAdminUsers(adminData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load initial data");
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const getAllHalls = async () => {
      setLoading(true);
      try {
        const hallsData = await fetchAllHalls();
        const activeHalls = hallsData.filter(hall => !hall.is_deleted);
        setHalls(activeHalls);
        setFilteredHalls(activeHalls);
      } catch (error) {
        console.error("Failed to fetch halls:", error);
        toast.error("Failed to load halls");
      }
      setLoading(false);
    };
    getAllHalls();
  }, []);

  useEffect(() => {
    let result = halls;
    
    // Filter by frozen status
    if (showFrozen) {
      result = result.filter(hall => hall.is_freeze);
    }

    if (selectedOffice) {
      result = result.filter(hall => hall.office == selectedOffice);
    }

    if (selectedCategory) {
      result = result.filter(hall => hall.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(hall =>
        hall.hall_name.toLowerCase().includes(term) ||
        hall.hall_code.toLowerCase().includes(term) ||
        getOfficeName(hall.office).toLowerCase().includes(term)
      );
    }
    
    setFilteredHalls(result);
  }, [halls, showFrozen, searchTerm, selectedOffice, selectedCategory]);

  const validateForm = (formData) => {
    const errors = {};
    
    if (!formData.hall_name?.trim()) errors.hall_name = "Hall name is required";
    if (!formData.capacity || formData.capacity <= 0) errors.capacity = "Valid capacity is required";
    if (!formData.hall_code?.trim()) errors.hall_code = "Hall code is required";
    if (!formData.office) errors.office = "Office selection is required";
    if (!formData.category) errors.category = "Category is required";
    
    // For image during creation
    if (!formData.id && !formData.image) errors.image = "Image is required for new halls";
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : files ? files[0] : value;
    
    if (editingHall) {
      setEditingHall(prev => ({ ...prev, [name]: val }));
    } else {
      setNewHall(prev => ({ ...prev, [name]: val }));
      
      // Handle image preview for new hall form
      if (name === 'image' && files && files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(files[0]);
      }
    }
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddHall = async (e) => {
    e.preventDefault();
    
    const errors = validateForm(newHall);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the form errors");
      return;
    }

    const formData = new FormData();
    Object.keys(newHall).forEach(key => {
      if (newHall[key] !== null && newHall[key] !== undefined) {
        formData.append(key, newHall[key]);
      }
    });

    try {
      setLoading(true);
      const savedHall = await postHall(formData);
      setHalls(prev => [...prev, savedHall]);
      setNewHall({
        hall_name: "", capacity: "", hall_code: "", office: "", category: "",
        about: "", day_spoc: "", mid_spoc: "", night_spoc: "", image: null, is_freeze: false, wifi: false,
        tv: false,    whiteboard: false,    speaker: false,    mic: false,    extension_power_box: false,    stationaries: false, chairs_tables: false
      });
      setImagePreview(null);
      setShowAddForm(false);
      setFormErrors({});
      toast.success('Hall added successfully!');
    } catch (error) {
      console.error("Add hall error:", error);
      toast.error(error.response?.data?.message || "Failed to add hall");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHall = async (e) => {
    e.preventDefault();
    if (!editingHall) return;
    
    const errors = validateForm(editingHall);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the form errors");
      return;
    }

    const formData = new FormData();
    const editableFields = [
      'hall_name', 'capacity', 'hall_code', 'office', 'category',
      'about', 'day_spoc', 'mid_spoc', 'night_spoc', 'is_freeze', 'wifi', 'tv', 'whiteboard', 'speaker', 'mic', 'extension_power_box', 'stationaries', 'chairs_tables'
    ];

    editableFields.forEach(key => {
      if (editingHall[key] !== null && editingHall[key] !== undefined) {
        formData.append(key, editingHall[key]);
      }
    });

    // Handle image separately: only append if it's a File object
    if (editingHall.image instanceof File) {
      formData.append('image', editingHall.image);
    }

    try {
      setLoading(true);
      const updated = await updateHall(editingHall.id, formData);
      setHalls(prev => prev.map(h => (h.id === editingHall.id ? updated : h)));
      setEditingHall(null);
      setFormErrors({});
      toast.success('Hall updated successfully!');
    } catch (error) {
      console.error("Update hall error:", error);
      toast.error(error.response?.data?.message || "Failed to update hall");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteHall = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hall?")) return;
    
    try {
      setLoading(true);
      // await deleteHall(id); // This is now a soft delete on the backend
      setHalls(prev => prev.filter(hall => hall.id !== id));
      toast.success('Hall deleted successfully!');
    } catch (error) {
      console.error("Delete hall error:", error);
      toast.error(error.response?.data?.message || "Failed to delete hall");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingHall(null);
    setFormErrors({});
  };

  const cancelAdd = () => {
    setShowAddForm(false);
    setNewHall({
      hall_name: "", capacity: "", hall_code: "", office: "", category: "",
      about: "", day_spoc: "", mid_spoc: "", night_spoc: "", image: null, is_freeze: false , wifi: false,
      tv: false,    whiteboard: false,    speaker: false,    mic: false,    extension_power_box: false,    stationaries: false,
    chairs_tables: false
    });
    setImagePreview(null);
    setFormErrors({});
  };

  const getOfficeName = (officeId) => {
    const office = offices.find(o => o.id === officeId);
    return office ? office.office_name : 'Unknown';
  };

  const getAdminName = (adminCode) => {
    const admin = adminUsers.find(u => u.admin_code === adminCode);
    return admin ? admin.username : 'Not assigned';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-4 md:p-6">
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl mb-6">Hall Management</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
            <input
              type="text"
              placeholder="Search halls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border rounded-lg md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedOffice}
            onChange={(e) => setSelectedOffice(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Offices</option>
            {offices.map(o => <option key={o.id} value={o.id}>{o.office_name}</option>)}
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <button
            onClick={() => setShowFrozen(prev => !prev)}
            className={`flex items-center justify-center w-full px-4 py-2 font-semibold rounded-lg md:w-auto ${showFrozen ? 'bg-gray-600 text-white' : 'bg-yellow-600 text-white'} hover:opacity-90`}
          >
            <Filter size={18} className="mr-2" />
            {showFrozen ? 'Show All' : 'Show Frozen'}
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            disabled={editingHall}
            className="flex items-center justify-center w-full px-4 py-2 font-semibold text-white bg-secondary-royal-gold rounded-lg md:w-auto hover:bg-accent-champagne disabled:opacity-50"
          >
            <PlusCircle size={18} className="mr-2" /> Add Hall
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddHall} className="p-4 mb-6 rounded-lg shadow bg-gray-50">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Add New Hall</h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-text-charcoal">Hall Name *</label>
              <input 
                type="text" 
                name="hall_name" 
                placeholder="Hall Name" 
                value={newHall.hall_name} 
                onChange={handleInputChange} 
                className={`p-2 border rounded ${formErrors.hall_name ? 'border-red-500' : ''}`} 
              />
              {formErrors.hall_name && <p className="mt-1 text-xs text-red-500">{formErrors.hall_name}</p>}
            </div>
            
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-text-charcoal">Capacity *</label>
              <input 
                type="number" 
                name="capacity" 
                placeholder="Capacity" 
                value={newHall.capacity} 
                onChange={handleInputChange} 
                className={`p-2 border rounded ${formErrors.capacity ? 'border-red-500' : ''}`} 
              />
              {formErrors.capacity && <p className="mt-1 text-xs text-red-500">{formErrors.capacity}</p>}
            </div>
            
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-text-charcoal">Hall Code *</label>
              <input 
                type="text" 
                name="hall_code" 
                placeholder="Hall Code" 
                value={newHall.hall_code} 
                onChange={handleInputChange} 
                className={`p-2 border rounded ${formErrors.hall_code ? 'border-red-500' : ''}`} 
              />
              {formErrors.hall_code && <p className="mt-1 text-xs text-red-500">{formErrors.hall_code}</p>}
            </div>
            
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-text-charcoal">Office *</label>
              <select 
                name="office" 
                value={newHall.office} 
                onChange={handleInputChange} 
                className={`p-2 border rounded ${formErrors.office ? 'border-red-500' : ''}`}
              >
                <option value="">Select Office</option>
                {offices.map(o => <option key={o.id} value={o.id}>{o.office_name}</option>)}
              </select>
              {formErrors.office && <p className="mt-1 text-xs text-red-500">{formErrors.office}</p>}
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-text-charcoal">Category *</label>
              <select
                name="category"
                value={newHall.category}
                onChange={handleInputChange}
                className={`p-2 border rounded ${formErrors.category ? 'border-red-500' : ''}`}
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {formErrors.category && <p className="mt-1 text-xs text-red-500">{formErrors.category}</p>}
            </div>
            
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-text-charcoal">Day SPOC</label>
              <select 
                name="day_spoc" 
                value={newHall.day_spoc} 
                onChange={handleInputChange} 
                className="p-2 border rounded"
              >
                <option value="">Select Day SPOC</option>
                {adminUsers.map(u => <option key={u.admin_code} value={u.admin_code}>{u.username || u.admin_code}</option>)}
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-text-charcoal">Mid SPOC</label>
              <select 
                name="mid_spoc" 
                value={newHall.mid_spoc} 
                onChange={handleInputChange} 
                className="p-2 border rounded"
              >
                <option value="">Select Mid SPOC</option>
                {adminUsers.map(u => <option key={u.admin_code} value={u.admin_code}>{u.username || u.admin_code}</option>)}
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-text-charcoal">Night SPOC</label>
              <select 
                name="night_spoc" 
                value={newHall.night_spoc} 
                onChange={handleInputChange} 
                className="p-2 border rounded"
              >
                <option value="">Select Night SPOC</option>
                {adminUsers.map(u => <option key={u.admin_code} value={u.admin_code}>{u.username || u.admin_code}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className='p-2'>
              <input 
              type="checkbox"
              name="wifi"
              checked={newHall.wifi}
              onChange={handleInputChange}
              className="mr-2"
              />
              <label className="text-sm font-medium text-text-charcoal">Wifi</label></div>
              <div className='p-2'>
              <input 
              type="checkbox"
              name="tv"
              checked={newHall.tv}
              onChange={handleInputChange}
              className="mr-2"
              />
              <label className="text-sm font-medium text-text-charcoal">Tv/Monitor</label></div>
              <div className='p-2'>
              <input 
              type="checkbox"
              name="whiteboard"
              checked={newHall.whiteboard}
              onChange={handleInputChange}
              className="mr-2"
              />
              <label className="text-sm font-medium text-text-charcoal">White Board</label></div>
              <div className='p-2'>
              <input 
              type="checkbox"
              name="speaker"
              checked={newHall.speaker}
              onChange={handleInputChange}
              className="mr-2"
              />
              <label className="text-sm font-medium text-text-charcoal">Speaker</label></div>
              <div className='p-2'>
              <input 
              type="checkbox"
              name="mic"
              checked={newHall.mic}
              onChange={handleInputChange}
              className="mr-2"
              />
              <label className="text-sm font-medium text-text-charcoal">Mic</label></div>
              <div className='p-2'>
              <input 
              type="checkbox"
              name="extension_power_box"
              checked={newHall.extension_power_box}
              onChange={handleInputChange}
              className="mr-2"
              />
              <label className="text-sm font-medium text-text-charcoal">Power Extention Box</label></div>
              <div className='p-2'>
              <input 
              type="checkbox"
              name="stationaries"
              checked={newHall.stationaries}
              onChange={handleInputChange}
              className="mr-2"
              />
              <label className="text-sm font-medium text-text-charcoal">Stationaries</label></div>
              <div className='p-2'>
              <input 
              type="checkbox"
              name="chairs_tables"
              checked={newHall.chairs_tables}
              onChange={handleInputChange}
              className="mr-2"
              />
              <label className="text-sm font-medium text-text-charcoal">Chairs & Tables</label></div>
            </div>
            
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-text-charcoal">Image *</label>
              <input 
                type="file" 
                name="image" 
                onChange={handleInputChange} 
                className={`p-2 border rounded ${formErrors.image ? 'border-red-500' : ''}`} 
              />
              {formErrors.image && <p className="mt-1 text-xs text-red-500">{formErrors.image}</p>}
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Image Preview:</p>
                  <img src={imagePreview} alt="Preview" className="object-cover w-32 h-32 mt-1 border rounded" />
                </div>
              )}
            </div>
            
            <div className="flex flex-col md:col-span-2">
              <label className="mb-1 text-sm font-medium text-text-charcoal">About the Hall</label>
              <textarea 
                name="about" 
                placeholder="About the hall" 
                value={newHall.about} 
                onChange={handleInputChange} 
                className="p-2 border rounded" 
                rows="3"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_freeze"
                checked={newHall.is_freeze}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-text-charcoal">Freeze this hall</label>
            </div>
          </div>
          
          <div className="flex mt-6 space-x-2">
            <button type="submit" disabled={loading} className="px-4 py-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Hall'}
            </button>
            <button type="button" onClick={cancelAdd} className="px-4 py-2 font-semibold text-text-charcoal bg-gray-200 rounded hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mb-6 bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {showFrozen ? 'Frozen Halls' : 'All Halls'} 
            <span className="ml-2 text-sm font-normal text-gray-500">({filteredHalls.length} found)</span>
          </h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Loading halls...</div>
          </div>
        ) : filteredHalls.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">No halls found</div>
          </div>
        ) : (
          <div className="divide-y">
            {filteredHalls.map(hall => (
              <HallCard 
                key={hall.id} 
                hall={hall}
                editingHall={editingHall}
                formErrors={formErrors}
                offices={offices}
                adminUsers={adminUsers}
                categories={categories}
                loading={loading}
                handleUpdateHall={handleUpdateHall}
                cancelEdit={cancelEdit}
                setEditingHall={setEditingHall}
                handleDeleteHall={handleDeleteHall}
                handleInputChange={handleInputChange}
                getOfficeName={getOfficeName}
                getAdminName={getAdminName}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HallManagementPage;