import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Briefcase, FileUp, LogOut, Activity, 
  Search, MapPin, DollarSign, GraduationCap, Calendar, ChevronRight, Building2 
} from "lucide-react";

export default function BrowseJobs() {
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

  const filteredJobs = jobListings.filter((job) => {
    const company = (job.Company_Name || job.company || "").toString().toLowerCase();
    const role = (job.Role || job.role || "").toString().toLowerCase();
    const dept = (job.Dept || job.dept || "").toString();
    const matchesSearch = company.includes(searchTerm.toLowerCase()) || role.includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "All" || dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex overflow-hidden selection:bg-indigo-500/30">
      {/* Ambient Background */}
      <div className="fixed top-[-20%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Sidebar Navigation */}
      <aside className="w-64 glass border-r border-zinc-800/50 flex flex-col z-20 relative backdrop-blur-2xl bg-zinc-950/50">
        <div className="p-8 flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-premium flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Internexus</h2>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-2">
          <button onClick={() => navigate("/student")} className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-xl font-medium transition-all group">
            <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" /> Dashboard
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-indigo-500/10 text-indigo-400 rounded-xl font-medium border border-indigo-500/20 transition-all shadow-inner shadow-indigo-500/10">
            <Briefcase className="w-5 h-5" /> Browse Internships
          </button>
          <button onClick={() => navigate("/upload-report")} className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-xl font-medium transition-all group">
            <FileUp className="w-5 h-5 group-hover:scale-110 transition-transform" /> Upload Report
          </button>
        </nav>

        <div className="p-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl font-medium transition-all border border-transparent hover:border-red-500/20">
            <LogOut className="w-5 h-5" /> Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 z-10 relative">
        <motion.header 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10 border-b border-zinc-800/50 pb-8"
        >
          <h1 className="text-4xl font-bold mb-3 tracking-tight">Corporate Openings Catalog</h1>
          <p className="text-zinc-400 font-medium">Discover active industry listings, evaluate requirements, and submit applications.</p>
        </motion.header>

        {/* Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-10"
        >
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by company or role title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/80 border border-zinc-700/50 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white shadow-inner"
            />
          </div>
          <div className="relative w-full md:w-64">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-zinc-900/80 border border-zinc-700/50 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-all appearance-none text-white shadow-inner"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Science">Information Science</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>
        </motion.div>

        {/* Dynamic Grid */}
        {loading ? (
           <div className="flex items-center justify-center h-64 text-zinc-500">
             <span className="w-6 h-6 border-2 border-zinc-500/30 border-t-zinc-500 rounded-full animate-spin mr-3" />
             Loading internships...
           </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredJobs.map((job) => (
                <motion.div
                  variants={itemVariants}
                  layout
                  key={job.Internship_ID || job.id}
                  className="glass-card flex flex-col justify-between h-[280px] p-6 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />
                  
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-indigo-400 mb-1">{job.Company_Name || job.company}</h3>
                        <h4 className="text-zinc-200 font-medium">{job.Role || job.role}</h4>
                      </div>
                      <span className="bg-zinc-800 text-zinc-400 px-2 py-1 rounded text-xs font-mono border border-zinc-700">
                        #{job.Internship_ID || job.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-zinc-400">
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-zinc-500" /> {job.Location || job.location || "Remote"}</div>
                      <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-zinc-500" /> {job.Stipend || job.stipend || "Unpaid"}</div>
                      <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-zinc-500" /> Min GPA: {job.gpaCutoff || "None"}</div>
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-zinc-500" /> Due: {job.deadLine || "Rolling"}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50 mt-4">
                    <span className="bg-zinc-800/50 text-zinc-300 px-3 py-1 rounded-lg text-xs font-semibold border border-zinc-700/50">
                      {job.Dept || job.dept || "General"}
                    </span>
                    <button
                      onClick={() => handleApply(job)}
                      className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 shadow-lg shadow-indigo-500/20 flex items-center gap-1"
                    >
                      Apply <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredJobs.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Search className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">No corporate listings currently match your filters.</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
