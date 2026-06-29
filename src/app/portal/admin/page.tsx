"use client";
import PortalShell from "@/components/portal/PortalShell";
import { useAuthDisplayName } from "@/lib/authClient";
import { StatCard, SectionHeader, Card, Badge, PrimaryButton } from "@/components/portal/DashboardWidgets";
import { motion } from "framer-motion";
import {
  Shield, Users, Building2, BookOpen, BarChart2,
  FileText, AlertTriangle, ChevronRight,
  DollarSign, TrendingUp, Activity, CheckCircle2,
  XCircle, Clock, Eye
} from "lucide-react";

const NAV = [
  { icon: BarChart2,     label: "Dashboard",         href: "/portal/admin" },
  { icon: Users,         label: "User Management",   href: "/portal/admin/users" },
  { icon: Building2,     label: "Hotel Approval",    href: "/portal/admin/hotels", badge: "8" },
  { icon: BookOpen,      label: "Booking Monitoring", href: "/portal/admin/bookings" },
  { icon: DollarSign,    label: "Revenue Analytics", href: "/portal/admin/revenue" },
  { icon: FileText,      label: "Content Management",href: "/portal/admin/content" },
  { icon: AlertTriangle, label: "Fraud Detection",   href: "/portal/admin/fraud", badge: "3" },
];

const HOTEL_APPROVALS = [
  { name:"Sea Pearl Resort",   city:"Goa",       rooms:85,  owner:"Raj Mehta",  status:"Pending",  submitted:"Dec 20" },
  { name:"Mountain View Inn",  city:"Manali",    rooms:32,  owner:"Anita Singh", status:"Review",   submitted:"Dec 21" },
  { name:"City Grand Hotel",   city:"Delhi",     rooms:220, owner:"Vikram Co.",  status:"Pending",  submitted:"Dec 22" },
  { name:"Beachside Villa",    city:"Chennai",   rooms:48,  owner:"Priya Nair",  status:"Approved", submitted:"Dec 18" },
  { name:"Heritage Palace",    city:"Jaipur",    rooms:150, owner:"Royal Trust", status:"Pending",  submitted:"Dec 23" },
];

const FRAUD_ALERTS = [
  { id:"TXN-8821", desc:"Multiple bookings from same IP", severity:"High",   time:"2 hrs ago" },
  { id:"TXN-8756", desc:"Unusual refund pattern detected", severity:"Medium", time:"5 hrs ago" },
  { id:"TXN-8690", desc:"Account credential mismatch",    severity:"High",   time:"8 hrs ago" },
];

