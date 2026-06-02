import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function ReviewReports() {
  const navigate = useNavigate();

  const [uploadedReports, setUploadedReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .listReports()
      .then((res) => setUploadedReports(res.data || []))
      .catch((err) => alert("Failed to load reports: " + err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (reportId, fileName) => {
    try {
      const resp = await api.downloadReport(reportId);
      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || `report_${reportId}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed: " + err.message);
    }
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
            Dashboard
          </button>
          <button onClick={() => navigate("/verify-applications")} style={styles.navButton}>
            Verify Applications
          </button>
          <button style={{ ...styles.navButton, ...styles.activeNav }}>
            Review Reports
          </button>
          <button onClick={() => navigate("/manage-internships")} style={styles.navButton}>
            Manage Internships
          </button>
          <button onClick={() => navigate("/students-directory")} style={styles.navButton}>
            Students Directory
          </button>
          <button onClick={() => navigate("/companies-directory")} style={styles.navButton}>
            Companies Directory
          </button>
        </nav>
        <button onClick={() => navigate("/")} style={styles.logoutButton}>
          Logout
        </button>
      </aside>

      {/* Main Content Layout */}
      <main style={styles.mainContent}>
        {/* FIXED SPACING HEADER BLOCK */}
        <header style={styles.header}>
          <h1 style={styles.mainHeading}>Review Project Reports</h1>
          <p style={styles.subtitle}>
            Download and audit student technical internship documentations
          </p>
        </header>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Submitted By</th>
                <th style={styles.th}>Project Focus Area</th>
                <th style={styles.th}>Upload Date</th>
                <th style={styles.th}>Document Link</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: 20, color: "#aaa" }}>
                    Loading reports...
                  </td>
                </tr>
              ) : uploadedReports.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 20, color: "#aaa" }}>
                    No reports found.
                  </td>
                </tr>
              ) : (
                uploadedReports.map((report) => (
                  <tr
                    key={report.Report_ID || report.ReportId || Math.random()}
                    style={styles.trRow}
                  >
                    <td style={{ ...styles.td, fontWeight: "bold" }}>
                      {report.Student_ID ||
                        report.student ||
                        report.studentName}
                    </td>
                    <td style={styles.td}>
                      {report.Topic || report.topic || report.File_Path}
                    </td>
                    <td style={styles.td}>
                      {report.Submission_Date || report.date || "—"}
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        color: "#646cff",
                        fontFamily: "monospace",
                      }}
                    >
                      {report.File_Path || report.fileName || "file"}
                    </td>
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <button
                        onClick={() =>
                          handleDownload(
                            report.Report_ID || report.ReportId,
                            (report.File_Path || report.fileName || "")
                              .split("/")
                              .pop(),
                          )
                        }
                        style={styles.downloadBtn}
                      >
                        📥 Download File
                      </button>
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
    marginTop: "auto",
  },
  mainContent: { flexGrow: 1, padding: "40px 30px", overflowY: "auto" },

  // FIXED SPACING CONTAINER FOR BALANCED LAYOUTS
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
  downloadBtn: {
    backgroundColor: "#1f1f1f",
    color: "#646cff",
    border: "1px solid #646cff",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "13px",
    transition: "all 0.2s",
  },
};

export default ReviewReports;
