import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      const summaryRes = await api.get("/analytics/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Extract server data from API wrapper: { success, data, message }
      const summaryData = summaryRes?.data?.data ?? summaryRes?.data ?? null;
      setSummary(summaryData);

      try {
        const activityRes = await api.get("/analytics/recent-activities", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { limit: 10 },
        });

        // Server returns { success, data: { activities: [...] } }
        const activities = activityRes?.data?.data?.activities ?? activityRes?.data?.activities ?? activityRes?.data ?? [];

        const formatted = (activities || []).map((item, index) => ({
          id: index,
          time: item.timestamp || item.time || "Now",
          user: item.user || item.student_id || "System",
          action: item.description || item.action || "performed action",
          target: item.module || item.target || "portal",
          badgeColor: "#646cff",
        }));

        setRecentActivities(formatted);
      } catch (err) {
        console.log("Recent activity endpoint unavailable");
      }
    } catch (err) {
      console.error(err);
      alert("Failed loading admin analytics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
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
          <button style={{ ...styles.navButton, ...styles.activeNav }}>
            Dashboard
          </button>

          <button
            onClick={() => navigate("/verify-applications")}
            style={styles.navButton}
          >
            Verify Applications
          </button>

          <button
            onClick={() => navigate("/review-reports")}
            style={styles.navButton}
          >
            Review Reports
          </button>
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            navigate("/");
          }}
          style={styles.logoutButton}
        >
          Logout
        </button>
      </aside>

      <main style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.mainHeading}>Departmental Verification Hub</h1>

          <p style={styles.subtitle}>
            Review student internship activity, verify applications, and monitor
            analytics.
          </p>
        </header>

        <section style={styles.logCard}>
          <div style={styles.logHeader}>
            <h3 style={styles.logTitle}>📊 Live MongoDB Activity Log Book</h3>

            <span style={styles.liveIndicator}>
              <span style={styles.pulseDot}></span>
              Live Tracking Active
            </span>
          </div>

          <div style={styles.logStream}>
            {recentActivities.length > 0 ? (
              recentActivities.map((log) => (
                <div key={log.id} style={styles.logItem}>
                  <span style={styles.logTime}>{log.time}</span>

                  <span
                    style={{
                      ...styles.logTypeBadge,
                      backgroundColor: log.badgeColor,
                    }}
                  ></span>

                  <div style={styles.logTextContainer}>
                    <strong style={styles.logUser}>{log.user}</strong>{" "}
                    <span style={styles.logAction}>{log.action}</span>{" "}
                    <code style={styles.logTarget}>[{log.target}]</code>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#aaa" }}>No recent activities.</p>
            )}
          </div>
        </section>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Metric</th>
                <th style={styles.th}>Value</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={2} style={styles.td}>
                    Loading analytics...
                  </td>
                </tr>
              ) : summary ? (
                <>
                  <tr style={styles.trRow}>
                    <td style={styles.td}>Total Students</td>
                    <td style={styles.td}>{summary.total_students || 0}</td>
                  </tr>

                  <tr style={styles.trRow}>
                    <td style={styles.td}>Total Companies</td>
                    <td style={styles.td}>{summary.total_companies || 0}</td>
                  </tr>

                  <tr style={styles.trRow}>
                    <td style={styles.td}>Total Internships</td>
                    <td style={styles.td}>{summary.total_internships || 0}</td>
                  </tr>

                  <tr style={styles.trRow}>
                    <td style={styles.td}>Applications</td>
                    <td style={styles.td}>{summary.total_applications || 0}</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan={2} style={styles.td}>
                    No analytics available.
                  </td>
                </tr>
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

  brand: {
    color: "#646cff",
    margin: 0,
    fontSize: "24px",
  },

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

  activeNav: {
    backgroundColor: "#646cff",
    color: "#fff",
    fontWeight: "bold",
  },

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

  mainContent: {
    flexGrow: 1,
    padding: "40px 30px",
    overflowY: "auto",
  },

  header: {
    marginBottom: "35px",
    textAlign: "center",
  },

  mainHeading: {
    fontSize: "2.5rem",
    marginBottom: "15px",
  },

  subtitle: {
    color: "#aaa",
    fontSize: "16px",
  },

  tableCard: {
    backgroundColor: "#1f1f1f",
    border: "1px solid #2d2d2d",
    borderRadius: "12px",
    padding: "25px",
    marginTop: "25px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  thRow: {
    borderBottom: "2px solid #2d2d2d",
  },

  th: {
    padding: "12px",
    color: "#aaa",
    textAlign: "left",
  },

  trRow: {
    borderBottom: "1px solid #2d2d2d",
  },

  td: {
    padding: "16px 12px",
  },

  logCard: {
    backgroundColor: "#1f1f1f",
    border: "1px solid #2d2d2d",
    borderRadius: "12px",
    padding: "25px",
    marginBottom: "25px",
  },

  logHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  logTitle: {
    margin: 0,
  },

  liveIndicator: {
    color: "#4ade80",
    fontSize: "14px",
  },

  pulseDot: {
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#4ade80",
    marginRight: "6px",
  },

  logStream: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  logItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    backgroundColor: "#181818",
    borderRadius: "8px",
  },

  logTime: {
    color: "#888",
    fontSize: "12px",
  },

  logTypeBadge: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },

  logTextContainer: {
    fontSize: "14px",
  },

  logUser: {
    color: "#fff",
  },

  logAction: {
    color: "#ccc",
  },

  logTarget: {
    color: "#646cff",
  },
};

export default AdminDashboard;
