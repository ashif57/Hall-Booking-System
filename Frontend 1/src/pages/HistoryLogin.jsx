import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { LogIn, ArrowLeft, Mail, Lock } from 'lucide-react';
import apiClient, { fetchBookingsByEmail } from '../api/axios';

const HistoryLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // API call to send OTP to the provided email
      await apiClient.post('/send-otp/', { email });
      setIsOtpSent(true);
      toast.success('OTP sent to your email!');
    } catch (err) {
      toast.error('Failed to send OTP. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // API call to verify OTP
      const response = await apiClient.post('/verify-otp/', { email, otp });
      localStorage.setItem('userEmail', email); // Store user email for history page
      toast.success('Login successful!');
      navigate('/history'); // Redirect to history page after successful login
    } catch (err) {
      toast.error('Invalid OTP. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex items-center justify-center min-h-screen bg-background-ivory-white"
    >
      <button
        type="button"
        onClick={() => navigate('/')}
        className="absolute flex items-center px-4 py-2 font-medium text-text-charcoal transition-colors duration-300 rounded-md top-4 right-4 hover:bg-secondary-royal-gold hover:text-white"
      >
        <ArrowLeft size={18} className="mr-2" /> Back to Home
      </button>
      
      <div className="w-full max-w-md p-8 m-4 bg-white rounded-lg shadow-md">
        <h2 className="mb-2 text-3xl font-bold text-center text-gray-800">History Login</h2>
        <p className="mb-8 text-center text-gray-500">Access your booking history</p>
        
        {!isOtpSent ? (
          // Email form
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-bold text-text-charcoal" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <input
                  className="w-full px-3 py-2 pl-10 leading-tight text-text-charcoal border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={20} className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              </div>
            </div>
            
            <button
              className="flex items-center justify-center w-full px-4 py-2 font-bold text-white transition-colors bg-secondary-royal-gold rounded hover:bg-accent-champagne focus:outline-none focus:shadow-outline disabled:opacity-50"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Sending OTP...' : (
                <>
                  <LogIn size={18} className="mr-2"/>
                  Send OTP
                </>
              )}
            </button>
          </form>
        ) : (
          // OTP form
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-text-charcoal" htmlFor="email">
                Email Address
              </label>
              <input
                className="w-full px-3 py-2 text-text-charcoal bg-background-ivory-white border rounded shadow appearance-none focus:outline-none"
                id="email"
                type="email"
                value={email}
                disabled
              />
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 text-sm font-bold text-text-charcoal" htmlFor="otp">
                OTP
              </label>
              <div className="relative">
                <input
                  className="w-full px-3 py-2 pl-10 leading-tight text-text-charcoal border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <Lock size={20} className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              </div>
              <p className="mt-2 text-xs text-gray-500">Check your email for the OTP code</p>
            </div>
            
            <button
              className="flex items-center justify-center w-full px-4 py-2 font-bold text-white transition-colors bg-secondary-royal-gold rounded hover:bg-accent-champagne focus:outline-none focus:shadow-outline disabled:opacity-50"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : (
                <>
                  <LogIn size={18} className="mr-2"/>
                  Verify OTP
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default HistoryLogin;