import React from 'react';
import {Landing, Login, Register, ForgetPasswordOld, Dashboard, Incidents, ReportIncident, Map, ForgetPassword, FavouriteRoutes} from './pages/PageIndex'

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import RoadConditions from './pages/RoadConditions';

//import MapSection from './components/Map' // import the map here
import './App.css'
import PrivateRoute from './components/PrivateRoute';
  
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/incidents" element={<PrivateRoute><Incidents /></PrivateRoute>} />
          <Route path="/map" element={<PrivateRoute><Map/></PrivateRoute>} />
          <Route path="/reportincident" element={<PrivateRoute><ReportIncident /></PrivateRoute>} />
          <Route path="/roadconditions" element={<PrivateRoute><RoadConditions /></PrivateRoute>} />
          <Route path="/favouriteroutes" element={<PrivateRoute><FavouriteRoutes /></PrivateRoute>} />
          {/* <Route path="/forgetpasswordold" element={<ForgetPasswordOld/>} /> */}
        </Routes>
      </Router>
    </div>
  );
};



export default App