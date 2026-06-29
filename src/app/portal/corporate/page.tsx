"use client";
import PortalShell from "@/components/portal/PortalShell";
import { useAuthDisplayName } from "@/lib/authClient";
import { StatCard, SectionHeader, Card, Badge, PrimaryButton } from "@/components/portal/DashboardWidgets";
import { motion } from "framer-motion";
import {
  Briefcase, Users, CheckSquare, FileText,
  PieChart, CreditCard, BarChart2, ChevronRight,
  DollarSign, TrendingUp, Clock, AlertCircle, Plus
} from "lucide-react";

const NAV = [
  { icon: Briefcase,   label: "Dashboard",              href: "/portal/corporate" },
  { icon: Users,       label: "Employee Travel Requests",href: "/portal/corporate/requests" },
  { icon: CheckSquare, label: "Approval Workflow",       href: "/portal/corporate/approvals", badge: "5" },
  { icon: FileText,    label: "Travel Policy",           href: "/portal/corporate/policy" },
  { icon: PieChart,    label: "Budget Monitoring",       href: "/portal/corporate/budget" },
  { icon: CreditCard,  label: "Expense Tracking",        href: "/portal/corporate/expenses" },
  { icon: BarChart2,   label: "Analytics",               href: "/portal/corporate/analytics" },
];

const REQUESTS = [
  { emp:"Ankit Verma",  dept:"Engineering", dest:"Bangalore → Mumbai", date:"Jan 5", type:"Flight", status:"Pending",  amount:"₹8,200",  color:"#d97706", bg:"#fffbeb" },
  { emp:"Neha Singh",   dept:"Sales",       dest:"Delhi → Hyderabad",  date:"Jan 8", type:"Train",  status:"Approved", amount:"₹1,840",  color:"#16a34a", bg:"#f0fdf4" },
  { emp:"Ravi Kumar",   dept:"HR",          dest:"Mumbai Marriott",    date:"Jan 10",type:"Hotel",  status:"Approved", amount:"₹12,000", color:"#16a34a", bg:"#f0fdf4" },
  { emp:"Sonia Patel",  dept:"Finance",     dest:"BOM → SIN",         date:"Jan 15",type:"Flight", status:"Pending",  amount:"₹45,000", color:"#d97706", bg:"#fffbeb" },
  { emp:"Dev Sharma",   dept:"Product",     dest:"Chennai → Pune",    date:"Jan 18",type:"Train",  status:"Rejected", amount:"₹2,100",  color:"#dc2626", bg:"#fef2f2" },
];

