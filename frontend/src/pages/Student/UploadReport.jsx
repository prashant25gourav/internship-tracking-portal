import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Briefcase, FileUp, LogOut, Activity, 
  UploadCloud, FileText, Building2, AlignLeft, Send
} from "lucide-react";

export default function UploadReport() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    company: "Google",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !file) {
      alert("Please fill out all fields and select a PDF report file.");
      return;
    }
    const fd = new FormData();
    const student = JSON.parse(localStorage.getItem("student") || "{}");
    if (!student || !student.Student_ID) {
      alert("Please login as a student before uploading.");
      return;
    }
    setIsUploading(true);
    fd.append("file", file);
    fd.append("student_id", student.Student_ID);
    fd.append("title", formData.title);
    fd.append("company", formData.company);
    fd.append("description", formData.description);

    api
      .uploadReport(fd, localStorage.getItem("studentToken"))
      .then((res) => {
        alert("Report uploaded successfully to Internexus Core.");
        setFormData({ title: "", company: "Google", description: "" });
        setFile(null);
      })
      .catch((err) => {
        alert("Upload failed: " + err.message);
      })
      .finally(() => setIsUploading(false));
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
          <button onClick={() => navigate("/browse-jobs")} className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-xl font-medium transition-all group">
            <Briefcase className="w-5 h-5 group-hover:scale-110 transition-transform" /> Browse Internships
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-indigo-500/10 text-indigo-400 rounded-xl font-medium border border-indigo-500/20 transition-all shadow-inner shadow-indigo-500/10">
            <FileUp className="w-5 h-5" /> Upload Report
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
          <h1 className="text-4xl font-bold mb-3 tracking-tight">Submit Completion Report</h1>
          <p className="text-zinc-400 font-medium">Upload your final industry evaluation certificates and project documentation securely.</p>
        </motion.header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card max-w-3xl p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Project / Internship Title</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text" required
                  placeholder="e.g., Cloud Infrastructure Optimization System"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Associated Company</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <select
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-all appearance-none text-white shadow-inner"
                >
                  <option value="Google">Google</option>
                  <option value="Stripe">Stripe</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="NVIDIA">NVIDIA</option>
                  <option value="Apple">Apple</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Core Accomplishments</label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                <textarea
                  rows="5" required
                  placeholder="Summarize your key responsibilities, tech stacks utilized, and major project deliverables..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white shadow-inner resize-y"
                />
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Evaluation Document (PDF)</label>
              <div className={`relative border-2 border-dashed rounded-2xl p-8 transition-colors text-center cursor-pointer ${file ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-zinc-700 hover:border-indigo-500/50 hover:bg-zinc-800/30 bg-zinc-950/50'}`}>
                <input
                  type="file" accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-3 pointer-events-none">
                  {file ? (
                    <>
                      <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-semibold text-indigo-400">{file.name}</div>
                      <div className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-semibold text-zinc-300">Click or drag PDF to upload</div>
                      <div className="text-xs text-zinc-500">Max size 10MB. PDF format strictly required.</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit" disabled={isUploading}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-premium hover:opacity-90 text-white py-4 px-4 rounded-xl font-bold transition-all hover:scale-[1.01] shadow-lg shadow-indigo-500/25 disabled:opacity-50 text-base"
            >
              {isUploading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Submit Report to Core <Send className="w-4 h-4 ml-1" /></>
              )}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
