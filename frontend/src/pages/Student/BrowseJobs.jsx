import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function BrowseJobs() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .getInternships()
      .then((res) => {
        setJobListings(res.data || []);
      })
      .catch((err) => {
        alert("Failed loading internships: " + err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async (internship) => {
    try {
      const student = JSON.parse(localStorage.getItem("student") || "{}");
      const token = localStorage.getItem("studentToken");
      if (!student || !student.Student_ID) {
        alert("Please login as a student to apply.");
        return;
      }
      await api.applyInternship(
        {
          student_id: student.Student_ID,
          internship_id: internship.Internship_ID || internship.id,
        },
        token,
      );
      alert("Application submitted successfully");
    } catch (err) {
      alert("Apply failed: " + err.message);
    }
  };

  // Advanced Filtering Logic
  const filteredJobs = jobListings.filter((job) => {
    const company = (job.Company_Name || job.company || "")
      .toString()
      .toLowerCase();
    const role = (job.Role || job.role || "").toString().toLowerCase();
    const dept = (job.Dept || job.dept || "").toString();
    const matchesSearch =
      company.includes(searchTerm.toLowerCase()) ||
      role.includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "All" || dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div style={styles.container}>
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar}>
        <h2 style={styles.brand}>PortalIO</h2>
        <nav style={styles.navLinks}>
          <button
            onClick={() => navigate("/student-dashboard")}
            style={styles.navButton}
          >
            Dashboard
          </button>
          <button style={{ ...styles.navButton, ...styles.activeNav }}>
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

      {/* Main Corporate Catalog Workspace */}
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.mainHeading}>Corporate Openings Catalog</h1>
          <p style={{ color: "#aaa", margin: 0 }}>
            Discover active industry listings, evaluate academic cgpa cutoffs,
            and submit applications directly to tracking systems.
          </p>
        </header>

        {/* Unified Search & Multi-Track Filtering System */}
        <div style={styles.filterBar}>
          <input
            type="text"
            placeholder="🔍 Search by company or specific technical role title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            style={styles.selectInput}
          >
            <option value="All">All Core Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Science">Information Science</option>
            <option value="Electronics">Electronics</option>
          </select>
        </div>

        {/* Dynamic Catalog Grid */}
        <div style={styles.grid}>
          {loading ? (
            <div style={{ color: "#aaa", padding: 20 }}>
              Loading internships...
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.Internship_ID || job.Internship_ID || job.id}
                style={styles.card}
              >
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.companyName}>
                      {job.Company_Name || job.company}
                    </h3>
                    <h4 style={styles.roleTitle}>{job.Role || job.role}</h4>
                  </div>
                  <span style={styles.idBadge}>
                    {job.Internship_ID || job.id}
                  </span>
                </div>

                <div style={styles.detailsGrid}>
                  <div style={styles.detailItem}>
                    📍 <span>{job.Location || job.location || "—"}</span>
                  </div>
                  <div style={styles.detailItem}>
                    💰 <span>{job.Stipend || job.stipend || "—"}</span>
                  </div>
                  <div style={styles.detailItem}>
                    🎓 <span>Min GPA: {job.gpaCutoff || "—"}</span>
                  </div>
                  <div style={styles.detailItem}>
                    📅 <span>Deadline: {job.deadLine || "—"}</span>
                  </div>
                </div>

                <div style={styles.cardFooter}>
                  <span style={styles.deptTag}>
                    {job.Dept || job.dept || "—"}
                  </span>
                  <button
                    onClick={() => handleApply(job)}
                    style={styles.applyButton}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredJobs.length === 0 && (
          <p
            style={{
              color: "#aaa",
              textAlign: "center",
              padding: "40px",
              fontSize: "16px",
            }}
          >
            No corporate listings currently match your selected filters.
          </p>
        )}
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
  },

  mainContent: {
    flexGrow: 1,
    padding: "40px 30px",
    overflowY: "auto",
    maxWidth: "calc(100vw - 240px)",
  },
  header: {
    marginBottom: "30px",
    borderBottom: "1px solid #333",
    paddingBottom: "20px",
  },
  mainHeading: { fontSize: "2rem", margin: "0 0 10px 0", fontWeight: "bold" },

  filterBar: {
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
    width: "100%",
  },
  searchInput: {
    flexGrow: 2,
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #444",
    backgroundColor: "#1f1f1f",
    color: "#fff",
    fontSize: "15px",
  },
  selectInput: {
    flexGrow: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #444",
    backgroundColor: "#1f1f1f",
    color: "#fff",
    fontSize: "15px",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "25px",
  },
  card: {
    backgroundColor: "#1f1f1f",
    border: "1px solid #2d2d2d",
    borderRadius: "12px",
    padding: "22px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "240px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  companyName: {
    fontSize: "18px",
    color: "#646cff",
    margin: 0,
    fontWeight: "bold",
  },
  roleTitle: {
    fontSize: "15px",
    color: "#fff",
    margin: "4px 0 0 0",
    fontWeight: "normal",
  },
  idBadge: {
    backgroundColor: "#333",
    color: "#aaa",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontFamily: "monospace",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px 15px",
    marginBottom: "18px",
  },
  detailItem: {
    fontSize: "13px",
    color: "#ccc",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    borderTop: "1px solid #2d2d2d",
    paddingTop: "12px",
  },
  deptTag: {
    backgroundColor: "#2d2d2d",
    color: "#ccc",
    padding: "5px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  applyButton: {
    backgroundColor: "#646cff",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};

export default BrowseJobs;
