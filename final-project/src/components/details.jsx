import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";



const BASE_URL = "https://travel-guide-2mci.onrender.com"; // ✅ backend running locally

const Details = () => {
  const location = useLocation();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // 📅 date picker state
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0]; // ✅ Today's date for min attribute    

  const { place, type, stayName } = location.state || {};

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/details`, {
          params: { name: place, type, stayName },
        });
        setDetails(res.data);
        setErrorMsg("");
      } catch (err) {
        console.error("Error fetching details:", err);
        setDetails(null);
        setErrorMsg(err.response?.data?.message || "Failed to fetch details.");
      } finally {
        setLoading(false);
      }
    };

    if (place && type) {
      fetchDetails();
    } else {
      setLoading(false);
      setErrorMsg("Missing place or type information.");
    }
  }, [place, type, stayName]);

  if (loading) {
    return <div className="text-gray-700 text-center mt-10 text-lg">⏳ Loading...</div>;
  }

  if (errorMsg) {
    return (
      <div className="text-red-600 text-center mt-10 font-bold text-xl">
        ⚠️ {errorMsg}
      </div>
    );
  }

  // 🏨 Hotels & Homestays Card
  const renderCard = (item, index) => (
    <div
      key={index}
      className="bg-white p-8 rounded-2xl mb-8 shadow-2xl border-2 border-blue-200 transition-transform hover:scale-105"
    >
      <h2 className="text-3xl font-extrabold text-blue-700 mb-4">
        {item.name || "Unnamed"}
      </h2>
      {item.rating && <p className="text-gray-800 font-semibold">⭐ Rating: {item.rating}</p>}
      {item.budget && (
        <p className="text-gray-800 font-semibold">
          💰 Budget: <span className="font-bold text-green-600">₹{item.budget}</span>
        </p>
      )}
      {item.details && <p className="text-gray-700 mt-2">📝 {item.details}</p>}
      {item.availability && (
        <p className="text-gray-700 font-medium">📅 Availability: {item.availability}</p>
      )}

      {/* 📅 Date Picker */}
      <div className="mt-4">
        <label className="block text-lg font-semibold text-gray-800 mb-2">
          Select Booking Date:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        disabled={!selectedDate}
        onClick={() =>
          navigate("/payment", {
            state: { place, stayName: item.name, amount: item.budget, date: selectedDate },
          })
        }
        className={`mt-6 w-full text-lg font-bold py-3 rounded-xl shadow-lg transition ${
          selectedDate
            ? "bg-blue-700 text-white hover:bg-blue-800"
            : "bg-gray-400 text-gray-200 cursor-not-allowed"
        }`}
      >
        💳 Pay Now
      </button>
    </div>
  );

  // 🗺️ Tourist Spots Card
  const renderVisitCard = (spot, index) => (
    <div
      key={index}
      className="bg-white p-8 rounded-2xl mb-8 shadow-2xl border-2 border-green-200 transition-transform hover:scale-105"
    >
      <h2 className="text-3xl font-extrabold text-green-700 mb-4">📍 {spot.name}</h2>
      {spot.opening && spot.closing && (
        <p className="text-gray-800 font-semibold">
          ⏰ Timings: {spot.opening} - {spot.closing}
        </p>
      )}
      {spot.rules && <p className="text-gray-700">📜 Rules: {spot.rules}</p>}
      {spot.budget && (
        <p className="text-gray-800 font-semibold">
          💰 Entry Fee: <span className="font-bold text-green-600">₹{spot.budget}</span>
        </p>
      )}

      {/* 📅 Date Picker */}
      <div className="mt-4">
        <label className="block text-lg font-semibold text-gray-800 mb-2">
          Select Travel Date:
        </label>

<input
  type="date"
  value={selectedDate}
  min={today}   // ✅ Prevent past dates
  onChange={(e) => setSelectedDate(e.target.value)}
  className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-blue-500"
/>
      </div>

      <button
        disabled={!selectedDate}
        onClick={() =>
          navigate("/payment", {
            state: { place, stayName: spot.name, amount: spot.budget, date: selectedDate },
          })
        }
        className={`mt-6 w-full text-lg font-bold py-3 rounded-xl shadow-lg transition ${
          selectedDate
            ? "bg-green-700 text-white hover:bg-green-800"
            : "bg-gray-400 text-gray-200 cursor-not-allowed"
        }`}
      >
        🚌 Book Trip
      </button>
    </div>
  );

  // ✅ Choose which renderer to use
  const renderDetails = () => {
    if (!details) return <p>No data available.</p>;

    // 🗺️ Handle ToVisit separately
    if (type?.toLowerCase() === "tovisit" || type?.toLowerCase() === "to-visit") {
      if (Array.isArray(details.tovisit)) {
        return details.tovisit.map(renderVisitCard);
      } else {
        return <p>No tourist spots found.</p>;
      }
    }

    // 🏨 Hotels / Homestays
    if (Array.isArray(details)) {
      return details.length > 0 ? details.map(renderCard) : <p>No entries found.</p>;
    } else if (typeof details === "object") {
      return renderCard(details, 0);
    } else {
      return <p>No structured details available.</p>;
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* ✅ Place Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-8 rounded-2xl shadow-2xl text-center mb-10">
        <h1 className="text-5xl font-extrabold tracking-wide">{place}</h1>
        <p className="text-xl mt-3 font-medium">
          {stayName ? `${stayName} — ${type}` : `Details about ${type}`}
        </p>
      </div>

      {renderDetails()}
    </div>
  );
};

export default Details;
