import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, GraduationCap, Briefcase, ChevronRight, Lock, User, Mail, CheckCircle2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dept, setDept] = useState("Computer Science");
  const [cgpa, setCgpa] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === "student") {
      setLoading(true);
      const payload = { email };
      const doLogin = async () => {
        try {
          if (isRegistering) {
            await api.registerStudent({ name, dept, email, cgpa });
          }
          const res = await api.loginStudent(payload);
          const student = res.data.student;
          const token = res.data.token;
          localStorage.setItem("student", JSON.stringify(student));
          localStorage.setItem(
            "activeStudent",
            JSON.stringify({
              studentName: student.Name,
              studentDept: student.Dept,
              studentCgpa: student.CGPA,
            }),
          );
          if (token) localStorage.setItem("studentToken", token);
          navigate("/student", { state: student });
        } catch (err) {
          alert("Auth error: " + err.message);
        } finally {
          setLoading(false);
        }
      };
      doLogin();
    } else if (role === "faculty") {
      setLoading(true);
      api
        .adminAuth(password)
        .then((res) => {
          const token = res.data.token;
          localStorage.setItem("adminToken", token);
          navigate("/admin");
        })
        .catch((err) => {
          alert("Admin auth failed: " + err.message);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex overflow-hidden relative selection:bg-indigo-500/30" style={{ perspective: "1000px" }}>
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/30 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/30 rounded-full blur-[150px] pointer-events-none" />

      {/* Left Column: 3D Hero Showcase */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 xl:px-24 relative z-10" style={{ transformStyle: "preserve-3d" }}>
        <motion.div
          initial={{ opacity: 0, rotateY: -15, z: -100 }}
          animate={{ opacity: 1, rotateY: 0, z: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-premium flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <Activity className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Internexus</h1>
          </div>

          <h2 className="text-5xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-6 drop-shadow-2xl">
            Smart Internship <br /> Management <br />
            <span className="text-gradient">for Modern Campuses</span>
          </h2>

          <p className="text-xl text-zinc-400 mb-12 max-w-xl leading-relaxed">
            Manage internships, applications, reports, and analytics in one intelligent, premium platform designed for the future of education.
          </p>

          <div className="flex gap-6 max-w-2xl relative">
            {/* 3D Floating Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="glass-card flex-1 flex flex-col gap-3 relative shadow-[0_20px_50px_rgba(99,102,241,0.2)] border-indigo-500/30 bg-zinc-900/80"
              style={{ transform: "translateZ(50px)" }}
            >
              <div className="bg-indigo-500/20 w-fit p-3 rounded-xl border border-indigo-500/30">
                <GraduationCap className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-lg text-zinc-100">Student Hub</h3>
              <p className="text-sm text-zinc-400">One-click applications & seamless reporting.</p>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="glass-card flex-1 flex flex-col gap-3 relative shadow-[0_20px_50px_rgba(34,211,238,0.2)] border-cyan-500/30 bg-zinc-900/80"
              style={{ transform: "translateZ(30px)" }}
            >
              <div className="bg-cyan-500/20 w-fit p-3 rounded-xl border border-cyan-500/30">
                <Briefcase className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-lg text-zinc-100">Admin Portal</h3>
              <p className="text-sm text-zinc-400">Intelligent analytics & effortless verification.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Right Column: 3D Auth Modal */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10 w-full" style={{ perspective: "1500px" }}>
        <motion.div
          initial={{ opacity: 0, rotateY: 20, scale: 0.9, z: -50 }}
          animate={{ opacity: 1, rotateY: 0, scale: 1, z: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="w-full max-w-md relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* 3D Glass Layer behind */}
          <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl blur-xl translate-x-4 translate-y-4 -z-10" />

          <div className="glass-card border border-zinc-800/80 bg-zinc-950/60 p-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-premium opacity-80" />
            
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold mb-2 text-white">Welcome to Internexus</h2>
              <p className="text-zinc-400 text-sm">Authenticate your session to continue</p>
            </div>

            <div className="flex p-1 bg-zinc-900 rounded-lg mb-8 border border-zinc-800">
              <button
                onClick={() => { setRole("student"); setIsRegistering(false); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                  role === "student" ? "bg-zinc-800 text-white shadow-lg shadow-black/50" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Student
              </button>
              <button
                onClick={() => { setRole("faculty"); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                  role === "faculty" ? "bg-zinc-800 text-white shadow-lg shadow-black/50" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Faculty
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <AnimatePresence mode="popLayout">
                {role === "student" && (
                  <motion.div
                    key="student-mode-toggle"
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="flex justify-center gap-6 border-b border-zinc-800/80 pb-4 mb-2"
                  >
                    <button type="button" onClick={() => setIsRegistering(false)} className={`text-sm font-bold transition-colors ${!isRegistering ? "text-cyan-400" : "text-zinc-500 hover:text-zinc-300"}`}>
                      Sign In
                    </button>
                    <button type="button" onClick={() => setIsRegistering(true)} className={`text-sm font-bold transition-colors ${isRegistering ? "text-cyan-400" : "text-zinc-500 hover:text-zinc-300"}`}>
                      Create Account
                    </button>
                  </motion.div>
                )}

                {role === "student" && isRegistering && (
                  <motion.div key="student-register-fields" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Full Legal Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input type="text" required placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-white" />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="space-y-2 flex-1">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Department</label>
                        <select value={dept} onChange={(e) => setDept(e.target.value)} className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-cyan-500 transition-all appearance-none text-white">
                          <option value="Computer Science">Computer Science</option>
                          <option value="Information Science">Information Science</option>
                          <option value="Electronics">Electronics</option>
                        </select>
                      </div>
                      <div className="space-y-2 flex-1">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">CGPA</label>
                        <input type="number" step="0.01" min="0" max="10" required placeholder="9.15" value={cgpa} onChange={(e) => setCgpa(e.target.value)} className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-cyan-500 transition-all text-white" />
                      </div>
                    </div>
                  </motion.div>
                )}

                <motion.div key="email-field" layout className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{role === "faculty" ? "Faculty ID / Email" : "College Email"}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input type="email" required placeholder="name@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white" />
                  </div>
                </motion.div>

                {role === "faculty" && (
                  <motion.div key="faculty-password" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Passcode</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-900/80 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button type="submit" disabled={loading} className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-premium hover:opacity-90 text-white py-3 px-4 rounded-lg font-bold transition-all hover:scale-[1.02] shadow-[0_10px_20px_rgba(99,102,241,0.3)] disabled:opacity-50">
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{role === "faculty" ? "Access Dashboard" : isRegistering ? "Create Account" : "Sign In"} <ChevronRight className="w-5 h-5" /></>}
              </button>
            </form>
          </div>
          
          <div className="mt-8 text-center text-xs text-zinc-500 flex items-center justify-center gap-2 font-semibold tracking-wide">
            <CheckCircle2 className="w-4 h-4 text-emerald-500/70" />
            SECURE INTERNEXUS AUTH
          </div>
        </motion.div>
      </div>
    </div>
  );
}
