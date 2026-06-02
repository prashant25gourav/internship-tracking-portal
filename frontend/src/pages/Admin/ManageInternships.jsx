import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function ManageInternships() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [role, setRole] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [duration, setDuration] = useState("");
  const [stipend, setStipend] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const internshipsRes = await api.getInternships();
      const companiesRes = await api.getCompanies();
      setInternships(internshipsRes.data || []);
      setCompanies(companiesRes.data || []);
    } catch (err) {
      alert("Error loading data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    api
      .addInternship({ company_id: companyId, role, duration, stipend }, token)
      .then(() => {
        alert("Internship added!");
        setRole("");
        setCompanyId("");
        setDuration("");
        setStipend("");
        load();
      })
      .catch((err) => alert("Failed to add: " + err.message));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this internship?")) return;
    const token = localStorage.getItem("adminToken");
    api
      .deleteInternship(id, token)
      .then(() => {
        alert("Deleted successfully");
        load();
      })
      .catch((err) => alert("Failed to delete: " + err.message));
  };

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
          <button style={{ ...styles.navButton, ...styles.activeNav }}>Manage Internships</button>
          <button onClick={() => navigate("/students-directory")} style={styles.navButton}>Students Directory</button>
          <button onClick={() => navigate("/companies-directory")} style={styles.navButton}>Companies Directory</button>
        </nav>
        <button onClick={() => navigate("/")} style={styles.logoutButton}>Logout</button>
      </aside>

      {/* Main Panel Content */}
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.mainHeading}>Manage Internships</h1>
          <p style={styles.subtitle}>Add new internship opportunities or remove existing ones.</p>
        </header>

        <div style={styles.formCard}>
          <h3 style={{ margin: "0 0 15px 0", color: "#fff" }}>Post New Internship</h3>
          <form onSubmit={handleAdd} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
              style={styles.input}
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c.Company_ID} value={c.Company_ID}>
                  {c.Company_Name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Role (e.g. Software Engineer)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Duration (e.g. 6 Months)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Stipend (e.g. 40000)"
              value={stipend}
              onChange={(e) => setStipend(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.approveBtn}>Post Internship</button>
          </form>
        </div>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Company</th>
                <th style={styles.th}>Duration</th>
                <th style={styles.th}>Stipend</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: 20, color: "#aaa" }}>Loading internships...</td>
                </tr>
              ) : internships.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 20, color: "#aaa" }}>No internships found.</td>
                </tr>
              ) : (
                internships.map((job) => (
                  <tr key={job.Internship_ID} style={styles.trRow}>
                    <td style={{ ...styles.td, fontWeight: "bold" }}>{job.Role}</td>
                    <td style={styles.td}>{job.Company_Name}</td>
                    <td style={styles.td}>{job.Duration}</td>
                    <td style={styles.td}>₹{job.Stipend}</td>
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <button onClick={() => handleDelete(job.Internship_ID)} style={styles.rejectBtn}>
                        Delete
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
  formCard: { backgroundColor: "#1f1f1f", border: "1px solid #2d2d2d", borderRadius: "12px", padding: "25px", marginBottom: "25px" },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #444", backgroundColor: "#141414", color: "#fff", flexGrow: 1, minWidth: "150px" },
  tableCard: { backgroundColor: "#1f1f1f", border: "1px solid #2d2d2d", borderRadius: "12px", padding: "25px" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  thRow: { borderBottom: "2px solid #2d2d2d" },
  th: { padding: "12px", color: "#aaa", fontSize: "14px", fontWeight: "bold" },
  trRow: { borderBottom: "1px solid #2d2d2d" },
  td: { padding: "16px 12px", fontSize: "15px" },
  approveBtn: { backgroundColor: "#14532d", color: "#4ade80", border: "1px solid #22c55e", padding: "10px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" },
  rejectBtn: { backgroundColor: "#7f1d1d", color: "#f87171", border: "1px solid #ef4444", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" },
};

export default ManageInternships;
