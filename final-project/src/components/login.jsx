import React, { useState, useEffect, useRef } from 'react';
import travel from '../assets/travel.jpg';
import user from '../assets/user-logo.jpg';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Login = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [topRatedPlaces, setTopRatedPlaces] = useState([]);
  const menuRef = useRef();
  const navigate = useNavigate();
  const [name,setname] = useState('');
const location = useLocation();
const username = location.state?.name; 




  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleHelp = () => {
    alert('Need help? Contact us at support@travelplanner.com');
  };

  const handleSearch = async () => {
    if (!search.trim()) return alert("Please enter a place name.");
    try {
      navigate("/searched", { state: { place: search } });
    } catch (err) {
      console.error("Search error:", err);
      alert("Place not found!");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const res = await axios.get("http://localhost:5000/toprated");
        setTopRatedPlaces(res.data);
      } catch (err) {
        console.error("Failed to fetch top-rated places:", err);
      }
    };
    fetchTopRated();
  }, []);

  return (
    <div
      className="min-h-screen w-screen bg-no-repeat bg-cover bg-center relative text-white"
      style={{
        backgroundImage: `url(${travel})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* User Dropdown */}
      <div className="flex justify-end p-6 absolute top-0 right-0 z-50" ref={menuRef}>
        <div className="relative">
          <img
            src={user}
            alt="User"
            className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
            onClick={() => setShowMenu((prev) => !prev)}
          />
          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50 text-black">
              <ul className="py-2 text-sm">
                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => navigate('/profile',{state:{name:username}})}
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={handleHelp}
                  >
                    Help
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Welcome Text */}
      <div className="mt-0 text-center px-6">
        <h1 className="text-4xl font-bold drop-shadow-md">Welcome to Travel Planner</h1>
        <p className="text-lg mt-2 text-white/90">Discover top-rated destinations, plan your trips, and explore the beauty of India!</p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mt-8 gap-2 px-4">
        <input
          type="text"
          placeholder="Search place..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full max-w-md px-4 py-2 rounded-xl bg-white/90 text-gray-800 placeholder-gray-500 shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* Top Rated Places */}
      <div className="mt-16 p-6 flex flex-wrap justify-center gap-6">
        {topRatedPlaces.length === 0 ? (
          <p className="text-white text-lg">Loading top-rated places...</p>
        ) : (
          topRatedPlaces.map((place, index) => (
            <div
              key={index}
              className="bg-black/70 p-6 rounded-2xl shadow-xl max-w-sm w-full text-left hover:scale-105 transition-transform duration-300"
            >
              <img
                src={place.img || "https://via.placeholder.com/400x250?text=No+Image"}
                alt={place.place}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-2xl font-semibold mb-2 text-white">{place.place}</h2>
              {place.details && (
                <p className="text-gray-300 text-sm mb-3">{place.details}</p>
              )}
              <p className="text-sm mb-1">
                <strong>Budget:</strong> ₹{place.minbudget} - ₹{place.maxbudget}
              </p>
              <p className="text-sm mb-2">
                <strong>Official:</strong>{" "}
                <a
                  href={`https://${place.official.replace(/^https?:\/\//, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  {place.official}
                </a>
              </p>
              <button
                onClick={() => navigate("/searched", { state: { place: place.place } })}
                className="mt-2 text-sm px-4 py-1 bg-green-600 hover:bg-green-700 rounded-full text-white shadow"
              >
                Know More
              </button>
            </div>
          ))
        )}
      </div>

      <Link to="/login" />
    </div>
  );
};

export default Login;
