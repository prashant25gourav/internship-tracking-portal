import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, CheckSquare, FileText, Briefcase, Users, Building2, 
  LogOut, ShieldCheck, Download, FileJson
} from "lucide-react";

export default function ReviewReports() {
  const navigate = useNavigate();

  const [uploadedReports, setUploadedReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial load with loading state
    setLoading(true);
    api.listReports()
      .then((res) => setUploadedReports(res.data || []))
      .catch((err) => console.error("Failed to load reports: " + err.message))
      .finally(() => setLoading(false));

    // Realtime polling
    const interval = setInterval(() => {
      api.listReports()
        .then((res) => setUploadedReports(res.data || []))
        .catch((err) => console.error("Polling error: ", err));
    }, 3000);

    return () => clearInterval(interval);
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
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-purple-500/10 text-purple-400 rounded-xl font-medium border border-purple-500/20 transition-all shadow-inner shadow-purple-500/10">
            <FileText className="w-5 h-5" /> Review Reports
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
          <h1 className="text-4xl font-bold mb-3 tracking-tight">Review Project Reports</h1>
          <p className="text-zinc-400 font-medium">Download and audit student technical internship documentations.</p>
        </motion.header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-0 overflow-hidden">
          <div className="p-6 border-b border-zinc-800/50 bg-zinc-900/30 flex items-center justify-between">
            <h3 className="text-lg font-bold">Document Repository</h3>
            <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              {uploadedReports.length} Documents
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/50 bg-zinc-950/30">
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Submitted By</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Project Focus Area</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Upload Date</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Document Link</th>
                  <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                      <div className="flex items-center justify-center gap-3">
                        <span className="w-5 h-5 border-2 border-zinc-500/30 border-t-zinc-500 rounded-full animate-spin" />
                        Fetching repository...
                      </div>
                    </td>
                  </tr>
                ) : uploadedReports.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-zinc-500">
                      <FileJson className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm">No reports uploaded to the repository yet.</p>
                    </td>
                  </tr>
                ) : (
                  uploadedReports.map((report, i) => {
                    const fileName = (report.File_Path || report.fileName || "").split("/").pop();
                    return (
                      <motion.tr 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                        key={report.Report_ID || report.ReportId || i}
                        className="hover:bg-zinc-800/20 transition-colors group"
                      >
                        <td className="p-4 font-semibold text-zinc-200">
                          {report.Student_ID || report.student || report.studentName}
                        </td>
                        <td className="p-4 text-zinc-300 font-medium">
                          {report.Topic || report.topic || "Project Report"}
                        </td>
                        <td className="p-4 text-zinc-500 text-sm">
                          {report.Submission_Date || report.date || "—"}
                        </td>
                        <td className="p-4">
                          <code className="text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded text-xs">
                            {fileName || "document.pdf"}
                          </code>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDownload(report.Report_ID || report.ReportId, fileName)}
                            className="bg-zinc-800 hover:bg-zinc-700 text-indigo-400 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 mx-auto border border-zinc-700"
                          >
                            <Download className="w-4 h-4" /> Download
                          </button>
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
