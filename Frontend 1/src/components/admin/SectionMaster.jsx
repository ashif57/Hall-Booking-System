import React, { useState, useEffect } from 'react';
import { fetchSessionsWithHalls, updateSessionHallMapping } from '../../api/axios';

const SectionMaster = () => {
  const [sessions, setSessions] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { sessions: fetchedSessions, halls: fetchedHalls } = await fetchSessionsWithHalls();
        setSessions(fetchedSessions);
        setHalls(fetchedHalls);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHallChange = async (sessionId, hallId, preferenceLevel) => {
    try {
      await updateSessionHallMapping(sessionId, hallId, preferenceLevel);
      // Refresh data after update
      const { sessions: updatedSessions, halls: updatedHalls } = await fetchSessionsWithHalls();
      setSessions(updatedSessions);
      setHalls(updatedHalls);
    } catch (err) {
      console.error('Failed to update session hall mapping:', err);
      setError('Failed to update session hall mapping');
    }
  };

  if (loading) {
    return <div className="bg-white rounded-lg shadow-md overflow-hidden p-4">Loading...</div>;
  }

  if (error) {
    return <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="font-semibold">Session Type to Hall Mapping</h3>
      </div>
      <div className="divide-y">
        {sessions.map((session) => (
          <div key={session.id} className="p-4 flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <span className="font-medium text-gray-800">{session.session_type}</span>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Preferred Hall 1:</span>
                <select 
                  value={session.preferred_hall_1 || ''}
                  onChange={(e) => handleHallChange(session.id, e.target.value || null, 1)}
                  className="p-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Hall</option>
                  {halls.map(hall => (
                    <option key={hall.id} value={hall.id}>{hall.hall_name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Preferred Hall 2:</span>
                <select 
                  value={session.preferred_hall_2 || ''}
                  onChange={(e) => handleHallChange(session.id, e.target.value || null, 2)}
                  className="p-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Hall</option>
                  {halls.map(hall => (
                    <option key={hall.id} value={hall.id}>{hall.hall_name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Preferred Hall 3:</span>
                <select 
                  value={session.preferred_hall_3 || ''}
                  onChange={(e) => handleHallChange(session.id, e.target.value || null, 3)}
                  className="p-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Hall</option>
                  {halls.map(hall => (
                    <option key={hall.id} value={hall.id}>{hall.hall_name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionMaster;
