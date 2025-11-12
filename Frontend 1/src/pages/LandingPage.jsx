
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, CheckSquare, MousePointerClick, MapPin, Users } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { fetchOffices, fetchHalls } from '../api/axios'; 
import { useState, useEffect } from 'react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const LandingPage = () => {
  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState('');
  const [halls, setHalls] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState({
    offices: true,
    halls: false
  });
  const [error, setError] = useState(null);

  // Load offices on component mount
  useEffect(() => {
    const loadOffices = async () => {
      try {
        console.log('Loading offices...');
        const data = await fetchOffices();
        console.log('Loaded offices data:', data);
        setOffices(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Failed to load office list:', err);
        setError('Failed to load offices. Please try again later.');
        setOffices([]);
      } finally {
        setLoading(prev => ({ ...prev, offices: false }));
      }
    };

    loadOffices();
  }, []);

  // Load halls when an office is selected
  useEffect(() => {
    const loadHalls = async () => {
      if (!selectedOffice) {
        setHalls([]);
        return;
      }

      try {
        setLoading(prev => ({ ...prev, halls: true }));
        const data = await fetchHalls(selectedOffice);
        console.log('Loaded halls data:', data);
        setHalls(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load halls:', err);
        setHalls([]);
      } finally {
        setLoading(prev => ({ ...prev, halls: false }));
      }
    };

    loadHalls();
  }, [selectedOffice]);
  
  const handleOfficeChange = (e) => {
    setSelectedOffice(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredHalls = selectedCategory
    ? halls.filter((hall) => hall.category === selectedCategory)
    : halls;

  if (loading.offices) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading offices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md p-6 mx-auto text-center rounded-lg bg-red-50">
          <p className="font-medium text-red-600">Error loading offices</p>
          <p className="mt-2 text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 mt-4 text-white transition-colors bg-secondary-royal-gold rounded hover:bg-accent-champagne"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="flex flex-col min-h-screen"
    >
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 bg-[#032d6b] md:py-24">
          <div className="container px-6 mx-auto text-center">
            <motion.h1 
              className="mb-4 text-4xl font-bold text-white md:text-800 md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Meeting Venue Booking 
            </motion.h1>
            <motion.p 
              className="max-w-3xl mx-auto mb-12 text-lg text-white md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Find, book, and manage your hall reservations with ease. Our intuitive system simplifies the entire process.
            </motion.p>
          </div>
        </section>

        {/* Office Selection Section */}
        <section className="py-8 -mt-8 bg-gray-50">
          <div className="container px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-3xl p-6 mx-auto border-gray-100 shadow-sm rounded-xl"
            >
              <h2 className="mb-4 text-xl font-semibold text-center text-gray-800">Select an Office to View Available Halls</h2>
              <div className="relative w-full">
              <select
                value={selectedOffice}
                onChange={handleOfficeChange}
                className="w-full appearance-none px-5 py-3 text-text-charcoal border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an office...</option>
                {offices.map((office) => (
                  <option key={office.id} value={office.id}>
                    {office.office_name || `Office ${office.id}`}
                  </option>
                ))}
              </select>

              {/* Custom arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            </motion.div>
          </div>
        </section>
        {/* Halls Section */}
        {selectedOffice && (
          <section className="py-12 bg-white">
            <div className="container px-6 mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Available Halls</h2>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="appearance-none px-5 py-3 text-text-charcoal border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {[...new Set(halls.map(hall => hall.category))].map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {loading.halls ? (
                <div className="flex justify-center py-12">
                  <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                </div>
              ) : filteredHalls.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredHalls.map((hall) => (
                    <Link
                      to={`/halls/${hall.id}`}
                      key={hall.id}
                      className="block group"
                    >
                      <div className="flex flex-col h-full overflow-hidden transition-shadow duration-300 bg-white border border-gray-100 rounded-lg shadow-md hover:shadow-lg">
                        <div className="relative h-48 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50">
                          {hall.image ? (
                            <img
                              src={`http://localhost:8000${hall.image}`}
                              alt={hall.hall_name || 'Hall'}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/hall image.jpg';
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full">
                              <img
                                src="/hall image.jpg"
                                alt="Default hall"
                                className="object-contain w-3/4 h-3/4"
                              />
                            </div>
                          )}
                          <div className="absolute px-2 py-1 text-xs font-medium text-gray-800 rounded bottom-2 right-2 bg-white/90 backdrop-blur-sm">
                            {hall.capacity || 'N/A'} people
                          </div>
                        </div>
                        <div className="flex flex-col flex-1 p-5">
                          <h3 className="mb-2 text-lg font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
                            {hall.hall_name || 'Conference Hall'}
                          </h3>
                          <p className="flex-1 mb-4 text-sm text-gray-600 line-clamp-2">
                            {hall.about || 'A well-equipped hall for your meetings and events.'}
                          </p>
                          <div className="flex items-center justify-between mt-auto text-sm text-gray-500">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              <span>{hall.capacity || 'N/A'} capacity</span>
                            </div>
                            <span className="font-medium text-blue-600">View Details →</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-500">No halls available for the selected office and category.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Booking Steps Section */}
        <section className="py-20 bg-gray-50">
          <div className="container px-6 mx-auto">
            <h2 className="mb-12 text-3xl font-bold text-center text-gray-800">How It Works</h2>
            <div className="flex flex-wrap -mx-4">
              <div className="w-full px-4 mb-8 md:w-1/3">
                <div className="h-full p-8 text-center bg-white rounded-lg shadow-md">
                  <div className="inline-block p-4 mb-4 text-blue-600 bg-blue-100 rounded-full">
                    <Calendar size={32} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">1. Select Date & Time</h3>
                  <p className="text-gray-600">Choose your desired date and time slot from our interactive calendar.</p>
                </div>
              </div>
              <div className="w-full px-4 mb-8 md:w-1/3">
                <div className="h-full p-8 text-center bg-white rounded-lg shadow-md">
                  <div className="inline-block p-4 mb-4 text-green-600 bg-green-100 rounded-full">
                    <MousePointerClick size={32} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">2. Provide Details</h3>
                  <p className="text-gray-600">Fill in your team and session details to specify your requirements.</p>
                </div>
              </div>
              <div className="w-full px-4 mb-8 md:w-1/3">
                <div className="h-full p-8 text-center bg-white rounded-lg shadow-md">
                  <div className="inline-block p-4 mb-4 text-purple-600 bg-purple-100 rounded-full">
                    <CheckSquare size={32} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">3. Confirm Booking</h3>
                  <p className="text-gray-600">Submit your request and receive an instant pending confirmation via email.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </motion.div>
  );
};

export default LandingPage;
