import React from 'react';
import {HashRouter, BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home_tech';
import Register from './components/register_form'
import Login from './components/login'
import Searched from './components/searched'
import Profile from './components/profile'
const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />}/>
        <Route path="/login" element={<Login />}/>
        <Route path='/searched' element={< Searched />}/>
        <Route path='/profile' element={<Profile />}/>
      </Routes>
    </HashRouter>
  );
};

export default App;
