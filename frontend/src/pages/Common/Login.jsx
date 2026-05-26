import React, { useState } from 'react';

function Login() {
  // 1. State variables to keep track of user selections and inputs
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState('student'); // Default role is student
  
  // Form fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [dept, setDept] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState('');
  const [cgpa, setCgpa] = useState('');

  // 2. Function to handle when the user clicks "Submit"
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the page from refreshing automatically
    
    if (isRegistering) {
      console.log("Registering a new user:", { role, name, email, dept, phone, skills, cgpa });
      alert(`Registration submitted for ${name}! (Check console log)`);
    } else {
      console.log("Logging in user:", { email, role });
      alert(`Logging in with email: ${email} as ${role}!`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Internship Tracking Portal</h2>
        <p style={styles.subtitle}>
          {isRegistering ? 'Create your new account' : 'Sign in to your dashboard'}
        </p>

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={styles.form}>
          
          {/* Role Selection Dropdown */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>I am a:</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              style={styles.select}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty / Admin</option>
            </select>
          </div>

          {/* Registration Fields (Only show up if isRegistering is true) */}
          {isRegistering && (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  style={styles.input} 
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Department</label>
                <input 
                  type="text" 
                  placeholder="e.g. Computer Science" 
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  required 
                  style={styles.input} 
                />
              </div>

              {role === 'student' && (
                <>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="Enter phone number" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={styles.input} 
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Skills</label>
                    <input 
                      type="text" 
                      placeholder="e.g. React, Python, SQL" 
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      style={styles.input} 
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>CGPA</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="e.g. 8.5" 
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      style={styles.input} 
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* Email Field (Always visible for both login and registration) */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your college email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              style={styles.input} 
            />
          </div>

          {/* Submit Button */}
          <button type="submit" style={styles.button}>
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        {/* Toggle between Login and Register modes */}
        <p style={styles.toggleText}>
          {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
          <span 
            style={styles.link} 
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Login here' : 'Register here'}
          </span>
        </p>

      </div>
    </div>
  );
}

// Simple embedded JavaScript styles to avoid needing external CSS files right now
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: '#2a2a2a',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    margin: '0 0 10px 0',
    color: '#646cff',
  },
  subtitle: {
    margin: '0 0 25px 0',
    color: '#aaa',
  },
  form: {
    textAlign: 'left',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    color: '#ccc',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: '#333',
    color: '#fff',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: '#333',
    color: '#fff',
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#646cff',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  toggleText: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#aaa',
  },
  link: {
    color: '#646cff',
    cursor: 'pointer',
    textDecoration: 'underline',
  }
};

export default Login;