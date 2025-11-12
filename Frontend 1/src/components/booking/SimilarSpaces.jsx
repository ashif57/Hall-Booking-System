import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllHalls } from "../../api/axios";

const SimilarSpaces = () => {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const halls = await fetchAllHalls();
        // Transform the hall data to match the component's expected structure
        const transformedSpaces = halls.slice(0, 3).map((hall, index) => ({
          id: hall.id || index + 1,
          name: hall.hall_name || hall.name || "Unknown Hall",
          capacity: hall.capacity || "N/A",
          about: hall.about || "No description available",
          image: hall.image || `/hero image ${Math.floor(Math.random() * 33) + 1}.jpg`,
        }));
        setSpaces(transformedSpaces);
        // console.log
        setError(null);
      } catch (err) {
        console.error("Failed to fetch halls:", err);
        setError("Failed to load similar spaces. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-bold text-gray-800">Similar Spaces</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="overflow-hidden bg-white border rounded-lg shadow animate-pulse">
              <div className="w-full h-40 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-6 mb-2 bg-gray-200 rounded"></div>
                <div className="h-4 mb-2 bg-gray-200 rounded"></div>
                <div className="h-4 mb-2 bg-gray-200 rounded"></div>
                <div className="w-full h-10 mt-3 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-bold text-gray-800">Similar Spaces</h2>
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="mb-6 text-xl font-bold text-gray-800">Similar Spaces</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {spaces.map((hall) => (
          <div key={hall.id} className="overflow-hidden bg-white border rounded-lg shadow hover:shadow-lg">
            <img src={hall.image} alt={hall.name} className="object-cover w-full h-40" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{hall.name}</h3>
              <p className="mb-2 text-gray-500">Capacity: {hall.capacity} people</p>
              <p className="text-gray-600 line-clamp-2">{hall.about}</p>
              <button
                className="w-full py-2 mt-3 text-white bg-secondary-royal-gold rounded-lg hover:bg-accent-champagne"
                onClick={() => navigate(`/halls/${hall.id}`)}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarSpaces;
