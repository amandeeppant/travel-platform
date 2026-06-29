"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Building2, Briefcase, Users, Shield,
  ArrowRight, CheckCircle2, Eye, EyeOff, ChevronLeft
} from "lucide-react";

const PORTALS = [
  {
    id: "traveler",
    icon: User,
    title: "Traveler",
    subtitle: "Personal travel booking",
    desc: "Book trains, flights, hotels, packages and more. Access AI travel planner and visa assistance.",
    color: "#1677FF",
    bg: "#EFF6FF",
    features: ["Flight & Train Booking", "Hotel Search", "AI Travel Planner", "Visa Assistance", "Travel Insurance"],
    route: "/portal/traveler",
  },
  {
    id: "hotel-partner",
    icon: Building2,
    title: "Hotel Partner",
    subtitle: "Property management",
    desc: "Register your property, manage inventory, bookings, pricing and view revenue analytics.",
    color: "#059669",
    bg: "#ECFDF5",
    features: ["Property Registration", "Inventory Management", "Booking Management", "Revenue Dashboard", "Analytics"],
    route: "/portal/hotel-partner",
  },
  {
    id: "corporate",
    icon: Briefcase,
    title: "Corporate",
    subtitle: "Business travel management",
    desc: "Manage employee travel, approvals, policies, budgets and expense tracking for your organization.",
    color: "#7C3AED",
    bg: "#F5F3FF",
    features: ["Employee Travel Requests", "Approval Workflow", "Travel Policy", "Budget Monitoring", "Expense Tracking"],
    route: "/portal/corporate",
  },
  {
    id: "travel-agent",
    icon: Users,
    title: "Travel Agent",
    subtitle: "Agent & group bookings",
    desc: "Manage customers, create group bookings, track commissions and generate quotations.",
    color: "#D97706",
    bg: "#FFFBEB",
    features: ["Customer Management", "Group Bookings", "Commission Tracking", "Quotation Generation", "B2B Rates"],
    route: "/portal/travel-agent",
  },
  {
    id: "admin",
    icon: Shield,
    title: "Administration",
    subtitle: "Platform management",
    desc: "Full platform control — user management, hotel approvals, booking monitoring, fraud detection.",
    color: "#DC2626",
    bg: "#FEF2F2",
    features: ["User Management", "Hotel Approval", "Booking Monitoring", "Revenue Analytics", "Fraud Detection"],
    route: "/portal/admin",
  },
];

