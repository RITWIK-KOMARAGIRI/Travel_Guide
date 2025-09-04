import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Searched = () => {
  const [placeData, setPlaceData] = useState(null);
  const [homeStay, setHomeStay] = useState([]);
  const [tovisit, setToVisit] = useState([]);
  const [emergency, setEmergency] = useState([]);
  const [img, setImage] = useState("");

  const location = useLocation();
  const placeName = location.state?.place;
  const navigate = useNavigate();

  // ✅ Navigate with name + type + stayName (if homestay)
  const getdetails = (name, type, stayName = null) => {
    navigate("/details", {
      state: { place: name, type, stayName },
    });
  };

  // ✅ Replace localhost with Render base URL
  const BASE_URL = "https://travel-guide-2mci.onrender.com";

  // Fetch Hotels
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/searched?place=${placeName}`);
        setPlaceData(res.data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setPlaceData(null);
      }
    };
    if (placeName) fetchPlace();
  }, [placeName]);

  // Fetch Image
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/image?place=${placeName}`);
        setImage(
          res.data[0]?.img || "https://via.placeholder.com/150?text=No+Image"
        );
      } catch (err) {
        console.error("Failed to fetch image:", err);
        setImage("https://via.placeholder.com/150?text=No+Image");
      }
    };
    if (placeName) fetchImage();
  }, [placeName]);

  // Fetch Home Stays
  useEffect(() => {
    const fetchHomeStays = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/homeStays?place=${placeName}`);
        setHomeStay(res.data || []);
      } catch (err) {
        console.log("No home stays:", err);
        setHomeStay([]);
      }
    };
    if (placeName) fetchHomeStays();
  }, [placeName]);

  // Fetch Nearby Places
  useEffect(() => {
    const fetchNearby = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/nearBY?place=${placeName}`);
        setToVisit(res.data || []);
      } catch (err) {
        console.error("No nearby places:", err);
        setToVisit([]);
      }
    };
    if (placeName) fetchNearby();
  }, [placeName]);

  // Fetch Emergency Hospitals
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/emergency?place=${placeName}`);
        setEmergency(res.data || []);
      } catch (err) {
        console.error("No hospitals:", err);
        setEmergency([]);
      }
    };
    if (placeName) fetchHospitals();
  }, [placeName]);

  if (placeData === null) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center px-4">
        <div className="bg-white border border-red-300 text-red-700 px-6 py-5 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-3">⚠️ Error</h2>
          <p className="text-lg">
            No data found for this place. Please try another search.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-8 bg-cover bg-center flex flex-col items-center"
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="bg-black bg-opacity-70 backdrop-blur-sm text-white px-8 py-6 rounded-2xl shadow-lg mb-10 w-full max-w-4xl border border-gray-600">
        <h1 className="text-4xl font-extrabold tracking-wide text-center uppercase text-blue-300">
          {placeName}
        </h1>
        <p className="text-center mt-2 text-gray-300 text-lg">
          Discover the best of {placeName}
        </p>
      </div>

      {/* Nearby Places */}
      {tovisit.length > 0 && (
        <>
          <h2 className="text-white text-3xl font-semibold mb-4 self-start w-full max-w-6xl">
            🗺️ Places to Visit
          </h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-6xl mb-10">
            {tovisit.map((item, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-90 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.name}
                </h3>
                {item.budget && (
                  <p className="text-gray-700 mb-1">
                    💰 Budget: ₹
                    <span className="font-semibold">{item.budget}</span>
                  </p>
                )}
                {item.opening && item.closing && (
                  <p className="text-gray-700 mb-1">
                    ⏰ Timings: {item.opening} - {item.closing}
                  </p>
                )}
                {item.rules && (
                  <p className="text-gray-700">📜 Rules: {item.rules}</p>
                )}
                <button
                  onClick={() => getdetails(placeName,"tovisit",item.name)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Home Stays */}
      {homeStay.length > 0 && (
        <>
          <h2 className="text-white text-3xl font-semibold mb-4 self-start w-full max-w-6xl">
            🏨 Home Stays
          </h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-6xl mb-10">
            {homeStay.map((stay, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-90 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {stay.name}
                </h3>
                <p className="text-gray-700 mb-1">
                  ⭐ Rating: <span className="font-semibold">{stay.rating}</span>
                </p>
                <p className="text-gray-700">
                  💰 Budget: ₹
                  <span className="font-semibold">{stay.budget}</span>
                </p>
                <button
                  onClick={() =>
                    getdetails(placeName, "homestay", stay.name)
                  }
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Hotels */}
      {placeData?.hotels && placeData.hotels.length > 0 && (
        <>
          <h2 className="text-white text-3xl font-semibold mb-4 self-start w-full max-w-6xl">
            🏨 Hotels
          </h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-6xl">
            {placeData.hotels.map((hotel, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-90 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {hotel.name}
                </h3>
                <p className="text-gray-700 mb-1">
                  ⭐ Rating: <span className="font-semibold">{hotel.rating}</span>
                </p>
                <p className="text-gray-700">
                  💰 Budget: ₹
                  <span className="font-semibold">{hotel.budget}</span>
                </p>
                <button
                  onClick={() => getdetails(placeName,"hotel",hotel.name)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Emergency Hospitals */}
      {emergency.length > 0 && (
        <>
          <h2 className="text-white text-3xl font-semibold mb-4 self-start w-full max-w-6xl">
            🚨 Emergency Hospitals Near By
          </h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-6xl mb-10">
            {emergency.map((hospitalName, index) => (
              <div
                key={index}
                className="bg-red-900 bg-opacity-80 backdrop-blur-sm text-white px-6 py-4 rounded-xl shadow-lg border border-red-700 transition-all duration-300 ease-in-out hover:shadow-red-500/50 hover:scale-105 flex flex-col items-center justify-center"
              >
                <span className="text-red-300 mr-3 text-2xl">🏥</span>
                <h3 className="text-xl font-bold text-red-100 text-center">
                  {hospitalName}
                </h3>
                <button
                  onClick={() => window.open(`https://www.google.com/maps/search/${hospitalName}`, '_blank')  }
                  className="mt-3 px-3 py-1 bg-white text-red-900 font-semibold rounded-lg shadow hover:bg-red-200 transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Searched;
