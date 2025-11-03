import React, { useState } from 'react';

const UnderlineForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted successfully!\n' + JSON.stringify(formData, null, 2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-6 px-8 text-center">
          <h2 className="text-2xl font-bold">Contact Information</h2>
          <p className="mt-2 opacity-90">Please provide your details below</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Name Field */}
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:ring-0 outline-none transition-colors peer"
              placeholder=" "
            />
            <label className="absolute left-0 -top-5 text-sm text-gray-500 transition-all duration-300 
              peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
              peer-focus:-top-5 peer-focus:text-sm peer-focus:text-blue-600 pointer-events-none">
              Full Name
            </label>
          </div>
          
          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:ring-0 outline-none transition-colors peer"
              placeholder=" "
              required
            />
            <label className="absolute left-0 -top-5 text-sm text-gray-500 transition-all duration-300 
              peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
              peer-focus:-top-5 peer-focus:text-sm peer-focus:text-blue-600 pointer-events-none">
              Email Address
            </label>
          </div>
          
          {/* Phone Field */}
          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:ring-0 outline-none transition-colors peer"
              placeholder=" "
            />
            <label className="absolute left-0 -top-5 text-sm text-gray-500 transition-all duration-300 
              peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
              peer-focus:-top-5 peer-focus:text-sm peer-focus:text-blue-600 pointer-events-none">
              Phone Number
            </label>
          </div>
          
          {/* Company Field */}
          <div className="relative">
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:ring-0 outline-none transition-colors peer"
              placeholder=" "
            />
            <label className="absolute left-0 -top-5 text-sm text-gray-500 transition-all duration-300 
              peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
              peer-focus:-top-5 peer-focus:text-sm peer-focus:text-blue-600 pointer-events-none">
              Company
            </label>
          </div>
          
          {/* Message Field */}
          <div className="relative">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:ring-0 outline-none transition-colors peer resize-none"
              placeholder=" "
              rows="3"
            ></textarea>
            <label className="absolute left-0 -top-5 text-sm text-gray-500 transition-all duration-300 
              peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
              peer-focus:-top-5 peer-focus:text-sm peer-focus:text-blue-600 pointer-events-none">
              Your Message
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default UnderlineForm;