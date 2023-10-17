import React from 'react';
import {Landing, Login, Register, ForgetPassword, SetNewPassword, Dashboard, Incidents, ReportIncident} from './pages/PageIndex'

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
          <Route path="/forgetpassword" element={<ForgetPassword/>} />
          <Route path="/setnewpassword" element={<SetNewPassword />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/reportincident" element={<ReportIncident />} />
          <Route path="/roadconditions" element={<RoadConditions />} />
        </Routes>
      </Router>
    </div>
  );
};



export default App