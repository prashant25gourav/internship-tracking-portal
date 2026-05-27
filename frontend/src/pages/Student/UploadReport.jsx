import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UploadReport() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', company: 'Google', description: '' });
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !file) {
      alert("Please fill out all fields and select a PDF report file.");
      return;
    }
    alert(`🎉 Report "${formData.title}" and file [${file.name}] successfully staged for upload! (Prashant's API will save this to the SQL database tomorrow).`);
    setFormData({ title: '', company: 'Google', description: '' });
    setFile(null);
  };

  return (
    <div style={styles.container}>
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar}>
        <h2 style={styles.brand}>PortalIO</h2>
        <nav style={styles.navLinks}>
          <button onClick={() => navigate('/student')} style={styles.navButton}>Dashboard</button>
          <button onClick={() => navigate('/browse-jobs')} style={styles.navButton}>Browse Internships</button>
          <button style={{ ...styles.navButton, ...styles.activeNav }}>Upload Report</button>
        </nav>
        <button onClick={() => navigate('/')} style={styles.logoutButton}>Logout</button>
      </aside>

      {/* Main Content */}
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.mainHeading}>Submit Internship Completion Report</h1>
          <p style={{ color: '#aaa', margin: 0 }}>
            Upload your final industry evaluation certificates and project documentation for departmental review.
          </p>
        </header>

        <div style={styles.formCard}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Project / Internship Title</label>
              <input 
                type="text" 
                placeholder="e.g., Cloud Infrastructure Optimization System"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Associated Company</label>
              <select 
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                style={styles.select}
              >
                <option value="Google">Google</option>
                <option value="Stripe">Stripe</option>
                <option value="Microsoft">Microsoft</option>
                <option value="NVIDIA">NVIDIA</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Brief Work Description & Core Accomplishments</label>
              <textarea 
                rows="5"
                placeholder="Summarize your key responsibilities, tech stacks utilized, and major project deliverables..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={styles.textarea}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Attach Final Evaluation Certificate (PDF format)</label>
              <div style={styles.fileUploadBox}>
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={styles.hiddenFileInput}
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" style={styles.fileLabel}>
                  {file ? `📄 ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)` : "📁 Click to select or drop your completion PDF here"}
                </label>
              </div>
            </div>

            <button type="submit" style={styles.submitButton}>Submit Report for Verification</button>
          </form>
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
  navButton: { background: 'none', border: 'none', color: '#aaa', padding: '12px', textAlign: 'left', fontSize: '16px', cursor: 'pointer', borderRadius: '6px' },
  activeNav: { backgroundColor: '#646cff', color: '#fff', fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#333', color: '#f87171', border: '1px solid #444', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  
  // Cleaned layout dimensions
  mainContent: { flexGrow: 1, padding: '40px 30px', overflowY: 'auto', maxWidth: 'calc(100vw - 240px)' },
  header: { marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  mainHeading: { fontSize: '2rem', margin: 0, fontWeight: 'bold', lineHeight: '1.25', color: '#ffffff' },
  
  formCard: { backgroundColor: '#1f1f1f', border: '1px solid #2d2d2d', borderRadius: '12px', padding: '35px', maxWidth: '700px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', color: '#ccc', fontWeight: 'bold' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#141414', color: '#fff', fontSize: '15px' },
  select: { padding: '12px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#141414', color: '#fff', fontSize: '15px' },
  textarea: { padding: '12px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#141414', color: '#fff', fontSize: '15px', resize: 'vertical' },
  fileUploadBox: { border: '2px dashed #444', padding: '25px', borderRadius: '8px', backgroundColor: '#141414', textAlign: 'center', cursor: 'pointer' },
  hiddenFileInput: { display: 'none' },
  fileLabel: { cursor: 'pointer', color: '#646cff', fontWeight: 'bold', display: 'block', width: '100%' },
  submitButton: { backgroundColor: '#646cff', color: 'white', border: 'none', padding: '15px', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }
};

export default UploadReport;