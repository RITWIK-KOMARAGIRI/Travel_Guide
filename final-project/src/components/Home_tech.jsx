import React, { useState, useEffect } from 'react';
import Login from './login';
import Register from './register_form';
import main from '../assets/main-travel.jpg';
import axios from "axios";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState('');
  const [form, setForm] = useState({ userName: '', password: '' });
  const [users, setUsers] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", form); // ✅ Replace with your actual backend endpoint
      setData(res.data);
      alert("Login successful!");
      localStorage.setItem('user', JSON.stringify(res.data));

      navigate("/login", { state: { name : res.data.name  } })

    } catch (err) {
      console.error("No login found", err);
      alert("Login failed. Please check credentials.");
    }
  };

  const handleRegisterSuccess = async() => {
    try{
      navigate("/register");
    }
    catch{
      console.error("Cant go to register")
    }
  };

  return (
    <div>
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-blue-900 to-black"
        style={{
          backgroundImage: `url(${main})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="w-full max-w-md bg-white/10 border border-white/30 rounded-2xl shadow-2xl p-10">
          <h1 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-md">
            🔐 Login Portal
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-900/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-900/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-cyan-500 transition duration-300"
            >
              Login
            </button>

            <button
              type="button"
              onClick={handleRegisterSuccess}
              className="w-full py-2 rounded-lg bg-purple-700 text-white font-semibold hover:bg-purple-800 transition duration-300"
            >
              Register
            </button>
          </form>
        </div>
      </div>

      {/* Just a demo Link */}
      <Link to="/" className="text-white underline ml-4">Go Home</Link>
    </div>
  );
};

export default Home;
