import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if data was passed from login, otherwise use clean defaults
  const incomingData = location.state || {};
  const studentInfo = {
    name: incomingData.studentName || "Demo Student",
    dept: incomingData.studentDept || "Computer Science",
    cgpa: incomingData.studentCgpa || "8.5"
  };

  const applications = [
    { id: 1, company: "Google", role: "Software Engineer Intern", status: "Under Review", date: "May 20, 2026" },
    { id: 2, company: "Stripe", role: "Backend Developer Intern", status: "Accepted", date: "May 15, 2026" },
    { id: 3, company: "Microsoft", role: "Data Analyst Intern", status: "Rejected", date: "May 10, 2026" }
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Accepted': return { backgroundColor: '#1b4d3e', color: '#4ade80' };
      case 'Under Review': return { backgroundColor: '#4d3d1b', color: '#facc15' };
      case 'Rejected': return { backgroundColor: '#4d1b1b', color: '#f87171' };
      default: return { backgroundColor: '#333', color: '#fff' };
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar}>
        <h2 style={styles.brand}>PortalIO</h2>
        <nav style={styles.navLinks}>
          <button style={{ ...styles.navButton, ...styles.activeNav }}>Dashboard</button>
          
          {/* We added the onClick trigger hook here! */}
          <button 
            onClick={() => navigate('/browse-jobs')} 
            style={styles.navButton}
          >
            Browse Internships
          </button>
          
          <button style={styles.navButton}>Upload Report</button>
        </nav>
        <button onClick={() => navigate('/')} style={styles.logoutButton}>Logout</button>
      </aside>

      {/* Main Panel Content */}
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <div>
            <h1>Welcome back, {studentInfo.name}!</h1>
            <p style={{ color: '#aaa' }}>{studentInfo.dept} Department | CGPA: {studentInfo.cgpa}</p>
          </div>
        </header>

        {/* Dynamic Metric Cards */}
        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3>Total Applied</h3>
            <p style={styles.statNumber}>{applications.length}</p>
          </div>
          <div style={styles.statCard}>
            <h3>Under Review</h3>
            <p style={{ ...styles.statNumber, color: '#facc15' }}>
              {applications.filter(a => a.status === 'Under Review').length}
            </p>
          </div>
          <div style={styles.statCard}>
            <h3>Offers Secured</h3>
            <p style={{ ...styles.statNumber, color: '#4ade80' }}>
              {applications.filter(a => a.status === 'Accepted').length}
            </p>
          </div>
        </section>

        {/* Tracked Applications Table */}
        <section style={styles.tableSection}>
          <h2 style={{ marginBottom: '15px' }}>Your Applications</h2>
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
              {applications.map((app) => (
                <tr key={app.id} style={styles.tr}>
                  <td style={styles.td}><strong>{app.company}</strong></td>
                  <td style={styles.td}>{app.role}</td>
                  <td style={styles.td}>{app.date}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.statusBadge, ...getStatusStyle(app.status) }}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* AI Engine Placeholder Banner */}
        <section style={styles.aiBanner}>
          <h3>✨ Smart Internship Recommendations</h3>
          <p style={{ color: '#ccc', margin: '5px 0 15px 0' }}>
            Our background matching pipeline is ready. Connect your skills array to sort current openings instantly!
          </p>
          <button style={styles.aiButton}>Compute Optimal Matches</button>
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#141414',
    color: '#ffffff',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: '240px',
    backgroundColor: '#1f1f1f',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #333',
  },
  brand: {
    color: '#646cff',
    marginBottom: '40px',
    fontSize: '24px',
  },
  navLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flexGrow: 1,
  },
  navButton: {
    background: 'none',
    border: 'none',
    color: '#aaa',
    padding: '12px',
    textAlign: 'left',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: '0.2s',
  },
  activeNav: {
    backgroundColor: '#646cff',
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#333',
    color: '#f87171',
    border: '1px solid #444',
    padding: '10px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  mainContent: {
    flexGrow: 1,
    padding: '40px',
    overflowY: 'auto',
  },
  header: {
    marginBottom: '30px',
    borderBottom: '1px solid #333',
    paddingBottom: '20px',
  },
  statsGrid: {
    display: 'flex',
    gap: '20px',
    marginBottom: '35px',
  },
  statCard: {
    backgroundColor: '#1f1f1f',
    padding: '20px',
    borderRadius: '10px',
    flex: 1,
    border: '1px solid #2d2d2d',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginTop: '10px',
    margin: 0,
    color: '#646cff',
  },
  tableSection: {
    backgroundColor: '#1f1f1f',
    padding: '25px',
    borderRadius: '10px',
    border: '1px solid #2d2d2d',
    marginBottom: '30px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  thRow: {
    borderBottom: '2px solid #333',
  },
  th: {
    padding: '12px',
    color: '#aaa',
    fontSize: '14px',
  },
  tr: {
    borderBottom: '1px solid #2d2d2d',
  },
  td: {
    padding: '15px 12px',
  },
  statusBadge: {
    padding: '5px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  aiBanner: {
    background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)',
    border: '1px solid #581c87',
    padding: '25px',
    borderRadius: '10px',
  },
  aiButton: {
    backgroundColor: '#a855f7',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  }
};

export default StudentDashboard;