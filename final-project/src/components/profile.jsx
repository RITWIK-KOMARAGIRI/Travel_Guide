import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Profile = () => {
  const location = useLocation();
  const name = location.state?.name; // From navigation
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`https://travel-guide-2mci.onrender.com/profile?name=${name}`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    if (name) fetchProfile();
  }, [name]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-8 flex items-center justify-center">
      {data ? (
        <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-cyan-400">👤 User Profile</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="font-semibold text-gray-400">Full Name:</span>
              <span>{data.name}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="font-semibold text-gray-400">Username:</span>
              <span>{data.personalInfo.username}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="font-semibold text-gray-400">Email:</span>
              <span>{data.personalInfo.email}</span>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-bold text-cyan-300 mb-2">📌 Trips</h3>
              {data.trips.length === 0 ? (
                <p className="text-gray-400">No trips added yet.</p>
              ) : (
                <ul className="list-disc ml-5 text-gray-200">
                  {data.trips.map((trip, idx) => (
                    <li key={idx}>{trip}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-white text-lg">Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
