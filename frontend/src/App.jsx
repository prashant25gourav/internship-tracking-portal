import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Common/Login';
import StudentDashboard from './pages/Student/StudentDashboard';
import BrowseJobs from './pages/Student/BrowseJobs';
import UploadReport from './pages/Student/UploadReport';
import AdminDashboard from './pages/Admin/AdminDashboard';
import VerifyApplications from "./pages/Admin/VerifyApplications";
import ReviewReports from "./pages/Admin/ReviewReports";
import ManageInternships from "./pages/Admin/ManageInternships";
import StudentDirectory from "./pages/Admin/StudentDirectory";
import CompanyDirectory from "./pages/Admin/CompanyDirectory";

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
        <Route path="/manage-internships" element={<ManageInternships />} />
        <Route path="/students-directory" element={<StudentDirectory />} />
        <Route path="/companies-directory" element={<CompanyDirectory />} />
      </Routes>
    </Router>
  );
}

export default App;