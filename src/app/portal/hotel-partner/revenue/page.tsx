"use client";
import PortalShell from "@/components/portal/PortalShell";
import { useAuthDisplayName } from "@/lib/authClient";
import { StatCard, SectionHeader, Card, Badge, PrimaryButton } from "@/components/portal/DashboardWidgets";
import { motion } from "framer-motion";
import { Building2, LayoutDashboard, Package, BookOpen, BarChart2, DollarSign, Settings, TrendingUp, TrendingDown, Clock, ArrowUpRight } from "lucide-react";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/portal/hotel-partner" },
  { icon: Building2, label: "Property Registration", href: "/portal/hotel-partner/register" },
  { icon: Package, label: "Inventory Management", href: "/portal/hotel-partner/inventory" },
  { icon: BookOpen, label: "Booking Management", href: "/portal/hotel-partner/bookings" },
  { icon: DollarSign, label: "Revenue Dashboard", href: "/portal/hotel-partner/revenue" },
  { icon: Settings, label: "Pricing Management", href: "/portal/hotel-partner/pricing" },
  { icon: BarChart2, label: "Analytics Dashboard", href: "/portal/hotel-partner/analytics" },
];

const REVENUE_METRICS = [
  { label: "Monthly Revenue", value: "₹8.4L", change: "+18%", color: "#059669", bg: "#ECFDF5" },
  { label: "Average Daily Rate", value: "₹6,800", change: "+6%", color: "#1677FF", bg: "#EFF6FF" },
  { label: "RevPAR", value: "₹5,100", change: "+10%", color: "#D97706", bg: "#FFFBEB" },
  { label: "Forecast", value: "₹10.2L", change: "+12%", color: "#7C3AED", bg: "#F5F3FF" },
];

const REVENUE_STREAMS = [
  { label: "Room Revenue", amount: "₹7.1L", trend: "+22%" },
  { label: "F&B Sales", amount: "₹1.0L", trend: "+8%" },
  { label: "Events & Banquets", amount: "₹30K", trend: "-2%" },
];

export default function RevenueDashboardPage() {
  const displayName = useAuthDisplayName("Grand Palace");

  return (
    <PortalShell portalName="Hotel Partner" portalColor="#059669" portalBg="#ECFDF5" portalIcon={Building2} navItems={NAV} userName={displayName} userRole="Property Manager">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{ background: "linear-gradient(135deg,#059669,#10b981)", borderRadius: 20, padding: "26px 30px", marginBottom: 28, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -16, top: -28, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.75, marginBottom: 6 }}>HOTEL PARTNER PORTAL</p>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Revenue Dashboard</h1>
        <p style={{ fontSize: 13, opacity: 0.72 }}>Monitor hotel revenue performance and compare results across channels and time periods.</p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14, marginBottom: 28 }}>
        {REVENUE_METRICS.map((metric) => (
          <StatCard key={metric.label} icon={TrendingUp} label={metric.label} value={metric.value} change={metric.change} color={metric.color} bg={metric.bg} delay={0.05} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <Card>
          <SectionHeader title="Revenue Breakdown" subtitle="Room, F&B and events contribution" action={<PrimaryButton label="Download report" color="#059669" />} />
          <div style={{ display: "grid", gap: 14 }}>
            {REVENUE_STREAMS.map((stream) => (
              <div key={stream.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", background: "#f8fafc", borderRadius: 16 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{stream.label}</p>
                  <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Performance vs last month</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 16, fontWeight: 900, color: "#111" }}>{stream.amount}</p>
                  <Badge label={stream.trend} color={stream.trend.startsWith("+") ? "#16a34a" : "#dc2626"} bg={stream.trend.startsWith("+") ? "#ecfdf5" : "#fee2e2"} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 24 }}>
          <SectionHeader title="Payment Status" subtitle="Track settled and pending invoices" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <p style={{ fontSize: 12, color: "#6b7280" }}>Settled invoices</p>
                <p style={{ fontSize: 22, fontWeight: 900, color: "#111" }}>126</p>
              </div>
              <div style={{ textAlign: "right" }}><Badge label="+9%" color="#16a34a" bg="#ecfdf5" /></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <p style={{ fontSize: 12, color: "#6b7280" }}>Pending payments</p>
                <p style={{ fontSize: 22, fontWeight: 900, color: "#111" }}>14</p>
              </div>
              <div style={{ textAlign: "right" }}><Badge label="-5%" color="#dc2626" bg="#fee2e2" /></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 18 }}>
              <PrimaryButton label="Sync ledger" color="#059669" />
              <PrimaryButton label="View invoices" color="#10b981" />
            </div>
          </div>
        </Card>
      </div>
    </PortalShell>
  );
}
