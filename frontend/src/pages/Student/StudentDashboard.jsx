import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api";

function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // ROUTING & CACHE INTEGRATION COMPONENT
  const getStudentData = () => {
    // 1. Try reading the high-speed route parameter state first
    if (location.state) {
      return location.state;
    }
    // 2. Look up memory variables if navigating back from inner child loops
    const savedData = localStorage.getItem("activeStudent");
    if (savedData) {
      return JSON.parse(savedData);
    }
    // 3. Absolute structural safe fallback parameters
    return {
      studentName: "Anagha Sriva",
      studentDept: "Computer Science (cy)",
      studentCgpa: "9.6",
    };
  };

  const studentData = getStudentData();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let sid = null;
    if (studentData && (studentData.Student_ID || studentData.studentId))
      sid = studentData.Student_ID || studentData.studentId;
    if (!sid) {
      const stored = JSON.parse(localStorage.getItem("student") || "{}");
      if (stored && stored.Student_ID) sid = stored.Student_ID;
    }
    if (!sid) return;
    setLoading(true);
    api
      .getStudentApplications(sid)
      .then((res) => {
        setApplications(res.data || []);
      })
      .catch((err) => {
        console.error("Failed loading apps", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.container}>
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar}>
        <h2 style={styles.brand}>PortalIO</h2>
        <nav style={styles.navLinks}>
          <button style={{ ...styles.navButton, ...styles.activeNav }}>
            Dashboard
          </button>
          <button
            onClick={() => navigate("/browse-jobs")}
            style={styles.navButton}
          >
            Browse Internships
          </button>
          <button
            onClick={() => navigate("/upload-report")}
            style={styles.navButton}
          >
            Upload Report
          </button>
        </nav>
        <button onClick={() => navigate("/")} style={styles.logoutButton}>
          Logout
        </button>
      </aside>

      {/* Main Stats Panel */}
      <main style={styles.mainContent}>
        {/* FIXED BOX MODEL: Balanced padding and flex heights prevents crowding */}
        <header style={styles.header}>
          <h1 style={styles.mainHeading}>
            Welcome back, {studentData.studentName}!
          </h1>
          <p style={styles.subtitle}>
            {studentData.studentDept} | CGPA: {studentData.studentCgpa}
          </p>
        </header>

        {/* Quick Info Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Total Applied</span>
            <strong style={{ ...styles.statNumber, color: "#646cff" }}>
              {applications.length}
            </strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Under Review</span>
            <strong style={{ ...styles.statNumber, color: "#facc15" }}>
              {
                applications.filter(
                  (a) =>
                    a.Status === "Applied" ||
                    a.Status === "Under Review" ||
                    a.Status === "Pending",
                ).length
              }
            </strong>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Offers Secured</span>
            <strong style={{ ...styles.statNumber, color: "#4ade80" }}>
              {
                applications.filter(
                  (a) =>
                    a.Status === "Selected" ||
                    a.Status === "Accepted" ||
                    a.Status === "Approved",
                ).length
              }
            </strong>
          </div>
        </div>

        {/* Dynamic Status Tracking Table */}
        <div style={styles.tableCard}>
          <h3
            style={{ margin: "0 0 20px 0", textAlign: "center", color: "#fff" }}
          >
            Your Applications
          </h3>
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
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: 20, color: "#aaa" }}>
                    Loading applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: 20, color: "#aaa" }}>
                    No applications found.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr
                    key={app.App_ID || app.app_id || Math.random()}
                    style={styles.trRow}
                  >
                    <td style={{ ...styles.td, fontWeight: "bold" }}>
                      {app.Company_Name || app.Company || app.company || "—"}
                    </td>
                    <td style={styles.td}>
                      {app.Role || app.Internship_Role || app.role || "—"}
                    </td>
                    <td style={styles.td}>
                      {app.Apply_Date || app.ApplyDate || "—"}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          backgroundColor:
                            app.Status === "Selected" ||
                            app.Status === "Accepted"
                              ? "#14532d"
                              : app.Status === "Rejected"
                                ? "#7f1d1d"
                                : "#3b3f10",
                          color:
                            app.Status === "Selected" ||
                            app.Status === "Accepted"
                              ? "#4ade80"
                              : app.Status === "Rejected"
                                ? "#f87171"
                                : "#facc15",
                        }}
                      >
                        {app.Status ||
                          app.Application_Status ||
                          app.status ||
                          "Pending"}
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
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#141414",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: "240px",
    backgroundColor: "#1f1f1f",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #333",
    flexShrink: 0,
  },
  brand: { color: "#646cff", marginBottom: "40px", fontSize: "24px" },
  navLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flexGrow: 1,
  },
  navButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#aaa",
    padding: "12px",
    textAlign: "left",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "6px",
    width: "100%",
  },
  activeNav: { backgroundColor: "#646cff", color: "#fff", fontWeight: "bold" },
  logoutButton: {
    backgroundColor: "#333",
    color: "#f87171",
    border: "1px solid #444",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  mainContent: {
    flexGrow: 1,
    padding: "40px 30px",
    overflowY: "auto",
    maxWidth: "calc(100vw - 240px)",
  },

  // ADJUSTED MARGIN MATRIX: Eliminates overcrowding issues
  header: {
    marginBottom: "35px",
    borderBottom: "1px solid #333",
    paddingBottom: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  mainHeading: {
    fontSize: "2.8rem",
    margin: 0,
    fontWeight: "bold",
    letterSpacing: "-0.5px",
    lineHeight: "1.2",
  },
  subtitle: {
    color: "#aaa",
    margin: 0,
    fontSize: "16px",
    letterSpacing: "0.5px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  statCard: {
    backgroundColor: "#1f1f1f",
    border: "1px solid #2d2d2d",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  statLabel: { fontSize: "15px", color: "#aaa", fontWeight: "bold" },
  statNumber: { fontSize: "2rem", fontWeight: "bold" },

  tableCard: {
    backgroundColor: "#1f1f1f",
    border: "1px solid #2d2d2d",
    borderRadius: "12px",
    padding: "25px",
  },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  thRow: { borderBottom: "2px solid #2d2d2d" },
  th: { padding: "12px", color: "#aaa", fontSize: "14px", fontWeight: "bold" },
  trRow: { borderBottom: "1px solid #2d2d2d" },
  td: { padding: "16px 12px", fontSize: "15px" },
  badge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
  },
};

export default StudentDashboard;
