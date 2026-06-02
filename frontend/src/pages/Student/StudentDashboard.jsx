import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api";
import { motion } from "framer-motion";
import { LayoutDashboard, Briefcase, FileUp, LogOut, CheckCircle2, Clock, XCircle, Activity, User, Building2, ChevronRight } from "lucide-react";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const getStudentData = () => {
    if (location.state) return location.state;
    const savedData = localStorage.getItem("activeStudent");
    if (savedData) return JSON.parse(savedData);
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

  const getStatusStyles = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("select") || s.includes("accept") || s.includes("approv")) {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
    if (s.includes("reject")) {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  };

  const getStatusIcon = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("select") || s.includes("accept") || s.includes("approv")) {
      return <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />;
    }
    if (s.includes("reject")) {
      return <XCircle className="w-3.5 h-3.5 mr-1.5" />;
    }
    return <Clock className="w-3.5 h-3.5 mr-1.5" />;
  };

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
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-indigo-500/10 text-indigo-400 rounded-xl font-medium border border-indigo-500/20 transition-all shadow-inner shadow-indigo-500/10">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button onClick={() => navigate("/browse-jobs")} className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-xl font-medium transition-all group">
            <Briefcase className="w-5 h-5 group-hover:scale-110 transition-transform" /> Browse Internships
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
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-3 tracking-tight">
            Welcome back, <span className="text-gradient">{studentData.studentName}</span>
          </h1>
          <div className="flex items-center gap-4 text-zinc-400 text-sm font-medium">
            <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {studentData.studentDept}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> CGPA: <strong className="text-zinc-200">{studentData.studentCgpa}</strong></span>
          </div>
        </motion.header>

        {/* Stats Grid */}
        <motion.div 
          variants={containerVariants} initial="hidden" animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div variants={itemVariants} className="glass-card flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-500/20 transition-colors" />
            <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Total Applied</span>
            <strong className="text-4xl font-bold text-indigo-400">{applications.length}</strong>
          </motion.div>
          
          <motion.div variants={itemVariants} className="glass-card flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-amber-500/20 transition-colors" />
            <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Under Review</span>
            <strong className="text-4xl font-bold text-amber-400">
              {applications.filter((a) => {
                const s = a.Status || a.Application_Status || a.status || "";
                return s === "Applied" || s === "Under Review" || s === "Pending" || s === "";
              }).length}
            </strong>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-colors" />
            <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Offers Secured</span>
            <strong className="text-4xl font-bold text-emerald-400">
              {applications.filter((a) => {
                const s = a.Status || a.Application_Status || a.status || "";
                return s === "Selected" || s === "Accepted" || s === "Approved";
              }).length}
            </strong>
          </motion.div>
        </motion.div>

        {/* Dynamic Tracking Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-0 overflow-hidden"
        >
          <div className="p-6 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/30">
            <h3 className="text-lg font-bold">Application Tracker</h3>
            <button onClick={() => navigate("/browse-jobs")} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors">
              Find more <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/50 bg-zinc-950/30">
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Company</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Role</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Applied Date</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-zinc-500">
                      <div className="flex items-center justify-center gap-3">
                        <span className="w-5 h-5 border-2 border-zinc-500/30 border-t-zinc-500 rounded-full animate-spin" />
                        Syncing applications...
                      </div>
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-zinc-500">
                      <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm">No applications found in your history.</p>
                    </td>
                  </tr>
                ) : (
                  applications.map((app, i) => {
                    const status = app.Status || app.Application_Status || app.status || "Pending";
                    return (
                      <motion.tr 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                        key={app.App_ID || app.app_id || i}
                        className="hover:bg-zinc-800/20 transition-colors group"
                      >
                        <td className="p-4 font-semibold text-zinc-200">
                          {app.Company_Name || app.Company || app.company || "—"}
                        </td>
                        <td className="p-4 text-zinc-400">
                          {app.Role || app.Internship_Role || app.role || "—"}
                        </td>
                        <td className="p-4 text-zinc-500 text-sm">
                          {app.Apply_Date || app.ApplyDate || "—"}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(status)}`}>
                            {getStatusIcon(status)}
                            {status}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
