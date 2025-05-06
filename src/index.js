import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/projectM">
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/SignIn" element={<SignIn />}/>
        <Route path="/Signup" element={<SignUp />}/>
        <Route path="/dashboard/*" element={<Dashboard />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);