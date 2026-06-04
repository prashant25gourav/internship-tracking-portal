import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, CheckSquare, FileText, Briefcase, Users, Building2, 
  LogOut, Activity, PieChart, TrendingUp, ShieldCheck, Database, Server
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [statusBreakdown, setStatusBreakdown] = useState({ Pending: 0, Selected: 0, Rejected: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const summaryRes = await api.analyticsSummary(token);
      const summaryData = summaryRes?.data?.data ?? summaryRes?.data ?? null;
      setSummary(summaryData);

      try {
        const statusRes = await api.analyticsAppStatus(token);
        const stData = statusRes?.data?.data?.breakdown ?? statusRes?.data?.breakdown ?? [];
        const counts = { Pending: 0, Selected: 0, Rejected: 0 };
        stData.forEach(item => { counts[item.status] = item.count; });
        setStatusBreakdown(counts);
      } catch (err) {
        console.log("Status breakdown endpoint unavailable");
      }

      try {
        const activityRes = await api.analyticsRecentActivities(token);
        const activities = activityRes?.data?.data?.activities ?? activityRes?.data?.activities ?? activityRes?.data ?? [];
        const formatted = (activities || []).map((item, index) => ({
          id: index,
          time: item.timestamp || item.time || "Now",
          user: item.user || item.student_id || "System",
          action: item.description || item.action || "performed action",
          target: item.module || item.target || "portal",
          badgeColor: "#818cf8",
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex overflow-hidden selection:bg-purple-500/30">
      {/* Ambient Background */}
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
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-purple-500/10 text-purple-400 rounded-xl font-medium border border-purple-500/20 transition-all shadow-inner shadow-purple-500/10">
            <LayoutDashboard className="w-5 h-5" /> Analytics Hub
          </button>
          <button onClick={() => navigate("/verify-applications")} className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-xl font-medium transition-all group">
            <CheckSquare className="w-5 h-5 group-hover:scale-110 transition-transform" /> Verify Applications
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
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex justify-between items-end mb-12 border-b border-zinc-800/50 pb-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-3 tracking-tight">Departmental Verification Hub</h1>
            <p className="text-zinc-400 font-medium">Review student activity, verify applications, and monitor metrics.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full border border-indigo-500/20 text-sm font-semibold">
            <Server className="w-4 h-4" /> System Live
          </div>
        </motion.header>

        {loading ? (
           <div className="flex items-center justify-center h-64 text-zinc-500">
             <span className="w-6 h-6 border-2 border-zinc-500/30 border-t-zinc-500 rounded-full animate-spin mr-3" />
             Loading Analytics...
           </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left Column (Stats & Breakdown) */}
            <div className="xl:col-span-2 flex flex-col gap-8">
              
              {/* Primary Stats */}
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div variants={itemVariants} className="glass-card flex flex-col gap-1 relative overflow-hidden p-5">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl" />
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Students</span>
                  <strong className="text-3xl font-bold text-zinc-100">{summary?.total_students || 0}</strong>
                </motion.div>
                <motion.div variants={itemVariants} className="glass-card flex flex-col gap-1 relative overflow-hidden p-5">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl" />
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Companies</span>
                  <strong className="text-3xl font-bold text-zinc-100">{summary?.total_companies || 0}</strong>
                </motion.div>
                <motion.div variants={itemVariants} className="glass-card flex flex-col gap-1 relative overflow-hidden p-5">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl" />
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Internships</span>
                  <strong className="text-3xl font-bold text-zinc-100">{summary?.total_internships || 0}</strong>
                </motion.div>
                <motion.div variants={itemVariants} className="glass-card flex flex-col gap-1 relative overflow-hidden p-5">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl" />
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Apps</span>
                  <strong className="text-3xl font-bold text-zinc-100">{summary?.total_applications || 0}</strong>
                </motion.div>
              </motion.div>

              {/* Status Breakdown Component */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-0 overflow-hidden">
                <div className="p-6 border-b border-zinc-800/50 bg-zinc-900/30 flex items-center gap-3">
                  <PieChart className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold">Application Status Breakdown</h3>
                </div>
                <div className="p-6 grid grid-cols-3 gap-6">
                  <div className="bg-zinc-950/50 border border-amber-500/20 rounded-xl p-5 flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-xs font-bold text-amber-500/70 uppercase tracking-widest mb-1">Pending</span>
                    <strong className="text-4xl font-bold text-amber-400">{statusBreakdown.Pending || 0}</strong>
                  </div>
                  <div className="bg-zinc-950/50 border border-emerald-500/20 rounded-xl p-5 flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-xs font-bold text-emerald-500/70 uppercase tracking-widest mb-1">Selected</span>
                    <strong className="text-4xl font-bold text-emerald-400">{statusBreakdown.Selected || 0}</strong>
                  </div>
                  <div className="bg-zinc-950/50 border border-red-500/20 rounded-xl p-5 flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-xs font-bold text-red-500/70 uppercase tracking-widest mb-1">Rejected</span>
                    <strong className="text-4xl font-bold text-red-400">{statusBreakdown.Rejected || 0}</strong>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Right Column (MongoDB Logs) */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-card p-0 flex flex-col h-[500px] xl:h-auto overflow-hidden">
              <div className="p-6 border-b border-zinc-800/50 bg-zinc-900/30 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-bold">Live Activity Log</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </div>
              </div>

              <div className="p-4 flex-1 overflow-y-auto space-y-3 relative">
                {recentActivities.length > 0 ? (
                  recentActivities.map((log, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                      key={log.id} 
                      className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors flex flex-col gap-2 relative pl-12"
                    >
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: log.badgeColor || '#818cf8' }} />
                      
                      <div className="flex justify-between items-start gap-4">
                        <div className="text-sm">
                          <strong className="text-zinc-200">{log.user}</strong> <span className="text-zinc-400">{log.action}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <code className="text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded">[{log.target}]</code>
                        <span className="text-zinc-600">{new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 opacity-50">
                    <Activity className="w-10 h-10 mb-2" />
                    <p className="text-sm font-medium">No recent activities</p>
                  </div>
                )}
              </div>
            </motion.div>

          </div>
        )}
      </main>
    </div>
  );
}