type Step = "role" | "details";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep]               = useState<Step>("role");
  const [selectedPortal, setSelected] = useState<string | null>(null);
  const [showPass, setShowPass]       = useState(false);
  const [form, setForm]               = useState({ name: "", email: "", phone: "", password: "", org: "" });

  const portal = PORTALS.find((p) => p.id === selectedPortal);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selectedPortal) return;
    setStep("details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portal) return;

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          org: form.org,
          portal: portal.id,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data?.error || "Unable to register account.");
        return;
      }

      setSuccessMessage("Registration successful! Redirecting to your portal...");
      setTimeout(() => {
        router.push("/login");
      }, 900);
    } catch (error) {
      setErrorMessage("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflow: "hidden" }}>

      {/* Background orbs */}
      {["#1677FF","#7C3AED","#059669"].map((c, i) => (
        <motion.div key={i}
          animate={{ x:[0,40,-30,0], y:[0,-50,30,0], scale:[1,1.2,1] }}
          transition={{ duration: 12+i*3, repeat: Infinity, ease:"easeInOut", delay: i*2 }}
          style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:`radial-gradient(circle,${c}30 0%,transparent 65%)`, left:`${[5,55,75][i]}%`, top:`${[10,60,5][i]}%`, pointerEvents:"none" }}
        />
      ))}

      {/* Back to home */}
      <motion.a href="/" initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
        style={{ position:"absolute", top:24, left:24, display:"flex", alignItems:"center", gap:6, color:"rgba(255,255,255,0.7)", textDecoration:"none", fontSize:13, fontWeight:600, zIndex:10 }}
        whileHover={{ color:"#fff" }}
      >
        <ChevronLeft size={16} /> Back to Home
      </motion.a>

      {/* Logo */}
      <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
        style={{ position:"absolute", top:22, left:"50%", transform:"translateX(-50%)", display:"flex", alignItems:"center", gap:8, zIndex:10 }}
      >
        <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#1677FF,#0ea5e9)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(22,119,255,0.4)" }}>
          <span style={{ color:"#fff", fontWeight:900, fontSize:16 }}>T</span>
        </div>
        <span style={{ color:"#fff", fontWeight:800, fontSize:18, letterSpacing:"-0.02em" }}>TravelEase</span>
      </motion.div>

      <div style={{ width:"100%", maxWidth: step === "role" ? "1100px" : "480px", position:"relative", zIndex:5 }}>
        <AnimatePresence mode="wait">

          {/* ── STEP 1: Choose Portal ── */}
          {step === "role" && (
            <motion.div key="role" initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }} transition={{ duration:0.4 }}>
              <div style={{ textAlign:"center", marginBottom:32 }}>
                <p style={{ color:"rgba(255,255,255,0.6)", fontSize:13, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>CREATE ACCOUNT</p>
                <h1 style={{ color:"#fff", fontSize:"clamp(26px,4vw,40px)", fontWeight:900, letterSpacing:"-0.02em", lineHeight:1.1 }}>
                  Choose your portal
                </h1>
                <p style={{ color:"rgba(255,255,255,0.55)", fontSize:15, marginTop:10 }}>
                  Select the portal that best describes your role
                </p>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:14 }}>
                {PORTALS.map((p, i) => {
                  const Icon = p.icon;
                  const active = selectedPortal === p.id;
                  return (
                    <motion.div key={p.id}
                      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.07 }}
                      onClick={() => setSelected(p.id)}
                      whileHover={{ y:-6, boxShadow:"0 20px 50px rgba(0,0,0,0.25)" }}
                      style={{
                        background: active ? "#fff" : "rgba(255,255,255,0.08)",
                        backdropFilter:"blur(20px)",
                        border:`2px solid ${active ? p.color : "rgba(255,255,255,0.12)"}`,
                        borderRadius:20,
                        padding:"22px 18px",
                        cursor:"pointer",
                        transition:"all 0.25s ease",
                        position:"relative",
                        overflow:"hidden",
                      }}
                    >
                      {active && (
                        <div style={{ position:"absolute", top:10, right:10 }}>
                          <CheckCircle2 size={18} color={p.color} />
                        </div>
                      )}
                      <div style={{ width:48, height:48, borderRadius:14, background: active ? p.bg : "rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                        <Icon size={24} color={active ? p.color : "#fff"} />
                      </div>
                      <h3 style={{ fontSize:16, fontWeight:800, color: active ? "#111" : "#fff", marginBottom:4, lineHeight:1.2 }}>{p.title}</h3>
                      <p style={{ fontSize:11, fontWeight:600, color: active ? p.color : "rgba(255,255,255,0.5)", marginBottom:10 }}>{p.subtitle}</p>
                      <p style={{ fontSize:12, color: active ? "#6B7280" : "rgba(255,255,255,0.5)", lineHeight:1.5, marginBottom:14 }}>{p.desc}</p>
                      <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:5 }}>
                        {p.features.slice(0,3).map((f) => (
                          <li key={f} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color: active ? "#374151" : "rgba(255,255,255,0.55)", fontWeight:500 }}>
                            <div style={{ width:4, height:4, borderRadius:"50%", background: active ? p.color : "rgba(255,255,255,0.4)", flexShrink:0 }} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>

              <div style={{ textAlign:"center", marginTop:28 }}>
                <motion.button
                  onClick={handleContinue}
                  whileHover={{ scale: selectedPortal ? 1.04 : 1 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display:"inline-flex", alignItems:"center", gap:8,
                    background: selectedPortal ? "linear-gradient(135deg,#1677FF,#0ea5e9)" : "rgba(255,255,255,0.15)",
                    color:"#fff", border:"none", borderRadius:999,
                    padding:"13px 36px", fontSize:15, fontWeight:700,
                    cursor: selectedPortal ? "pointer" : "not-allowed",
                    boxShadow: selectedPortal ? "0 8px 24px rgba(22,119,255,0.4)" : "none",
                    transition:"all 0.25s",
                  }}
                >
                  Continue as {selectedPortal ? PORTALS.find(p=>p.id===selectedPortal)?.title : "..."}
                  <ArrowRight size={17} />
                </motion.button>
                <p style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginTop:14 }}>
                  Already have an account?{" "}
                  <a href="/login" style={{ color:"rgba(255,255,255,0.75)", fontWeight:600 }}>Sign In</a>
                </p>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Fill Details ── */}
          {step === "details" && portal && (
            <motion.div key="details" initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }} transition={{ duration:0.4 }}>
              <div
                style={{
                  background:"rgba(255,255,255,0.07)",
                  backdropFilter:"blur(32px)",
                  WebkitBackdropFilter:"blur(32px)",
                  border:"1px solid rgba(255,255,255,0.15)",
                  borderRadius:24,
                  padding:"36px 32px",
                  boxShadow:"0 24px 64px rgba(0,0,0,0.3)",
                }}
              >
                {/* Portal badge */}
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
                  <button onClick={() => setStep("role")} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:8, padding:"6px 10px", color:"rgba(255,255,255,0.7)", cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:12 }}>
                    <ChevronLeft size={14} /> Back
                  </button>
                  <div style={{ display:"flex", alignItems:"center", gap:8, background: portal.bg, borderRadius:999, padding:"5px 14px" }}>
                    <portal.icon size={14} color={portal.color} />
                    <span style={{ fontSize:12, fontWeight:700, color: portal.color }}>{portal.title} Portal</span>
                  </div>
                </div>

                <h2 style={{ color:"#fff", fontSize:26, fontWeight:900, marginBottom:6, letterSpacing:"-0.02em" }}>Create your account</h2>
                <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13, marginBottom:28 }}>Fill in your details to get started</p>

                <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <Field label="Full Name" type="text" placeholder="John Doe" value={form.name} onChange={(v) => setForm({...form, name:v})} required />
                  <Field label="Email Address" type="email" placeholder="john@example.com" value={form.email} onChange={(v) => setForm({...form, email:v})} required />
                  <Field label="Phone Number" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(v) => setForm({...form, phone:v})} required />
                  {(portal.id === "hotel-partner" || portal.id === "corporate" || portal.id === "travel-agent") && (
                    <Field label={portal.id === "hotel-partner" ? "Property Name" : portal.id === "corporate" ? "Company Name" : "Agency Name"} type="text" placeholder="Enter name" value={form.org} onChange={(v) => setForm({...form, org:v})} required />
                  )}

                  {/* Password */}
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.6)", letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:6 }}>Password</label>
                    <div style={{ position:"relative" }}>
                      <input
                        type={showPass ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        value={form.password}
                        onChange={(e) => setForm({...form, password:e.target.value})}
                        required
                        style={{ width:"100%", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:12, padding:"12px 44px 12px 14px", fontSize:14, color:"#fff", outline:"none", boxSizing:"border-box" }}
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.5)" }}>
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <label style={{ display:"flex", alignItems:"flex-start", gap:8, cursor:"pointer", marginTop:4 }}>
                    <input type="checkbox" required style={{ marginTop:2, accentColor: portal.color, width:14, height:14, flexShrink:0 }} />
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.55)", lineHeight:1.5 }}>
                      I agree to the <a href="#" style={{ color:"rgba(255,255,255,0.8)", fontWeight:600 }}>Terms of Service</a> and <a href="#" style={{ color:"rgba(255,255,255,0.8)", fontWeight:600 }}>Privacy Policy</a>
                    </span>
                  </label>

                  {errorMessage && (
                    <div style={{ background:"rgba(244,63,94,0.12)", color:"#f43f5e", border:"1px solid rgba(244,63,94,0.25)", borderRadius:12, padding:"12px 14px", marginTop:10, fontSize:13 }}>
                      {errorMessage}
                    </div>
                  )}
                  {successMessage && (
                    <div style={{ background:"rgba(16,185,129,0.12)", color:"#059669", border:"1px solid rgba(16,185,129,0.25)", borderRadius:12, padding:"12px 14px", marginTop:10, fontSize:13 }}>
                      {successMessage}
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    whileHover={{ scale: loading ? 1 : 1.03, boxShadow: loading ? "none" : `0 10px 28px ${portal.color}50` }}
                    whileTap={{ scale: loading ? 1 : 0.97 }}
                    disabled={loading}
                    style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:`linear-gradient(135deg,${portal.color},${portal.color}cc)`, color:"#fff", border:"none", borderRadius:999, padding:"14px", fontSize:15, fontWeight:700, cursor: loading ? "not-allowed" : "pointer", marginTop:6, boxShadow:`0 6px 20px ${portal.color}40`, opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? "Creating account..." : `Create ${portal.title} Account`}
                    {!loading && <ArrowRight size={17} />}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Field({ label, type, placeholder, value, onChange, required }: { label:string; type:string; placeholder:string; value:string; onChange:(v:string)=>void; required?:boolean }) {
  return (
    <div>
      <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.6)", letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:6 }}>{label}</label>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)} required={required}
        style={{ width:"100%", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:12, padding:"12px 14px", fontSize:14, color:"#fff", outline:"none", boxSizing:"border-box" }}
        onFocus={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.4)")}
        onBlur={(e)  => (e.target.style.border = "1px solid rgba(255,255,255,0.15)")}
      />
    </div>
  );
}
