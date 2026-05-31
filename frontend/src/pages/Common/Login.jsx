import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  
  // State variables for form inputs
  const [role, setRole] = useState('student');
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [dept, setDept] = useState('Computer Science');
  const [cgpa, setCgpa] = useState('');

  // Form submission handling with persistent local storage caching
  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    if (role === 'student') {
      const studentPayload = {
        studentName: isRegistering ? name : "Anagha Sriva", 
        studentDept: isRegistering ? `${dept} Department` : "Computer Science (cy)", 
        studentCgpa: isRegistering ? cgpa : "9.6"
      };

      // PERSISTENCE HOOK: Cache inside the browser memory before transitioning
      localStorage.setItem('activeStudent', JSON.stringify(studentPayload));

      // ROUTE MATCH FIXED: Changed from '/student-dashboard' to '/student' to match App.jsx perfectly!
      navigate('/student', { state: studentPayload });
    } else if (role === 'faculty') {
      navigate('/admin');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <h2 style={styles.title}>PortalIO Auth Gate</h2>
        <p style={styles.subtitle}>Institutional Placement & Internship Network</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Segmented Control Role Selector */}
          <div style={styles.segmentedControl}>
            <button
              type="button"
              onClick={() => setRole('student')}
              style={{ ...styles.segmentButton, ...(role === 'student' ? styles.activeSegment : {}) }}
            >
              Student Track
            </button>
            <button
              type="button"
              onClick={() => setRole('faculty')}
              style={{ ...styles.segmentButton, ...(role === 'faculty' ? styles.activeSegment : {}) }}
            >
              Faculty Core
            </button>
          </div>

          {/* Toggle Between Login and Registration */}
          {role === 'student' && (
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                style={{ ...styles.toggleModeBtn, ...(isRegistering === false ? styles.activeMode : {}) }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                style={{ ...styles.toggleModeBtn, ...(isRegistering === true ? styles.activeMode : {}) }}
              >
                Register Account
              </button>
            </div>
          )}

          {/* Dynamic input rendering fields */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>College Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="name@university.edu" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input} 
            />
          </div>

          {role === 'student' && isRegistering && (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Legal Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Enter full name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input} 
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Academic Specialization</label>
                <select 
                  value={dept} 
                  onChange={(e) => setDept(e.target.value)}
                  style={styles.selectInput}
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Science">Information Science</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Current Cumulative CGPA</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="10" 
                  required 
                  placeholder="e.g. 9.15" 
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  style={styles.input} 
                />
              </div>
            </>
          )}

          <button type="submit" style={styles.submitBtn}>
            {role === 'faculty' ? 'Access Console' : isRegistering ? 'Register System Identity' : 'Authenticate Session'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#141414', fontFamily: 'Arial, sans-serif', padding: '20px' },
  loginCard: { backgroundColor: '#1f1f1f', border: '1px solid #333', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' },
  title: { color: '#646cff', textAlign: 'center', margin: '0 0 8px 0', fontSize: '26px', fontWeight: 'bold' },
  subtitle: { color: '#aaa', textAlign: 'center', margin: '0 0 30px 0', fontSize: '13px' },
  form: { display: 'flex', flexDirection: 'column' },
  segmentedControl: { display: 'flex', backgroundColor: '#141414', borderRadius: '8px', padding: '4px', marginBottom: '20px', border: '1px solid #2d2d2d' },
  segmentButton: { flex: 1, padding: '10px', border: 'none', background: 'none', color: '#aaa', cursor: 'pointer', fontSize: '14px', borderRadius: '6px', fontWeight: 'bold', transition: 'all 0.2s' },
  activeSegment: { backgroundColor: '#646cff', color: '#fff' },
  toggleModeBtn: { flex: 1, padding: '6px', border: 'none', background: 'none', color: '#777', cursor: 'pointer', fontSize: '12px', borderBottom: '2px solid #333' },
  activeMode: { color: '#646cff', borderBottom: '2px solid #646cff', fontWeight: 'bold' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' },
  label: { color: '#ccc', fontSize: '13px', fontWeight: 'bold' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#141414', color: '#fff', fontSize: '14px' },
  selectInput: { padding: '12px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#141414', color: '#fff', fontSize: '14px', cursor: 'pointer' },
  submitBtn: { marginTop: '10px', padding: '14px', borderRadius: '6px', border: 'none', backgroundColor: '#646cff', color: '#fff', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: 'background-color 0.2s' }
};

export default Login;