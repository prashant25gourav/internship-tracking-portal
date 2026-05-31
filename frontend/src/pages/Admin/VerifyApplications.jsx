import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function VerifyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .getApplications()
      .then((res) => {
        setApplications(res.data || []);
      })
      .catch((err) => {
        alert("Failed to load applications: " + err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusUpdate = (appId, newStatus) => {
    const token = localStorage.getItem("adminToken");
    api
      .updateApplicationStatus({ app_id: appId, status: newStatus }, token)
      .then(() => {
        alert("Status updated");
        load();
      })
      .catch((err) => alert("Update failed: " + err.message));
  };

  return (
    <div style={styles.container}>
      {/* Admin Sidebar Navigation */}
      <aside style={styles.sidebar}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "40px",
          }}
        >
          <h2 style={styles.brand}>PortalIO</h2>
          <span style={styles.facultyBadge}>Faculty</span>
        </div>
        <nav style={styles.navLinks}>
          <button onClick={() => navigate("/admin")} style={styles.navButton}>
            Master Roster
          </button>
          <button style={{ ...styles.navButton, ...styles.activeNav }}>
            Verify Applications
          </button>
          <button
            onClick={() => navigate("/review-reports")}
            style={styles.navButton}
          >
            Review Reports
          </button>
        </nav>
        <button onClick={() => navigate("/")} style={styles.logoutButton}>
          Logout
        </button>
      </aside>

      {/* Main Panel Content */}
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.mainHeading}>Verify Student Applications</h1>
          <p style={styles.subtitle}>
            Review and update structural corporate placement requests
          </p>
        </header>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Student</th>
                <th style={styles.th}>Department</th>
                <th style={styles.th}>Company</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Current Status</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: 20, color: "#aaa" }}>
                    Loading applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 20, color: "#aaa" }}>
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
                      {app.Student_Name || app.Student || app.name}
                    </td>
                    <td style={styles.td}>
                      {app.Dept || app.dept || app.Student_Dept}
                    </td>
                    <td style={styles.td}>{app.Company_Name || app.company}</td>
                    <td style={styles.td}>
                      {app.Internship_Role || app.Role || app.role}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          backgroundColor:
                            app.Status === "Selected"
                              ? "#14532d"
                              : app.Status === "Rejected"
                                ? "#7f1d1d"
                                : "#3b3f10",
                          color:
                            app.Status === "Selected"
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
                    <td style={styles.actionTd}>
                      {app.Status === "Pending" ||
                      app.Status === "Applied" ||
                      app.Application_Status === "Pending" ? (
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                app.App_ID || app.app_id,
                                "Selected",
                              )
                            }
                            style={styles.approveBtn}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                app.App_ID || app.app_id,
                                "Rejected",
                              )
                            }
                            style={styles.rejectBtn}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span
                          style={{
                            color: "#666",
                            fontSize: "13px",
                            display: "block",
                            textAlign: "center",
                          }}
                        >
                          Action Finalized
                        </span>
                      )}
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
  brand: { color: "#646cff", margin: 0, fontSize: "24px" },
  facultyBadge: {
    backgroundColor: "#facc15",
    color: "#141414",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  navLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flexGrow: 1,
  },
  navButton: {
    background: "none",
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
    marginTop: "auto",
  },
  mainContent: { flexGrow: 1, padding: "40px 30px", overflowY: "auto" },

  // FIXED SPACING CONTAINER
  header: {
    marginBottom: "35px",
    borderBottom: "1px solid #333",
    paddingBottom: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  mainHeading: {
    fontSize: "2.5rem",
    margin: 0,
    fontWeight: "bold",
    lineHeight: "1.2",
  },
  subtitle: { color: "#aaa", margin: 0, fontSize: "16px", lineHeight: "1.4" },

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
  actionTd: { padding: "16px 12px" },
  badge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  approveBtn: {
    backgroundColor: "#14532d",
    color: "#4ade80",
    border: "1px solid #22c55e",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "13px",
  },
  rejectBtn: {
    backgroundColor: "#7f1d1d",
    color: "#f87171",
    border: "1px solid #ef4444",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "13px",
  },
};

export default VerifyApplications;
