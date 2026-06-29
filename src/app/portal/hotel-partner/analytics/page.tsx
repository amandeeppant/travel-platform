"use client";
import PortalShell from "@/components/portal/PortalShell";
import { useAuthDisplayName } from "@/lib/authClient";
import { StatCard, SectionHeader, Card, Badge, PrimaryButton } from "@/components/portal/DashboardWidgets";
import { motion } from "framer-motion";
import { Building2, LayoutDashboard, Package, BookOpen, BarChart2, DollarSign, Settings, Activity, TrendingUp, TrendingDown, Eye, BarChart, Sparkles } from "lucide-react";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/portal/hotel-partner" },
  { icon: Building2, label: "Property Registration", href: "/portal/hotel-partner/register" },
  { icon: Package, label: "Inventory Management", href: "/portal/hotel-partner/inventory" },
  { icon: BookOpen, label: "Booking Management", href: "/portal/hotel-partner/bookings" },
  { icon: DollarSign, label: "Revenue Dashboard", href: "/portal/hotel-partner/revenue" },
  { icon: Settings, label: "Pricing Management", href: "/portal/hotel-partner/pricing" },
  { icon: BarChart2, label: "Analytics Dashboard", href: "/portal/hotel-partner/analytics" },
];

const INSIGHTS = [
  { title: "Most popular room type", value: "Deluxe Suite", icon: Sparkles },
  { title: "Peak booking hour", value: "6PM - 8PM", icon: Eye },
  { title: "Top source", value: "Direct website", icon: TrendingUp },
];

const KPI = [
  { label: "Conversion Rate", value: "12.4%", change: "+1.2%" },
  { label: "Repeat Guests", value: "24%", change: "+2.1%" },
  { label: "Guest Satisfaction", value: "4.7/5", change: "+0.1" },
];

export default function AnalyticsDashboardPage() {
  const displayName = useAuthDisplayName("Hotel Partner");

  return (
    <PortalShell portalName="Hotel Partner" portalColor="#059669" portalBg="#ECFDF5" portalIcon={Building2} navItems={NAV} userName={displayName} userRole="Property Manager">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{ background: "linear-gradient(135deg,#059669,#10b981)", borderRadius: 20, padding: "26px 30px", marginBottom: 28, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -16, top: -28, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.75, marginBottom: 6 }}>HOTEL PARTNER PORTAL</p>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Analytics Dashboard</h1>
        <p style={{ fontSize: 13, opacity: 0.72 }}>Explore performance trends, guest behavior, and occupancy insights in one place.</p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard icon={Activity} label="Website Views" value="12.8K" change="+9%" color="#059669" bg="#ECFDF5" delay={0.05} />
        <StatCard icon={Eye} label="Conversion Rate" value="12.4%" change="+1.2%" color="#1677FF" bg="#EFF6FF" delay={0.1} />
        <StatCard icon={TrendingUp} label="Repeat Guests" value="24%" change="+2.1%" color="#D97706" bg="#FFFBEB" delay={0.15} />
        <StatCard icon={BarChart} label="Satisfaction" value="4.7" change="+0.1" color="#7C3AED" bg="#F5F3FF" delay={0.2} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        <Card>
          <SectionHeader title="Key performance indicators" subtitle="Actionable hotel analytics" action={<PrimaryButton label="Refresh Data" color="#059669" />} />
          <div style={{ display: "grid", gap: 16, padding: "0 18px 18px" }}>
            {KPI.map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderRadius: 16, background: "#f8fafc", border: "1px solid #e5e7eb" }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Weekly progress</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 18, fontWeight: 900, color: "#111" }}>{item.value}</p>
                  <Badge label={item.change} color="#16a34a" bg="#ecfdf5" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 24 }}>
          <SectionHeader title="Insights" subtitle="Latest audience and booking trends" />
          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            {INSIGHTS.map((insight) => (
              <div key={insight.title} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, background: "#f8fafc", border: "1px solid #e5e7eb" }}>
                <insight.icon size={18} color="#059669" />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{insight.title}</p>
                  <p style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>{insight.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PortalShell>
  );
}
