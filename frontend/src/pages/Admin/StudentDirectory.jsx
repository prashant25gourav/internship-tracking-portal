import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function StudentDirectory() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .getStudents()
      .then((res) => {
        setStudents(res.data || []);
      })
      .catch((err) => alert("Failed to load students: " + err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={styles.container}>
      {/* Admin Sidebar Navigation */}
      <aside style={styles.sidebar}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "40px" }}>
          <h2 style={styles.brand}>PortalIO</h2>
          <span style={styles.facultyBadge}>Faculty</span>
        </div>
        <nav style={styles.navLinks}>
          <button onClick={() => navigate("/admin")} style={styles.navButton}>Dashboard</button>
          <button onClick={() => navigate("/verify-applications")} style={styles.navButton}>Verify Applications</button>
          <button onClick={() => navigate("/review-reports")} style={styles.navButton}>Review Reports</button>
          <button onClick={() => navigate("/manage-internships")} style={styles.navButton}>Manage Internships</button>
          <button style={{ ...styles.navButton, ...styles.activeNav }}>Students Directory</button>
          <button onClick={() => navigate("/companies-directory")} style={styles.navButton}>Companies Directory</button>
        </nav>
        <button onClick={() => navigate("/")} style={styles.logoutButton}>Logout</button>
      </aside>

      {/* Main Panel Content */}
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.mainHeading}>Student Directory</h1>
          <p style={styles.subtitle}>View all registered students, their skills, and CGPA.</p>
        </header>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Department</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Skills</th>
                <th style={styles.th}>CGPA</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: 20, color: "#aaa" }}>Loading students...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 20, color: "#aaa" }}>No students found.</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.Student_ID} style={styles.trRow}>
                    <td style={{ ...styles.td, fontWeight: "bold" }}>{student.Name}</td>
                    <td style={styles.td}>{student.Dept}</td>
                    <td style={styles.td}>{student.Email}</td>
                    <td style={styles.td}>{student.Skills}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: student.CGPA >= 8.5 ? "#14532d" : student.CGPA >= 7.0 ? "#3b3f10" : "#7f1d1d",
                        color: student.CGPA >= 8.5 ? "#4ade80" : student.CGPA >= 7.0 ? "#facc15" : "#f87171"
                      }}>
                        {student.CGPA}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "#141414", color: "#ffffff", fontFamily: "Arial, sans-serif" },
  sidebar: { width: "240px", backgroundColor: "#1f1f1f", padding: "30px 20px", display: "flex", flexDirection: "column", borderRight: "1px solid #333", flexShrink: 0 },
  brand: { color: "#646cff", margin: 0, fontSize: "24px" },
  facultyBadge: { backgroundColor: "#facc15", color: "#141414", padding: "2px 6px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" },
  navLinks: { display: "flex", flexDirection: "column", gap: "10px", flexGrow: 1 },
  navButton: { backgroundColor: "transparent", border: "none", color: "#aaa", padding: "12px", textAlign: "left", fontSize: "16px", cursor: "pointer", borderRadius: "6px", width: "100%" },
  activeNav: { backgroundColor: "#646cff", color: "#fff", fontWeight: "bold" },
  logoutButton: { backgroundColor: "#333", color: "#f87171", border: "1px solid #444", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginTop: "auto" },
  mainContent: { flexGrow: 1, padding: "40px 30px", overflowY: "auto" },
  header: { marginBottom: "35px", borderBottom: "1px solid #333", paddingBottom: "24px", display: "flex", flexDirection: "column", gap: "12px" },
  mainHeading: { fontSize: "2.5rem", margin: 0, fontWeight: "bold", lineHeight: "1.2" },
  subtitle: { color: "#aaa", margin: 0, fontSize: "16px", lineHeight: "1.4" },
  tableCard: { backgroundColor: "#1f1f1f", border: "1px solid #2d2d2d", borderRadius: "12px", padding: "25px" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  thRow: { borderBottom: "2px solid #2d2d2d" },
  th: { padding: "12px", color: "#aaa", fontSize: "14px", fontWeight: "bold" },
  trRow: { borderBottom: "1px solid #2d2d2d" },
  td: { padding: "16px 12px", fontSize: "15px" },
  badge: { padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" },
};

export default StudentDirectory;
