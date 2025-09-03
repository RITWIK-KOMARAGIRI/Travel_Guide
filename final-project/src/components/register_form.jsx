  import React, { useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import axios from 'axios';

  const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
      id:'',
      name: '',
      userName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
     
     
    const handleRegister = async (e) => {
      e.preventDefault();

      if (form.password !== form.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const response = await axios.post("https://travel-guide-2mci.onrender.com/register", {
          id:form.id,
          name: form.name,
          userName: form.userName,
          email: form.email,
          password: form.password
        });

        localStorage.setItem('user', JSON.stringify(response.data));
        alert("Registration successful!");
        navigate("/login",{state: {name:form.name}});
      } catch (err) {
        console.error("Registration failed:", err);
        alert("Registration failed. Please try again.");
      }
    
   const setdata = async () => {
  try {
    const response = await axios.post("https://travel-guide-2mci.onrender.com/add/profile", {
      name: form.name,
      userName: form.userName,
      email: form.email,
    });
  } catch {
    console.error("no data added");
  }
};
    };
  

    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-blue-900 to-black">
        <div className="w-full max-w-sm bg-gray-900 rounded-xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-center text-white drop-shadow-lg">Register</h1>
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="text"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              placeholder="id"
              required
              className="w-full px-3 py-2 border-none rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
              required
              className="w-full px-3 py-2 border-none rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
              placeholder="Username"
              required
              className="w-full px-3 py-2 border-none rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              required
              className="w-full px-3 py-2 border-none rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter password"
              required
              className="w-full px-3 py-2 border-none rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Confirm password"
              required
              className="w-full px-3 py-2 border-none rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-700 text-white py-2 rounded-lg font-bold shadow-lg hover:from-blue-500 hover:to-blue-800 transition-all duration-200"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    );
  };

  export default Register;
