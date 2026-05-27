import React from 'react';
import BrowseJobs from './pages/Student/BrowseJobs';
import UploadReport from './pages/Student/UploadReport';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Common/Login';
import StudentDashboard from './pages/Student/StudentDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student" element={<StudentDashboard />} />
        {/* This matches the click navigation we added to the sidebar! */}
        <Route path="/browse-jobs" element={<BrowseJobs />} /> 
        <Route path="/upload-report" element={<UploadReport />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;