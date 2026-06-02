import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, CheckSquare, FileText, Briefcase, Users, Building2, 
  LogOut, ShieldCheck, Plus, Trash2, Search, Clock, DollarSign
} from "lucide-react";

export default function ManageInternships() {
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
        setRole("");
        setCompanyId("");
        setDuration("");
        setStipend("");
        load();
      })
      .catch((err) => alert("Failed to add: " + err.message));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this internship opportunity?")) return;
    const token = localStorage.getItem("adminToken");
    api
      .deleteInternship(id, token)
      .then(() => {
        load();
      })
      .catch((err) => alert("Failed to delete: " + err.message));
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
          <button onClick={() => navigate("/verify-applications")} className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-xl font-medium transition-all group">
            <CheckSquare className="w-5 h-5 group-hover:scale-110 transition-transform" /> Verify Applications
          </button>
          <button onClick={() => navigate("/review-reports")} className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-xl font-medium transition-all group">
            <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" /> Review Reports
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-purple-500/10 text-purple-400 rounded-xl font-medium border border-purple-500/20 transition-all shadow-inner shadow-purple-500/10">
            <Briefcase className="w-5 h-5" /> Manage Internships
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
          <h1 className="text-4xl font-bold mb-3 tracking-tight">Manage Internships</h1>
          <p className="text-zinc-400 font-medium">Add new corporate opportunities or remove existing ones from the system.</p>
        </motion.header>

        {/* Post New Internship Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card mb-8 relative overflow-hidden p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-indigo-400" /> Post New Listing</h3>
          
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end relative z-10">
            <div className="space-y-1.5 lg:col-span-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Company</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} required className="w-full bg-zinc-900/80 border border-zinc-700/50 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:border-indigo-500 appearance-none text-white transition-all shadow-inner">
                  <option value="">Select...</option>
                  {companies.map((c) => (
                    <option key={c.Company_ID} value={c.Company_ID}>{c.Company_Name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-1.5 lg:col-span-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Role</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input type="text" placeholder="e.g. Frontend Eng" value={role} onChange={(e) => setRole(e.target.value)} required className="w-full bg-zinc-900/80 border border-zinc-700/50 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:border-indigo-500 transition-all text-white shadow-inner" />
              </div>
            </div>

            <div className="space-y-1.5 lg:col-span-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Duration</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input type="text" placeholder="e.g. 6 Months" value={duration} onChange={(e) => setDuration(e.target.value)} required className="w-full bg-zinc-900/80 border border-zinc-700/50 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:border-indigo-500 transition-all text-white shadow-inner" />
              </div>
            </div>

            <div className="space-y-1.5 lg:col-span-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Stipend</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input type="text" placeholder="e.g. 40000" value={stipend} onChange={(e) => setStipend(e.target.value)} required className="w-full bg-zinc-900/80 border border-zinc-700/50 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:border-indigo-500 transition-all text-white shadow-inner" />
              </div>
            </div>

            <div className="lg:col-span-1 h-[42px]">
              <button type="submit" className="h-full w-full bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] border border-emerald-400">
                Post Internship
              </button>
            </div>
          </form>
        </motion.div>

        {/* Active Listings Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-0 overflow-hidden">
          <div className="p-6 border-b border-zinc-800/50 bg-zinc-900/30 flex items-center justify-between">
            <h3 className="text-lg font-bold">Active Listings Dashboard</h3>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              {internships.length} Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/50 bg-zinc-950/30">
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Role</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Company</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Duration</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Stipend</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                      <div className="flex items-center justify-center gap-3">
                        <span className="w-5 h-5 border-2 border-zinc-500/30 border-t-zinc-500 rounded-full animate-spin" />
                        Fetching active listings...
                      </div>
                    </td>
                  </tr>
                ) : internships.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-zinc-500">
                      <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm">No active listings found in the database.</p>
                    </td>
                  </tr>
                ) : (
                  internships.map((job, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                      key={job.Internship_ID || i}
                      className="hover:bg-zinc-800/20 transition-colors group"
                    >
                      <td className="p-4 font-semibold text-zinc-200">{job.Role}</td>
                      <td className="p-4 text-zinc-400">{job.Company_Name}</td>
                      <td className="p-4 text-zinc-400 text-sm">{job.Duration}</td>
                      <td className="p-4 text-zinc-400 text-sm">₹{job.Stipend}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(job.Internship_ID)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
