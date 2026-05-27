import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BrowseJobs() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Sample job catalog - later fetched using Prashant's GET API
  const jobListings = [
    { id: 101, company: "Google", role: "Software Engineer Intern", location: "Bengaluru (Hybrid)", skills: "Python, Go, Data Structures", stipend: "₹50,000/mo" },
    { id: 102, company: "Stripe", role: "Backend Developer Intern", location: "Remote", skills: "Ruby, React, SQL", stipend: "₹45,000/mo" },
    { id: 103, company: "Adobe", role: "Frontend UI Intern", location: "Noida", skills: "JavaScript, React, Tailwind CSS", stipend: "₹40,000/mo" },
    { id: 104, company: "NVIDIA", role: "Embedded Systems Intern", location: "Bengaluru", skills: "C++, ARM Assembly, Digital Electronics", stipend: "₹60,000/mo" }
  ];

  // Filters the rows instantly based on what you type in the search bar
  const filteredJobs = jobListings.filter(job => 
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = (company, role) => {
    alert(`Application submitted successfully for ${role} at ${company}! (This will trigger Prashant's POST API tomorrow)`);
  };

  return (
    <div style={styles.container}>
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar}>
        <h2 style={styles.brand}>PortalIO</h2>
        <nav style={styles.navLinks}>
          <button onClick={() => navigate('/student')} style={styles.navButton}>Dashboard</button>
          <button style={{ ...styles.navButton, ...styles.activeNav }}>Browse Internships</button>
          <button style={styles.navButton}>Upload Report</button>
        </nav>
        <button onClick={() => navigate('/')} style={styles.logoutButton}>Logout</button>
      </aside>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <h1>Explore Available Internships</h1>
          <p style={{ color: '#aaa' }}>Find matching roles tailored to your core technical skill sets.</p>
        </header>

        {/* Real-time Search Box */}
        <div style={styles.searchContainer}>
          <input 
            type="text" 
            placeholder="🔍 Search by company, role, or specific skills (e.g., React, ARM, Python)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Interactive Job Cards Grid */}
        <div style={styles.grid}>
          {filteredJobs.map((job) => (
            <div key={job.id} style={styles.jobCard}>
              <div style={styles.cardHeader}>
                <span style={styles.companyBadge}>{job.company}</span>
                <span style={styles.stipendTag}>{job.stipend}</span>
              </div>
              <h3 style={styles.roleTitle}>{job.role}</h3>
              <p style={styles.locationText}>📍 {job.location}</p>
              
              <div style={styles.skillsSection}>
                <strong>Required Skills:</strong>
                <p style={styles.skillsText}>{job.skills}</p>
              </div>

              <button 
                onClick={() => handleApply(job.company, job.role)} 
                style={styles.applyButton}
              >
                Apply Now
              </button>
            </div>
          ))}

          {filteredJobs.length === 0 && (
            <p style={{ color: '#aaa', gridColumn: '1/-1', textAlign: 'center', marginTop: '20px' }}>
              No internship listings match your search keywords. Try another skill!
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#141414', color: '#ffffff', fontFamily: 'Arial, sans-serif' },
  sidebar: { width: '240px', backgroundColor: '#1f1f1f', padding: '30px 20px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #333' },
  brand: { color: '#646cff', marginBottom: '40px', fontSize: '24px' },
  navLinks: { display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 },
  navButton: { background: 'none', border: 'none', color: '#aaa', padding: '12px', textAlign: 'left', fontSize: '16px', cursor: 'pointer', borderRadius: '6px' },
  activeNav: { backgroundColor: '#646cff', color: '#fff', fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#333', color: '#f87171', border: '1px solid #444', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  mainContent: { flexGrow: 1, padding: '40px', overflowY: 'auto' },
  header: { marginBottom: '25px', borderBottom: '1px solid #333', paddingBottom: '20px' },
  searchContainer: { marginBottom: '30px' },
  searchInput: { width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#1f1f1f', color: '#fff', fontSize: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
  jobCard: { backgroundColor: '#1f1f1f', border: '1px solid #2d2d2d', borderRadius: '12px', padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  companyBadge: { backgroundColor: '#2a2a2a', border: '1px solid #444', padding: '4px 10px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', color: '#646cff' },
  stipendTag: { color: '#4ade80', fontWeight: 'bold', fontSize: '15px' },
  roleTitle: { margin: '0 0 8px 0', fontSize: '20px' },
  locationText: { margin: '0 0 15px 0', color: '#aaa', fontSize: '14px' },
  skillsSection: { borderTop: '1px solid #2d2d2d', paddingVertical: '12px', paddingBottom: '20px', fontSize: '14px' },
  skillsText: { color: '#ccc', margin: '5px 0 0 0', lineHeight: '1.4' },
  applyButton: { backgroundColor: '#646cff', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginTop: 'auto' }
};

export default BrowseJobs;