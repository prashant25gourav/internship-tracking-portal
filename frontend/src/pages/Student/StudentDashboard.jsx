import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Fallback defaults if the user bypassed registration inputs
  const studentData = location.state || {
    studentName: "Demo Student",
    studentDept: "Computer Science Department",
    studentCgpa: "8.5"
  };

  return (
    <div style={styles.container}>
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar}>
        <h2 style={styles.brand}>PortalIO</h2>
        <nav style={styles.navLinks}>
          <button style={{ ...styles.navButton, ...styles.activeNav }}>Dashboard</button>
          
          {/* FIXED: Restored Browse Internships menu line with correct route handler */}
          <button onClick={() => navigate('/browse-jobs')} style={styles.navButton}>
            Browse Internships
          </button>
          
          <button onClick={() => navigate('/upload-report')} style={styles.navButton}>
            Upload Report
          </button>
        </nav>
        <button onClick={() => navigate('/')} style={styles.logoutButton}>Logout</button>
      </aside>

      {/* Main Stats Panel */}
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.mainHeading}>Welcome back, {studentData.studentName}!</h1>
          <p style={{ color: '#aaa', margin: 0 }}>{studentData.studentDept} | CGPA: {studentData.studentCgpa}</p>
        </header>

        {/* Quick Info Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Total Applied</span>
            <strong style={{ ...styles.statNumber, color: '#646cff' }}>3</strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Under Review</span>
            <strong style={{ ...styles.statNumber, color: '#facc15' }}>1</strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Offers Secured</span>
            <strong style={{ ...styles.statNumber, color: '#4ade80' }}>1</strong>
          </div>
        </div>

        {/* Dynamic Status Tracking Table */}
        <div style={styles.tableCard}>
          <h3 style={{ margin: '0 0 20px 0', textAlign: 'center', color: '#fff' }}>Your Applications</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Company</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Applied Date</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={styles.trRow}>
                <td style={{ ...styles.td, fontWeight: 'bold' }}>Google</td>
                <td style={styles.td}>Software Engineer Intern</td>
                <td style={styles.td}>May 20, 2026</td>
                <td style={styles.td}><span style={{ ...styles.badge, backgroundColor: '#3b3f10', color: '#facc15' }}>Under Review</span></td>
              </tr>
              <tr style={styles.trRow}>
                <td style={{ ...styles.td, fontWeight: 'bold' }}>Stripe</td>
                <td style={styles.td}>Backend Developer Intern</td>
                <td style={styles.td}>May 15, 2026</td>
                <td style={styles.td}><span style={{ ...styles.badge, backgroundColor: '#14532d', color: '#4ade80' }}>Accepted</span></td>
              </tr>
              <tr style={styles.trRow}>
                <td style={{ ...styles.td, fontWeight: 'bold' }}>Microsoft</td>
                <td style={styles.td}>Data Analyst Intern</td>
                <td style={styles.td}>May 10, 2026</td>
                <td style={styles.td}><span style={{ ...styles.badge, backgroundColor: '#7f1d1d', color: '#f87171' }}>Rejected</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#141414', color: '#ffffff', fontFamily: 'Arial, sans-serif' },
  sidebar: { width: '240px', backgroundColor: '#1f1f1f', padding: '30px 20px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #333', flexShrink: 0 },
  brand: { color: '#646cff', marginBottom: '40px', fontSize: '24px' },
  navLinks: { display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 },
  navButton: { background: 'none', border: 'none', color: '#aaa', padding: '12px', textAlign: 'left', fontSize: '16px', cursor: 'pointer', borderRadius: '6px', width: '100%' },
  activeNav: { backgroundColor: '#646cff', color: '#fff', fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#333', color: '#f87171', border: '1px solid #444', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  
  mainContent: { flexGrow: 1, padding: '40px 30px', overflowY: 'auto', maxWidth: 'calc(100vw - 240px)' },
  header: { marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '20px' },
  mainHeading: { fontSize: '2.5rem', margin: '0 0 10px 0', fontWeight: 'bold' },
  
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' },
  statCard: { backgroundColor: '#1f1f1f', border: '1px solid #2d2d2d', padding: '25px', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' },
  statLabel: { fontSize: '15px', color: '#aaa', fontWeight: 'bold' },
  statNumber: { fontSize: '2rem', fontWeight: 'bold' },
  
  tableCard: { backgroundColor: '#1f1f1f', border: '1px solid #2d2d2d', borderRadius: '12px', padding: '25px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thRow: { borderBottom: '2px solid #2d2d2d' },
  th: { padding: '12px', color: '#aaa', fontSize: '14px', fontWeight: 'bold' },
  trRow: { borderBottom: '1px solid #2d2d2d' },
  td: { padding: '16px 12px', fontSize: '15px' },
  badge: { padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }
};

export default StudentDashboard;