export default function CorporatePortal() {
  const displayName = useAuthDisplayName("Traveler");

  return (
    <PortalShell portalName="Corporate" portalColor="#7C3AED" portalBg="#F5F3FF" portalIcon={Briefcase} navItems={NAV} userName={displayName} userRole="Travel Admin">

      {/* Header */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
        style={{ background:"linear-gradient(135deg,#7C3AED,#a855f7)", borderRadius:20, padding:"28px 32px", marginBottom:28, color:"#fff", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-20, top:-30, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
        <p style={{ fontSize:13, fontWeight:600, opacity:0.75, marginBottom:6 }}>Corporate Travel Portal</p>
        <h1 style={{ fontSize:26, fontWeight:900, marginBottom:8 }}>Hi {displayName}, welcome back.</h1>
        <p style={{ fontSize:13, opacity:0.72, marginBottom:20 }}>250 employees · Monthly budget: ₹12,00,000 · 5 pending approvals</p>
        <div style={{ display:"flex", gap:10 }}>
          <PrimaryButton label="New Travel Request" color="rgba(255,255,255,0.22)" icon={Plus} />
          <PrimaryButton label="Pending Approvals (5)" color="rgba(239,68,68,0.5)" icon={AlertCircle} />
        </div>
      </motion.div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:14, marginBottom:28 }}>
        <StatCard icon={Users}      label="Active Travelers"   value="24"    change="+3"   color="#7C3AED" bg="#F5F3FF" delay={0.05} />
        <StatCard icon={DollarSign} label="Budget Used (MTD)"  value="₹7.2L" change="+8%"  color="#D97706" bg="#FFFBEB" delay={0.10} />
        <StatCard icon={Clock}      label="Pending Approvals"  value="5"     color="#DC2626" bg="#FEF2F2" delay={0.15} />
        <StatCard icon={TrendingUp} label="Savings This Month" value="₹1.8L" change="+22%" color="#059669" bg="#ECFDF5" delay={0.20} />
        <StatCard icon={CheckSquare}label="Approved Trips"     value="142"   change="+12"  color="#1677FF" bg="#EFF6FF" delay={0.25} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20 }}>

        {/* Requests Table */}
        <div>
          <SectionHeader title="Travel Requests" subtitle="Pending and recent employee requests"
            action={<PrimaryButton label="View All" color="#7C3AED" icon={ChevronRight} />}
          />
          <Card>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"#f9fafb", borderBottom:"1px solid #f0f0f0" }}>
                    {["Employee","Dept","Destination","Date","Type","Amount","Status"].map(h => (
                      <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {REQUESTS.map((r, i) => (
                    <tr key={i} style={{ borderBottom:"1px solid #f9fafb" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background="#f9fafb")}
                      onMouseLeave={(e) => (e.currentTarget.style.background="transparent")}>
                      <td style={{ padding:"12px 14px", fontSize:13, fontWeight:600, color:"#111", whiteSpace:"nowrap" }}>{r.emp}</td>
                      <td style={{ padding:"12px 14px", fontSize:11, color:"#9ca3af", whiteSpace:"nowrap" }}>{r.dept}</td>
                      <td style={{ padding:"12px 14px", fontSize:12, color:"#374151", whiteSpace:"nowrap" }}>{r.dest}</td>
                      <td style={{ padding:"12px 14px", fontSize:12, color:"#6B7280", whiteSpace:"nowrap" }}>{r.date}</td>
                      <td style={{ padding:"12px 14px" }}><span style={{ fontSize:11, background:"#EFF6FF", color:"#1677FF", fontWeight:700, padding:"3px 8px", borderRadius:999 }}>{r.type}</span></td>
                      <td style={{ padding:"12px 14px", fontSize:13, fontWeight:700, color:"#111", whiteSpace:"nowrap" }}>{r.amount}</td>
                      <td style={{ padding:"12px 14px" }}><Badge label={r.status} color={r.color} bg={r.bg} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Budget & Policy */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <Card style={{ padding:20 }}>
            <p style={{ fontSize:12, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:16 }}>Budget Overview</p>
            {[
              { dept:"Engineering", used:85, budget:"₹3.2L", color:"#7C3AED" },
              { dept:"Sales",       used:62, budget:"₹2.8L", color:"#1677FF" },
              { dept:"HR",          used:40, budget:"₹1.5L", color:"#059669" },
              { dept:"Finance",     used:91, budget:"₹2.0L", color:"#DC2626" },
            ].map((d) => (
              <div key={d.dept} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>{d.dept}</span>
                  <span style={{ fontSize:11, color:"#9ca3af" }}>{d.used}% of {d.budget}</span>
                </div>
                <div style={{ height:6, background:"#f0f0f0", borderRadius:999, overflow:"hidden" }}>
                  <motion.div initial={{ width:0 }} animate={{ width:`${d.used}%` }} transition={{ duration:0.8, delay:0.3 }}
                    style={{ height:"100%", background:d.used>85?`#DC2626`:d.color, borderRadius:999 }} />
                </div>
              </div>
            ))}
          </Card>

          <Card style={{ padding:20 }}>
            <p style={{ fontSize:12, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>Policy Highlights</p>
            {[
              { icon:"✈️", text:"Flights: Economy class only" },
              { icon:"🏨", text:"Hotels: Max ₹6,000/night" },
              { icon:"🚄", text:"Trains: 3A and above" },
              { icon:"📋", text:"Advance booking: 7+ days" },
            ].map((p) => (
              <div key={p.text} style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:10 }}>
                <span style={{ fontSize:14 }}>{p.icon}</span>
                <span style={{ fontSize:12, color:"#6B7280", lineHeight:1.4 }}>{p.text}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}
