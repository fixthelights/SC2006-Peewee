import React from 'react';
import {Landing, Login, Register, ForgetPasswordOld, Dashboard, Incidents, ReportIncident, Map, ForgetPassword, FavouriteRoutes} from './pages/PageIndex'

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import axios from 'axios'
import RoadConditions from './pages/RoadConditions';

//import MapSection from './components/Map' // import the map here


import './App.css'
  
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgetpasswordold" element={<ForgetPasswordOld/>} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/map" element={<Map/>} />
          <Route path="/reportincident" element={<ReportIncident />} />
          <Route path="/roadconditions" element={<RoadConditions />} />
          <Route path="/roadconditions/:cameraId" element={<RoadConditions />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/favouriteroutes" element={<FavouriteRoutes />} />
        </Routes>
      </Router>
    </div>
  );
};



export default App