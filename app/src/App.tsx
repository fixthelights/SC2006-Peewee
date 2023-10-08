import React from 'react';
import {Landing, Login, Register, ForgetPassword, SetNewPassword, Dashboard, Incidents, ReportIncidentType, ReportIncidentLocation, ReportIncidentDescription} from './pages/PageIndex'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
  
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgetpassword" element={<ForgetPassword/>} />
          <Route path="/setnewpassword" element={<SetNewPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/reporttype" element={<ReportIncidentType />} />
          <Route path="/reportlocation" element={<ReportIncidentLocation />} />
          <Route path="/reportdescription" element={<ReportIncidentDescription />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;