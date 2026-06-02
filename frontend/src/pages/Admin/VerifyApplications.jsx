import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, CheckSquare, FileText, Briefcase, Users, Building2, 
  LogOut, ShieldCheck, CheckCircle2, XCircle, Clock
} from "lucide-react";

export default function VerifyApplications() {
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
        load();
      })
      .catch((err) => alert("Update failed: " + err.message));
  };

  const getStatusStyles = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("select") || s.includes("accept") || s.includes("approv")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (s.includes("reject")) return "bg-red-500/10 text-red-400 border-red-500/20";
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex overflow-hidden selection:bg-purple-500/30">
      <div className="fixed top-[-20%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Sidebar Navigation */}
      <aside className="w-64 glass border-r border-zinc-800/50 flex flex-col z-20 relative backdrop-blur-2xl bg-zinc-950/50">
        <div className="p-8 flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-premium flex items-center justify-center shadow-lg shadow-purple-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Internexus</h2>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
          <div className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 mt-4">Core Modules</div>
          <button onClick={() => navigate("/admin")} className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-xl font-medium transition-all group">
            <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" /> Analytics Hub
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-purple-500/10 text-purple-400 rounded-xl font-medium border border-purple-500/20 transition-all shadow-inner shadow-purple-500/10">
            <CheckSquare className="w-5 h-5" /> Verify Applications
          </button>
          <button onClick={() => navigate("/review-reports")} className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-xl font-medium transition-all group">
            <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" /> Review Reports
          </button>
          <button onClick={() => navigate("/manage-internships")} className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-xl font-medium transition-all group">
            <Briefcase className="w-5 h-5 group-hover:scale-110 transition-transform" /> Manage Internships
          </button>
          
          <div className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 mt-6">Directories</div>
          <button onClick={() => navigate("/students-directory")} className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-xl font-medium transition-all group">
            <Users className="w-5 h-5 group-hover:scale-110 transition-transform" /> Student Directory
          </button>
          <button onClick={() => navigate("/companies-directory")} className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-xl font-medium transition-all group">
            <Building2 className="w-5 h-5 group-hover:scale-110 transition-transform" /> Company Directory
          </button>
        </nav>

        <div className="p-4">
          <button onClick={() => { localStorage.removeItem("adminToken"); navigate("/"); }} className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl font-medium transition-all border border-transparent hover:border-red-500/20">
            <LogOut className="w-5 h-5" /> Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 z-10 relative">
        <motion.header 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 border-b border-zinc-800/50 pb-8"
        >
          <h1 className="text-4xl font-bold mb-3 tracking-tight">Verify Applications</h1>
          <p className="text-zinc-400 font-medium">Review and update structural corporate placement requests.</p>
        </motion.header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-0 overflow-hidden">
          <div className="p-6 border-b border-zinc-800/50 bg-zinc-900/30 flex items-center justify-between">
            <h3 className="text-lg font-bold">Pending Placements Pipeline</h3>
            <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              {applications.length} Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/50 bg-zinc-950/30">
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Student</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Department</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Company & Role</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                      <div className="flex items-center justify-center gap-3">
                        <span className="w-5 h-5 border-2 border-zinc-500/30 border-t-zinc-500 rounded-full animate-spin" />
                        Syncing applications...
                      </div>
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-zinc-500">
                      <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm">No applications pending verification.</p>
                    </td>
                  </tr>
                ) : (
                  applications.map((app, i) => {
                    const status = app.Status || app.Application_Status || app.status || "Pending";
                    const isPending = status === "Pending" || status === "Applied" || app.Application_Status === "Pending";
                    
                    return (
                      <motion.tr 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                        key={app.App_ID || app.app_id || i}
                        className="hover:bg-zinc-800/20 transition-colors group"
                      >
                        <td className="p-4 font-semibold text-zinc-200">{app.Student_Name || app.Student || app.name}</td>
                        <td className="p-4 text-zinc-400 text-sm">{app.Dept || app.dept || app.Student_Dept}</td>
                        <td className="p-4">
                          <div className="font-medium text-zinc-300">{app.Company_Name || app.company}</div>
                          <div className="text-xs text-zinc-500 mt-0.5">{app.Internship_Role || app.Role || app.role}</div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(status)}`}>
                            {status}
                          </span>
                        </td>
                        <td className="p-4">
                          {isPending ? (
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => handleStatusUpdate(app.App_ID || app.app_id, "Selected")} className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors" title="Approve">
                                <CheckCircle2 className="w-5 h-5" />
                              </button>
                              <button onClick={() => handleStatusUpdate(app.App_ID || app.app_id, "Rejected")} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors" title="Reject">
                                <XCircle className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <div className="text-center text-xs text-zinc-600 font-medium">Finalized</div>
                          )}
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
