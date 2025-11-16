import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { LogIn, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import apiClient from '../api/axios';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await apiClient.post('/token/', credentials);
      localStorage.setItem('authToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      
      const userResponse = await apiClient.get(`/admin-users/${credentials.username}/`, {
        headers: { Authorization: `Bearer ${response.data.access}` }
      });
      localStorage.setItem('userRole', userResponse.data.role);

      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error('Login failed. Please check your credentials.');
      setError('Invalid username or password.');
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex items-center justify-center min-h-screen bg-slate-300"
    >
      <button
        type="button"
        onClick={() => navigate('/')}
        className="absolute flex items-center px-4 py-2 font-medium text-gray-700 transition-colors duration-300 bg-white rounded-md shadow-sm top-4 right-4 hover:bg-gray-100 border-2 border-primary-deep-navy"
      >
        <ArrowLeft size={18} className="mr-2" /> Back to Home
      </button>
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-xl shadow-lg overflow-hidden border-2 border-primary-deep-navy">
          <div className="hidden md:flex items-center justify-center p-8 bg-blue-50">
            <img src="/adminlogin.svg" alt="Admin Login Illustration" className="w-full max-w-sm" />
          </div>
          <div className="p-8">
            <h2 className="mb-2 text-3xl font-bold text-center text-gray-800">Admin Login</h2>
            <p className="mb-8 text-center text-gray-500">Access the hall management dashboard.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-text-charcoal" htmlFor="username">
              Username
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-text-charcoal border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold text-text-charcoal" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full px-3 py-2 mb-3 leading-tight text-text-charcoal border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="******************"
                value={credentials.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && <p className="text-xs italic text-red-500">{error}</p>}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="flex items-center justify-center w-full px-4 py-2 font-bold text-white transition-colors bg-secondary-royal-gold rounded hover:bg-accent-champagne focus:outline-none focus:shadow-outline"
              type="submit"
            >
              <LogIn size={18} className="mr-2"/>
              Sign In
            </button>
          </div>
        </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminLogin;
