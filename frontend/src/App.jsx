import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Common/Login';
import StudentDashboard from './pages/Student/StudentDashboard';
import BrowseJobs from './pages/Student/BrowseJobs';
import UploadReport from './pages/Student/UploadReport';
import AdminDashboard from './pages/Admin/AdminDashboard';
import VerifyApplications from './pages/Admin/VerifyApplications';
import ReviewReports from './pages/Admin/ReviewReports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/browse-jobs" element={<BrowseJobs />} /> 
        <Route path="/upload-report" element={<UploadReport />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* New faculty routing layouts */}
        <Route path="/verify-applications" element={<VerifyApplications />} />
        <Route path="/review-reports" element={<ReviewReports />} />
      </Routes>
    </Router>
  );
}

export default App;