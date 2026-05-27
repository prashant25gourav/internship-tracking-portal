import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('roster'); // Tracks 'roster' vs 'settings' views
  const [searchTerm, setSearchTerm] = useState('');

  // System Configuration States
  const [settings, setSettings] = useState({
    allowSubmissions: true,
    allowApplications: true,
    cgpaThreshold: '8.00',
    academicYear: '2026'
  });

  // Mock student database entries
  const [students, setStudents] = useState([
    { id: "STU081", name: "Anagha R.", dept: "Computer Science", cgpa: "9.4", company: "Google", role: "SWE Intern", status: "Pending Verification" },
    { id: "STU042", name: "Siddarth K.", dept: "Information Science", cgpa: "8.7", company: "Stripe", role: "Backend Intern", status: "Verified" },
    { id: "STU115", name: "Trisha M.", dept: "Computer Science", cgpa: "8.9", company: "Adobe", role: "Frontend UI Intern", status: "Pending Verification" },
    { id: "STU023", name: "Rohan S.", dept: "Data Science", cgpa: "7.8", company: "NVIDIA", role: "Embedded Intern", status: "Flagged" }
  ]);

  const updateStatus = (id, newStatus) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, status: newStatus } : student
    ));
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSettingsSave = (e) => {
    e.preventDefault();
    alert(`⚙️ Global system parameters successfully updated! (Prashant's config table will store these values tomorrow).`);
  };

  return (
    <div style={styles.container}>
      {/* Admin Sidebar Layout */}
      <aside style={styles.sidebar}>
        <h2 style={styles.brand}>PortalIO <span style={styles.adminBadge}>Faculty</span></h2>
        <nav style={styles.navLinks}>
          <button 
            onClick={() => setActiveTab('roster')} 
            style={{ ...styles.navButton, ...(activeTab === 'roster' ? styles.activeNav : {}) }}
          >
            Master Roster
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            style={{ ...styles.navButton, ...(activeTab === 'settings' ? styles.activeNav : {}) }}
          >
            System Settings
          </button>
        </nav>
        <button onClick={() => navigate('/')} style={styles.logoutButton}>Logout</button>
      </aside>

      {/* Main Administrative Panel */}
      <main style={styles.mainContent}>
        {activeTab === 'roster' ? (
          <>
            <header style={styles.header}>
              <h1 style={styles.mainHeading}>Departmental Verification Hub</h1>
              <p style={{ color: '#aaa', margin: 0 }}>Review student academic compliance logs, evaluate uploaded industrial project certificates, and manage portal parameters.</p>
            </header>

            {/* Real-time Roster Search */}
            <div style={styles.searchContainer}>
              <input 
                type="text" 
                placeholder="🔍 Filter student roster by name, company registration, or unique UID key..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            {/* Master Relational Grid Table */}
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
                    <th style={styles.thAction}>Administrative Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} style={styles.trRow}>
                      <td style={{ ...styles.td, fontFamily: 'monospace', color: '#646cff', fontWeight: 'bold' }}>{student.id}</td>
                      <td style={{ ...styles.td, fontWeight: 'bold' }}>{student.name}</td>
                      <td style={styles.td}>{student.dept}</td>
                      <td style={styles.td}>{student.cgpa}</td>
                      <td style={styles.td}>{student.company} <span style={styles.roleSubtext}>({student.role})</span></td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusTag,
                          backgroundColor: student.status === 'Verified' ? '#14532d' : student.status === 'Flagged' ? '#7f1d1d' : '#3b3f10',
                          color: student.status === 'Verified' ? '#4ade80' : student.status === 'Flagged' ? '#f87171' : '#facc15',
                          border: `1px solid ${student.status === 'Verified' ? '#22c55e' : student.status === 'Flagged' ? '#ef4444' : '#eab308'}`
                        }}>
                          {student.status}
                        </span>
                      </td>
                      <td style={styles.tdAction}>
                        {student.status !== 'Verified' && (
                          <button onClick={() => updateStatus(student.id, 'Verified')} style={styles.approveBtn}>Approve</button>
                        )}
                        {student.status !== 'Flagged' && (
                          <button onClick={() => updateStatus(student.id, 'Flagged')} style={styles.flagBtn}>Flag</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredStudents.length === 0 && (
                <p style={{ color: '#aaa', padding: '30px', textAlign: 'center' }}>No matching student compliance profiles found in this collection view.</p>
              )}
            </div>
          </>
        ) : (
          <>
            <header style={styles.header}>
              <h1 style={styles.mainHeading}>System Parameters & Controls</h1>
              <p style={{ color: '#aaa', margin: 0 }}>Configure automated data pipelines, manage portal entry access windows, and monitor system server instances.</p>
            </header>

            <div style={styles.settingsGrid}>
              {/* Form Controls */}
              <form onSubmit={handleSettingsSave} style={styles.settingsFormCard}>
                <h3 style={{ margin: '0 0 20px 0', color: '#646cff' }}>Global Configurations</h3>
                
                <div style={styles.settingRow}>
                  <div>
                    <label style={styles.settingLabel}>Allow Report Submissions</label>
                    <p style={styles.settingDesc}>Enables or disables the ability for students to upload completion PDFs.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings.allowSubmissions} 
                    onChange={(e) => setSettings({ ...settings, allowSubmissions: e.target.checked })}
                    style={styles.checkbox}
                  />
                </div>

                <div style={styles.settingRow}>
                  <div>
                    <label style={styles.settingLabel}>Allow Active Applications</label>
                    <p style={styles.settingDesc}>Controls whether students can hit 'Apply Now' on corporate job catalogs.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings.allowApplications} 
                    onChange={(e) => setSettings({ ...settings, allowApplications: e.target.checked })}
                    style={styles.checkbox}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.fieldLabel}>Minimum GPA Shortlist Threshold</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={settings.cgpaThreshold} 
                    onChange={(e) => setSettings({ ...settings, cgpaThreshold: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.fieldLabel}>Active Enrollment Track Year</label>
                  <input 
                    type="text" 
                    value={settings.academicYear} 
                    onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <button type="submit" style={styles.saveBtn}>Commit Configurations</button>
              </form>

              {/* Server Metrics Panel */}
              <div style={styles.metricsCard}>
                <h3 style={{ margin: '0 0 20px 0', color: '#4ade80' }}>Infrastructure Overview</h3>
                <div style={styles.metricItem}>
                  <span>Connected SQL System Health:</span>
                  <span style={{ color: '#4ade80', fontWeight: 'bold' }}>● Operational</span>
                </div>
                <div style={styles.metricItem}>
                  <span>Total Registered Compliance Profiles:</span>
                  <strong style={{ color: '#fff' }}>{students.length} students</strong>
                </div>
                <div style={styles.metricItem}>
                  <span>Pending Document Queue:</span>
                  <strong style={{ color: '#facc15' }}>
                    {students.filter(s => s.status === 'Pending Verification').length} files staged
                  </strong>
                </div>
                <div style={styles.metricItem}>
                  <span>Vite Middleware Pipeline:</span>
                  <span style={{ color: '#646cff', fontFamily: 'monospace' }}>HMR Connected</span>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#141414', color: '#ffffff', fontFamily: 'Arial, sans-serif' },
  sidebar: { width: '240px', backgroundColor: '#1f1f1f', padding: '30px 20px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #333', flexShrink: 0 },
  brand: { color: '#646cff', marginBottom: '40px', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px' },
  adminBadge: { fontSize: '12px', backgroundColor: '#eab308', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' },
  navLinks: { display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 },
  navButton: { background: 'none', border: 'none', color: '#aaa', padding: '12px', textAlign: 'left', fontSize: '16px', cursor: 'pointer', borderRadius: '6px', width: '100%' },
  activeNav: { backgroundColor: '#646cff', color: '#fff', fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#333', color: '#f87171', border: '1px solid #444', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  
  mainContent: { flexGrow: 1, padding: '40px 30px', overflowY: 'auto', maxWidth: 'calc(100vw - 240px)', display: 'flex', flexDirection: 'column' },
  header: { marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  mainHeading: { fontSize: '2rem', margin: 0, fontWeight: 'bold', lineHeight: '1.25', color: '#ffffff' },
  
  searchContainer: { marginBottom: '30px', width: '100%' },
  searchInput: { width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#1f1f1f', color: '#fff', fontSize: '16px', boxSizing: 'border-box' },
  
  tableCard: { backgroundColor: '#1f1f1f', border: '1px solid #2d2d2d', borderRadius: '12px', overflowX: 'auto', width: '100%', boxSizing: 'border-box' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' },
  thRow: { backgroundColor: '#141414', borderBottom: '2px solid #2d2d2d' },
  th: { padding: '16px 20px', color: '#aaa', fontWeight: 'bold', fontSize: '14px' },
  thAction: { padding: '16px 20px', color: '#aaa', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' },
  trRow: { borderBottom: '1px solid #2d2d2d', transition: 'background-color 0.2s' },
  td: { padding: '18px 20px', fontSize: '15px', color: '#e5e7eb' },
  roleSubtext: { color: '#aaa', fontSize: '13px' },
  statusTag: { padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' },
  tdAction: { padding: '18px 20px', display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' },
  approveBtn: { backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' },
  flagBtn: { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' },

  // New Settings System Layout Components
  settingsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginTop: '10px' },
  settingsFormCard: { backgroundColor: '#1f1f1f', border: '1px solid #2d2d2d', borderRadius: '12px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' },
  settingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2d2d2d', paddingBottom: '15px' },
  settingLabel: { fontSize: '16px', fontWeight: 'bold', color: '#fff' },
  settingDesc: { fontSize: '13px', color: '#aaa', margin: '4px 0 0 0', maxWidth: '280px', lineHeight: '1.4' },
  checkbox: { width: '20px', height: '20px', cursor: 'pointer', accentColor: '#646cff' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  fieldLabel: { fontSize: '14px', color: '#ccc', fontWeight: 'bold' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#141414', color: '#fff', fontSize: '15px' },
  saveBtn: { backgroundColor: '#646cff', color: 'white', border: 'none', padding: '14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginTop: '10px' },
  metricsCard: { backgroundColor: '#1f1f1f', border: '1px solid #2d2d2d', borderRadius: '12px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' },
  metricItem: { display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#ccc', borderBottom: '1px solid #2d2d2d', paddingBottom: '15px' }
};

export default AdminDashboard;