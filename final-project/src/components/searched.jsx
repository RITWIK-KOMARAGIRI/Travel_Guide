import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Searched = () => {
  const [placeData, setPlaceData] = useState(null); // For hotels
  const [homeStay, sethomeStay] = useState(null);
  const [tovisit, settovisit] = useState(null);
  const [about, setabout] = useState(null);
  const [emergency, setemergency] = useState(null); // State for emergency data (array of strings)
  const [img, setImage] = useState('');
  const location = useLocation();
  const placeName = location.state?.place;

  // Fetches main place data (e.g., hotels)
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/searched?place=${placeName}`);
        setPlaceData(res.data);
      } catch (error) {
        console.error("Error fetching main place data (hotels):", error);
        setPlaceData(null); // Set to null on error
      }
    };

    if (placeName) {
      fetchPlace();
    }
  }, [placeName]);

  // Fetches image data
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/image?place=${placeName}`);
        setImage(res.data[0]?.img || '');
      } catch (err) {
        console.error("Failed to fetch image:", err);
      }
    };

    if (placeName) {
      fetchImage();
    }
  }, [placeName]);

  // Fetches home stays data
  useEffect(() => {
    const fetchHomeStays = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/homeStays?place=${placeName}`);
        sethomeStay(res.data);
      } catch (err) {
        console.log("No home stays available:", err);
        sethomeStay([]);
      }
    };

    if (placeName) {
      fetchHomeStays();
    }
  }, [placeName]);

  // Fetches nearby places to visit data
  useEffect(() => {
    const fetchnearby = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/nearBY?place=${placeName}`);
        settovisit(res.data);
      } catch (err) {
        console.error("No nearby places found or error fetching:", err);
        settovisit([]);
      }
    };
    if (placeName) {
      fetchnearby();
    }
  }, [placeName]);

  // Fetches about details
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/about?place=${placeName}`);
        setabout(res.data);
      } catch (err) {
        console.error("Error fetching about information:", err);
        setabout(null); // Set to null on error or if not found
      }
    };
    if (placeName) {
      fetchAbout();
    }
  }, [placeName]);

  // NEW: Fetches emergency contacts (hospitals)
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/emergency?place=${placeName}`);
        setemergency(res.data); // This will now be an array of strings
      } catch (err) {
        console.error("No hospitals found or error fetching:", err);
        setemergency([]); // Set to empty array on error or no data
      }
    };
    if (placeName) {
      fetchHospitals();
    }
  }, [placeName]);

  // Display loading until at least the main placeData is fetched
  if (!placeData) return <div className="text-white text-xl text-center py-10">Loading...</div>;

  return (
    <div
      className="min-h-screen p-8 bg-cover bg-center flex flex-col items-center"
      style={{ backgroundImage: `url(${img})` }}
    >
      {/* Header Section */}
      <div className="bg-black bg-opacity-70 backdrop-blur-sm text-white px-8 py-6 rounded-2xl shadow-lg mb-10 w-full max-w-4xl border border-gray-600">
        <h1 className="text-4xl font-extrabold tracking-wide text-center uppercase text-blue-300">{placeName}</h1>
        <p className="text-center mt-2 text-gray-300 text-lg">Discover the best of {placeName}</p>
      </div>

      {/* About Section - Now uses 'about' state with enhanced styling */}
      {about && (
        <div className="bg-gradient-to-br from-gray-800 to-black bg-opacity-90 backdrop-blur-md text-white px-8 py-6 rounded-3xl shadow-2xl mb-10 w-full max-w-4xl border border-blue-600 transition-all duration-300 ease-in-out hover:shadow-blue-500/50">
          <h2 className="text-3xl font-bold mb-4 text-center text-blue-400">
            <span className="mr-2">✨</span> About {about.placename || placeName}
          </h2>
          {about.about && (
            <p className="text-gray-200 leading-relaxed text-lg whitespace-pre-wrap mb-4 font-light border-b border-gray-700 pb-4">
              {about.about}
            </p>
          )}

          <div className="mt-4 space-y-3">
            {about.minbudget !== undefined && (
              <p className="text-gray-300 flex items-center">
                <span className="text-yellow-400 mr-2">💰</span>
                <span className="font-semibold">Estimated Minimum Budget:</span>{' '}
                <span className="ml-1 text-lg text-yellow-300">₹{about.minbudget}</span>
              </p>
            )}
            {about.official && (
              <p className="text-gray-300 flex items-center">
                <span className="text-green-400 mr-2">🌐</span>
                <span className="font-semibold">Official Website:</span>{' '}
                <a
                  href={about.official.startsWith('http') ? about.official : `http://${about.official}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline ml-1 transition-colors duration-200"
                >
                  {about.official}
                </a>
              </p>
            )}
            {about.month && (
              <p className="text-gray-300 flex items-center">
                <span className="text-purple-400 mr-2">📅</span>
                <span className="font-semibold">Best Month to Visit:</span>{' '}
                <span className="ml-1 text-lg text-purple-300">{about.month}</span>
              </p>
            )}
          </div>
        </div>
      )}
      {!about && placeName && <div className="text-white text-xl text-center py-10">Loading about information...</div>}


      {/* Places to Visit Section */}
      {tovisit && tovisit.length > 0 && (
        <>
          <h2 className="text-white text-3xl font-semibold mb-4 self-start w-full max-w-6xl">🗺️ Places to Visit</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-6xl mb-10">
            {tovisit.map((item, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-90 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                {item.budget !== undefined && <p className="text-gray-700 mb-1">💰 Budget: ₹<span className="font-semibold">{item.budget}</span></p>}
                {item.opening && item.closing && (
                  <p className="text-gray-700 mb-1">⏰ Timings: {item.opening} - {item.closing}</p>
                )}
                {item.rules && <p className="text-gray-700">📜 Rules: {item.rules}</p>}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Home Stays Heading and Cards */}
      {homeStay && homeStay.length > 0 && (
        <>
          <h2 className="text-white text-3xl font-semibold mb-4 self-start w-full max-w-6xl">🏨 Home Stays</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-6xl mb-10">
            {homeStay.map((stay, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-90 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{stay.name}</h3>
                <p className="text-gray-700 mb-1">⭐ Rating: <span className="font-semibold">{stay.rating}</span></p>
                <p className="text-gray-700">💰 Budget: ₹<span className="font-semibold">{stay.budget}</span></p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Hotels Heading and Cards */}
      {placeData.hotels && placeData.hotels.length > 0 && (
        <>
          <h2 className="text-white text-3xl font-semibold mb-4 self-start w-full max-w-6xl">🏨 Hotels</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-6xl">
            {placeData.hotels.map((hotel, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-90 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                <p className="text-gray-700 mb-1">⭐ Rating: <span className="font-semibold">{hotel.rating}</span></p>
                <p className="text-gray-700">💰 Budget: ₹<span className="font-semibold">{hotel.budget}</span></p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Emergency Contacts Section - NOW LAST */}
      {emergency && emergency.length > 0 && (
        <>
          <h2 className="text-white text-3xl font-semibold mb-4 self-start w-full max-w-6xl">🚨 Emergency Hospitals Near By</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-6xl mb-10">
            {emergency.map((hospitalName, index) => (
              <div
                key={index}
                className="bg-red-900 bg-opacity-80 backdrop-blur-sm text-white px-6 py-4 rounded-xl shadow-lg border border-red-700 transition-all duration-300 ease-in-out hover:shadow-red-500/50 hover:scale-105 flex items-center justify-center"
              >
                <span className="text-red-300 mr-3 text-2xl">🏥</span> {/* Hospital icon */}
                <h3 className="text-xl font-bold text-red-100 text-center">{hospitalName}</h3>
              </div>
            ))}
          </div>
        </>
      )}
      {!emergency && placeName && <div className="text-white text-xl text-center py-10">Loading emergency contacts...</div>}

    </div>
  );
};

export default Searched;