"use client";
import PortalShell from "@/components/portal/PortalShell";
import { useAuthDisplayName } from "@/lib/authClient";
import { StatCard, SectionHeader, Card, Badge, PrimaryButton } from "@/components/portal/DashboardWidgets";
import { motion } from "framer-motion";
import {
  Users, UserCheck, Package, DollarSign,
  FileText, BarChart2, ChevronRight, Star,
  TrendingUp, Phone, Plus, Download
} from "lucide-react";

const NAV = [
  { icon: BarChart2,  label: "Dashboard",          href: "/portal/travel-agent" },
  { icon: Users,      label: "Customer Management", href: "/portal/travel-agent/customers" },
  { icon: Package,    label: "Group Bookings",       href: "/portal/travel-agent/groups" },
  { icon: DollarSign, label: "Commission Tracking",  href: "/portal/travel-agent/commissions" },
  { icon: FileText,   label: "Quotation Generation", href: "/portal/travel-agent/quotations" },
];

const CUSTOMERS = [
  { name:"Vikram Nair",    bookings:14, value:"₹2.4L", status:"Premium", phone:"+91 98001 23456", color:"#7C3AED", bg:"#F5F3FF" },
  { name:"Deepa Iyer",     bookings:8,  value:"₹1.1L", status:"Regular", phone:"+91 97002 34567", color:"#1677FF", bg:"#EFF6FF" },
  { name:"Manish Gupta",   bookings:22, value:"₹5.6L", status:"VIP",     phone:"+91 96003 45678", color:"#D97706", bg:"#FFFBEB" },
  { name:"Kavita Reddy",   bookings:5,  value:"₹0.8L", status:"Regular", phone:"+91 95004 56789", color:"#1677FF", bg:"#EFF6FF" },
  { name:"Suresh Pillai",  bookings:31, value:"₹8.2L", status:"VIP",     phone:"+91 94005 67890", color:"#D97706", bg:"#FFFBEB" },
];

const COMMISSIONS = [
  { type:"Flights",  bookings:45, rate:"5%",  earned:"₹34,200", month:"Dec 2024" },
  { type:"Hotels",   bookings:28, rate:"8%",  earned:"₹51,840", month:"Dec 2024" },
  { type:"Trains",   bookings:63, rate:"3%",  earned:"₹18,900", month:"Dec 2024" },
  { type:"Packages", bookings:12, rate:"10%", earned:"₹87,500", month:"Dec 2024" },
];

export default function TravelAgentPortal() {
  const displayName = useAuthDisplayName("Agent");

  return (
    <PortalShell portalName="Travel Agent" portalColor="#D97706" portalBg="#FFFBEB" portalIcon={UserCheck} navItems={NAV} userName={displayName} userRole="Travel Agent">

      {/* Header */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
        style={{ background:"linear-gradient(135deg,#D97706,#f59e0b)", borderRadius:20, padding:"28px 32px", marginBottom:28, color:"#fff", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-20, top:-30, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
        <p style={{ fontSize:13, fontWeight:600, opacity:0.75, marginBottom:6 }}>Travel Agent Portal</p>
        <h1 style={{ fontSize:26, fontWeight:900, marginBottom:8 }}>{displayName}</h1>
        <p style={{ fontSize:13, opacity:0.72, marginBottom:20 }}>Mumbai · Agent ID: AGT-00482 · Commission tier: Gold (8% avg)</p>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <PrimaryButton label="New Quotation" color="rgba(255,255,255,0.22)" icon={Plus} />
          <PrimaryButton label="Add Customer"  color="rgba(255,255,255,0.15)" icon={Users} />
          <PrimaryButton label="Group Booking" color="rgba(255,255,255,0.15)" icon={Package} />
        </div>
      </motion.div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:14, marginBottom:28 }}>
        <StatCard icon={Users}      label="Total Customers"  value="186"   change="+8"   color="#D97706" bg="#FFFBEB" delay={0.05} />
        <StatCard icon={DollarSign} label="Commission (MTD)" value="₹1.92L" change="+24%" color="#059669" bg="#ECFDF5" delay={0.10} />
        <StatCard icon={Package}    label="Group Bookings"   value="12"    change="+3"   color="#7C3AED" bg="#F5F3FF" delay={0.15} />
        <StatCard icon={TrendingUp} label="Total Revenue"    value="₹48L"  change="+31%" color="#1677FF" bg="#EFF6FF" delay={0.20} />
        <StatCard icon={Star}       label="Agent Rating"     value="4.8"   change="+0.1" color="#D97706" bg="#FFFBEB" delay={0.25} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

        {/* Customers */}
        <div>
          <SectionHeader title="Top Customers" subtitle="Your most valuable clients"
            action={<PrimaryButton label="Add New" color="#D97706" icon={Plus} />}
          />
          <Card>
            {CUSTOMERS.map((c, i) => (
              <div key={c.name} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 18px", borderBottom: i<CUSTOMERS.length-1?"1px solid #f9fafb":"none" }}>
                <div style={{ width:38, height:38, borderRadius:12, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ color:c.color, fontWeight:800, fontSize:14 }}>{c.name[0]}</span>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:"#111" }}>{c.name}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
                    <Phone size={10} color="#9ca3af" />
                    <span style={{ fontSize:11, color:"#9ca3af" }}>{c.phone}</span>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <p style={{ fontSize:13, fontWeight:800, color:"#111" }}>{c.value}</p>
                  <Badge label={c.status} color={c.color} bg={c.bg} />
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Commission */}
        <div>
          <SectionHeader title="Commission Breakdown"  subtitle="December 2024"
            action={<PrimaryButton label="Download" color="#D97706" icon={Download} />}
          />
          <Card>
            {COMMISSIONS.map((c, i) => (
              <div key={c.type} style={{ padding:"14px 18px", borderBottom: i<COMMISSIONS.length-1?"1px solid #f9fafb":"none" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:16 }}>{c.type==="Flights"?"✈️":c.type==="Hotels"?"🏨":c.type==="Trains"?"🚄":"🗺️"}</span>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color:"#111" }}>{c.type}</p>
                      <p style={{ fontSize:11, color:"#9ca3af" }}>{c.bookings} bookings · {c.rate} commission</p>
                    </div>
                  </div>
                  <p style={{ fontSize:15, fontWeight:900, color:"#059669" }}>{c.earned}</p>
                </div>
                <div style={{ height:4, background:"#f0f0f0", borderRadius:999, overflow:"hidden" }}>
                  <motion.div initial={{ width:0 }} animate={{ width:`${(parseInt(c.earned.replace(/[₹,L]/g,""))/870)*100}%` }} transition={{ duration:0.8, delay:i*0.1+0.3 }}
                    style={{ height:"100%", background:"#D97706", borderRadius:999 }} />
                </div>
              </div>
            ))}
            <div style={{ padding:"14px 18px", background:"#FFFBEB", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:13, fontWeight:700, color:"#374151" }}>Total Commission</span>
              <span style={{ fontSize:18, fontWeight:900, color:"#D97706" }}>₹1,92,440</span>
            </div>
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}