export default function AdminPortal() {
  const displayName = useAuthDisplayName("Administrator");

  return (
    <PortalShell portalName="Administration" portalColor="#DC2626" portalBg="#FEF2F2" portalIcon={Shield} navItems={NAV} userName={displayName} userRole="Administrator">

      {/* Header */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
        style={{ background:"linear-gradient(135deg,#DC2626,#ef4444)", borderRadius:20, padding:"28px 32px", marginBottom:28, color:"#fff", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-20, top:-30, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
        <p style={{ fontSize:13, fontWeight:600, opacity:0.75, marginBottom:6 }}>Administration Portal</p>
        <h1 style={{ fontSize:26, fontWeight:900, marginBottom:8 }}>Hello {displayName}</h1>
        <p style={{ fontSize:13, opacity:0.72, marginBottom:20 }}>8 hotels pending approval · 3 fraud alerts · System status: Healthy ✅</p>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <PrimaryButton label="Hotel Approvals (8)" color="rgba(255,255,255,0.22)" icon={Building2} />
          <PrimaryButton label="Fraud Alerts (3)"    color="rgba(255,165,0,0.4)"    icon={AlertTriangle} />
        </div>
      </motion.div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:14, marginBottom:28 }}>
        <StatCard icon={Users}      label="Total Users"       value="1.24M"  change="+2.4K" color="#1677FF" bg="#EFF6FF" delay={0.05} />
        <StatCard icon={Building2}  label="Listed Hotels"     value="8,420"  change="+124"  color="#059669" bg="#ECFDF5" delay={0.10} />
        <StatCard icon={BookOpen}   label="Today's Bookings"  value="14,820" change="+8%"   color="#D97706" bg="#FFFBEB" delay={0.15} />
        <StatCard icon={DollarSign} label="Revenue (Today)"   value="₹2.8Cr" change="+12%"  color="#DC2626" bg="#FEF2F2" delay={0.20} />
        <StatCard icon={Activity}   label="API Uptime"        value="99.9%"  color="#059669" bg="#ECFDF5" delay={0.25} />
        <StatCard icon={TrendingUp} label="Monthly Revenue"   value="₹84Cr"  change="+18%"  color="#7C3AED" bg="#F5F3FF" delay={0.30} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20 }}>

        {/* Hotel Approvals */}
        <div>
          <SectionHeader title="Hotel Approval Queue" subtitle="Properties awaiting verification"
            action={<PrimaryButton label="View All" color="#DC2626" icon={ChevronRight} />}
          />
          <Card>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"#f9fafb", borderBottom:"1px solid #f0f0f0" }}>
                    {["Property","City","Rooms","Owner","Submitted","Status","Action"].map(h => (
                      <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HOTEL_APPROVALS.map((h, i) => (
                    <tr key={i} style={{ borderBottom:"1px solid #f9fafb" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background="#f9fafb")}
                      onMouseLeave={(e) => (e.currentTarget.style.background="transparent")}>
                      <td style={{ padding:"11px 14px", fontSize:13, fontWeight:600, color:"#111", whiteSpace:"nowrap" }}>{h.name}</td>
                      <td style={{ padding:"11px 14px", fontSize:12, color:"#6B7280" }}>{h.city}</td>
                      <td style={{ padding:"11px 14px", fontSize:12, color:"#6B7280" }}>{h.rooms}</td>
                      <td style={{ padding:"11px 14px", fontSize:12, color:"#6B7280", whiteSpace:"nowrap" }}>{h.owner}</td>
                      <td style={{ padding:"11px 14px", fontSize:11, color:"#9ca3af", whiteSpace:"nowrap" }}>{h.submitted}</td>
                      <td style={{ padding:"11px 14px" }}>
                        <Badge label={h.status} color={h.status==="Approved"?"#16a34a":h.status==="Pending"?"#d97706":"#1677FF"} bg={h.status==="Approved"?"#f0fdf4":h.status==="Pending"?"#fffbeb":"#eff6ff"} />
                      </td>
                      <td style={{ padding:"11px 14px" }}>
                        <div style={{ display:"flex", gap:4 }}>
                          <button style={{ background:"#f0fdf4", border:"none", borderRadius:6, padding:"4px 8px", cursor:"pointer", display:"flex", alignItems:"center", gap:3, fontSize:11, fontWeight:600, color:"#16a34a" }}>
                            <CheckCircle2 size={11} /> Approve
                          </button>
                          <button style={{ background:"#fef2f2", border:"none", borderRadius:6, padding:"4px 8px", cursor:"pointer", display:"flex", alignItems:"center", gap:3, fontSize:11, fontWeight:600, color:"#dc2626" }}>
                            <XCircle size={11} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Fraud Alerts + System Health */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* Fraud Alerts */}
          <Card style={{ padding:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <p style={{ fontSize:13, fontWeight:800, color:"#111" }}>🚨 Fraud Alerts</p>
              <Badge label="3 Active" color="#DC2626" bg="#FEF2F2" />
            </div>
            {FRAUD_ALERTS.map((a, i) => (
              <div key={a.id} style={{ background: a.severity==="High"?"#fef2f2":"#fffbeb", borderRadius:10, padding:"10px 12px", marginBottom:8, border:`1px solid ${a.severity==="High"?"#fecaca":"#fde68a"}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:11, fontWeight:700, color: a.severity==="High"?"#dc2626":"#d97706", fontFamily:"monospace" }}>{a.id}</span>
                  <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                    <Clock size={10} color="#9ca3af" />
                    <span style={{ fontSize:10, color:"#9ca3af" }}>{a.time}</span>
                  </div>
                </div>
                <p style={{ fontSize:12, color:"#374151", lineHeight:1.4 }}>{a.desc}</p>
                <button style={{ marginTop:6, fontSize:11, fontWeight:700, color: a.severity==="High"?"#dc2626":"#d97706", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:3 }}>
                  <Eye size={11} /> Investigate
                </button>
              </div>
            ))}
          </Card>

          {/* System Health */}
          <Card style={{ padding:20 }}>
            <p style={{ fontSize:12, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>System Health</p>
            {[
              { service:"API Gateway",    status:"Healthy",  latency:"42ms",  uptime:"99.9%" },
              { service:"Database",       status:"Healthy",  latency:"8ms",   uptime:"100%" },
              { service:"Payment Gateway",status:"Healthy",  latency:"120ms", uptime:"99.7%" },
              { service:"Email Service",  status:"Warning",  latency:"890ms", uptime:"97.2%" },
            ].map((s) => (
              <div key={s.service} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #f9fafb" }}>
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background: s.status==="Healthy"?"#16a34a":"#d97706", boxShadow:`0 0 6px ${s.status==="Healthy"?"#16a34a":"#d97706"}` }} />
                  <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>{s.service}</span>
                </div>
                <div style={{ textAlign:"right" }}>
                  <p style={{ fontSize:11, fontWeight:700, color:"#111" }}>{s.latency}</p>
                  <p style={{ fontSize:10, color:"#9ca3af" }}>{s.uptime}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}
