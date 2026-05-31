import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  // Your clean roster data
  const students = [
    { uid: "STU081", name: "Anagha R.", dept: "Computer Science", cgpa: "9.4", company: "Google (SWE Intern)", status: "Pending Verification" },
    { uid: "STU042", name: "Siddarth K.", dept: "Information Science", cgpa: "8.7", company: "Stripe (Backend Intern)", status: "Verified" },
    { uid: "STU115", name: "Trisha M.", dept: "Computer Science", cgpa: "8.9", company: "Adobe (Frontend UI Intern)", status: "Pending Verification" },
    { uid: "STU023", name: "Rohan S.", dept: "Data Science", cgpa: "7.8", company: "NVIDIA (Embedded Intern)", status: "Flagged" }
  ];

  // PRASHANT'S INNOVATIVE FEATURE: MongoDB Live Activity Log Feed
  const recentActivities = [
    { id: 1, time: "12:41 PM", user: "Anagha Sriva (STU081)", action: "Uploaded internship project report document", target: "ir_lasertag_v2.pdf", badgeColor: "#646cff" },
    { id: 2, time: "11:30 AM", user: "Siddarth Kumar (STU042)", action: "Submitted new corporate application stream", target: "Nvidia (Hardware Engineer)", badgeColor: "#0ea5e9" },
    { id: 3, time: "10:15 AM", user: "Trisha Roy (STU115)", action: "Logged into student placement portal session", target: "IP: 192.168.1.42", badgeColor: "#10b981" },
    { id: 4, time: "09:04 AM", user: "System Monitor", action: "Flagged academic non-compliance criteria", target: "Rohan S. (Data Science)", badgeColor: "#ef4444" }
  ];

  return (
    <div style={styles.container}>
      {/* Admin Sidebar Navigation */}
      <aside style={styles.sidebar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
          <h2 style={styles.brand}>PortalIO</h2>
          <span style={styles.facultyBadge}>Faculty</span>
        </div>
        
        <nav style={styles.navLinks}>
          <button style={{ ...styles.navButton, ...styles.activeNav }}>Master Roster</button>
          <button onClick={() => navigate('/verify-applications')} style={styles.navButton}>Verify Applications</button>
          <button onClick={() => navigate('/review-reports')} style={styles.navButton}>Review Reports</button>
        </nav>
        
        <button onClick={() => navigate('/')} style={styles.logoutButton}>Logout</button>
      </aside>

      {/* Main Panel Content */}
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.mainHeading}>Departmental Verification Hub</h1>
          <p style={styles.subtitle}>Review student academic compliance logs, evaluate uploaded industrial project certificates, and manage portal parameters.</p>
        </header>

        {/* ================= LIVE MONGODB ACTIVITY LOG BOOK MODULE ================= */}
        <section style={styles.logCard}>
          <div style={styles.logHeader}>
            <h3 style={styles.logTitle}>📊 Live MongoDB Activity Log Book</h3>
            <span style={styles.liveIndicator}><span style={styles.pulseDot}></span> Live Tracking Active</span>
          </div>
          <div style={styles.logStream}>
            {recentActivities.map((log) => (
              <div key={log.id} style={styles.logItem}>
                <span style={styles.logTime}>{log.time}</span>
                <span style={{ ...styles.logTypeBadge, backgroundColor: log.badgeColor }}></span>
                <div style={styles.logTextContainer}>
                  <strong style={styles.logUser}>{log.user}</strong>{' '}
                  <span style={styles.logAction}>{log.action}</span>{' '}
                  <code style={styles.logTarget}>[{log.target}]</code>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* =============================================================================== */}

        {/* Filter Bar */}
        <div style={styles.filterContainer}>
          <input 
            type="text" 
            placeholder="🔍 Filter student roster by name, company registration, or unique UID key..." 
            style={styles.filterInput}
            disabled
          />
        </div>

        {/* Roster Table */}
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Student UID</th>
                <th style={styles.th}>Full Name</th>
                <th style={styles.th}>Department</th>
                <th style={styles.th}>CGPA</th>
                <th style={styles.th}>Registered Company</th>
                <th style={styles.th}>Verification Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index} style={styles.trRow}>
                  <td style={{ ...styles.td, color: '#646cff', fontFamily: 'monospace' }}>{student.uid}</td>
                  <td style={{ ...styles.td, fontWeight: 'bold' }}>{student.name}</td>
                  <td style={styles.td}>{student.dept}</td>
                  <td style={styles.td}>{student.cgpa}</td>
                  <td style={styles.td}>{student.company}</td>
                  <td style={styles.td}>
                    <span style={{ 
                      ...styles.badge, 
                      backgroundColor: student.status === 'Verified' ? '#14532d' : student.status === 'Flagged' ? '#7f1d1d' : '#3b3f10',
                      color: student.status === 'Verified' ? '#4ade80' : student.status === 'Flagged' ? '#f87171' : '#facc15',
                      border: `1px solid ${student.status === 'Verified' ? '#22c55e' : student.status === 'Flagged' ? '#ef4444' : '#eab308'}`
                    }}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
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
  brand: { color: '#646cff', margin: 0, fontSize: '24px' },
  facultyBadge: { backgroundColor: '#facc15', color: '#141414', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
  navLinks: { display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 },
  navButton: { background: 'none', border: 'none', color: '#aaa', padding: '12px', textAlign: 'left', fontSize: '16px', cursor: 'pointer', borderRadius: '6px', width: '100%', transition: 'all 0.2s' },
  activeNav: { backgroundColor: '#646cff', color: '#fff', fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#333', color: '#f87171', border: '1px solid #444', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: 'auto' },
  
  mainContent: { flexGrow: 1, padding: '40px 30px', overflowY: 'auto' },
  header: { marginBottom: '35px', textAlign: 'center' },
  mainHeading: { fontSize: '2.5rem', margin: '0 0 15px 0', fontWeight: 'bold' },
  subtitle: { color: '#aaa', margin: 0, fontSize: '16px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.5' },

  logCard: { backgroundColor: '#1f1f1f', border: '1px solid #2d2d2d', borderRadius: '12px', padding: '20px', marginBottom: '30px' },
  logHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #2d2d2d', paddingBottom: '12px' },
  logTitle: { margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#fff' },
  liveIndicator: { fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' },
  pulseDot: { width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block' },
  logStream: { display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '180px', overflowY: 'auto', paddingRight: '5px' },
  
  // FIXED ALIGNMENT HERE
  logItem: { display: 'flex', alignItems: 'center', gap: '14px', fontSize: '14px', padding: '6px 0', width: '100%', boxSizing: 'border-box' },
  logTime: { color: '#666', fontFamily: 'monospace', fontSize: '13px', width: '65px', flexShrink: 0, textAlign: 'left' },
  logTypeBadge: { width: '6px', height: '16px', borderRadius: '3px', flexShrink: 0 },
  logTextContainer: { color: '#ccc', lineHeight: '1.4', textAlign: 'left', flexGrow: 1 },
  logUser: { color: '#fff' },
  logAction: { color: '#aaa' },
  logTarget: { color: '#646cff', backgroundColor: '#141414', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', marginLeft: '5px', fontFamily: 'monospace', display: 'inline-block' },

  filterContainer: { marginBottom: '25px' },
  filterInput: { width: '100%', padding: '14px 20px', backgroundColor: '#1f1f1f', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' },
  
  tableCard: { backgroundColor: '#1f1f1f', border: '1px solid #2d2d2d', borderRadius: '12px', padding: '25px', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thRow: { borderBottom: '2px solid #2d2d2d' },
  th: { padding: '12px', color: '#aaa', fontSize: '14px', fontWeight: 'bold' },
  trRow: { borderBottom: '1px solid #2d2d2d' },
  td: { padding: '16px 12px', fontSize: '15px' },
  badge: { display: 'inline-block', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }
};

export default AdminDashboard;