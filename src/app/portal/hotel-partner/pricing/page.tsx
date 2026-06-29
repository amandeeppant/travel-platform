"use client";
import PortalShell from "@/components/portal/PortalShell";
import { useAuthDisplayName } from "@/lib/authClient";
import { StatCard, SectionHeader, Card, Badge, PrimaryButton } from "@/components/portal/DashboardWidgets";
import { motion } from "framer-motion";
import { Building2, LayoutDashboard, Package, BookOpen, BarChart2, DollarSign, Settings, Tag, DollarSign as Dollar, ArrowUpRight, ArrowDownRight, Percent } from "lucide-react";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/portal/hotel-partner" },
  { icon: Building2, label: "Property Registration", href: "/portal/hotel-partner/register" },
  { icon: Package, label: "Inventory Management", href: "/portal/hotel-partner/inventory" },
  { icon: BookOpen, label: "Booking Management", href: "/portal/hotel-partner/bookings" },
  { icon: DollarSign, label: "Revenue Dashboard", href: "/portal/hotel-partner/revenue" },
  { icon: Settings, label: "Pricing Management", href: "/portal/hotel-partner/pricing" },
  { icon: BarChart2, label: "Analytics Dashboard", href: "/portal/hotel-partner/analytics" },
];

const PRICING_RULES = [
  { room: "Deluxe Suite", current: "₹4,500", change: "+3%", demand: "High" },
  { room: "Standard Room", current: "₹2,500", change: "0%", demand: "Medium" },
  { room: "Ocean View", current: "₹6,000", change: "+5%", demand: "High" },
  { room: "Penthouse", current: "₹15,000", change: "-2%", demand: "Low" },
];

const RULES = [
  { title: "Seasonal pricing", description: "Apply higher rates during peak travel months." },
  { title: "Minimum length of stay", description: "Encourage longer stays for weekend bookings." },
  { title: "Channel parity", description: "Keep rates aligned across OTA channels." },
];

export default function PricingManagementPage() {
  const displayName = useAuthDisplayName("Hotel Partner");

  return (
    <PortalShell portalName="Hotel Partner" portalColor="#059669" portalBg="#ECFDF5" portalIcon={Building2} navItems={NAV} userName={displayName} userRole="Property Manager">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{ background: "linear-gradient(135deg,#059669,#10b981)", borderRadius: 20, padding: "26px 30px", marginBottom: 28, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -16, top: -28, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.75, marginBottom: 6 }}>HOTEL PARTNER PORTAL</p>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Pricing Management</h1>
        <p style={{ fontSize: 13, opacity: 0.72 }}>Control room pricing, monitor demand, and keep offers aligned with your occupancy goals.</p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard icon={Tag} label="Rate Plans Active" value="18" color="#059669" bg="#ECFDF5" delay={0.05} />
        <StatCard icon={Dollar} label="Price Changes" value="+5" change="This week" color="#1677FF" bg="#EFF6FF" delay={0.1} />
        <StatCard icon={ArrowUpRight} label="High Demand" value="4" change="Rooms" color="#D97706" bg="#FFFBEB" delay={0.15} />
        <StatCard icon={ArrowDownRight} label="Reduced Rates" value="2" change="Rooms" color="#dc2626" bg="#fee2e2" delay={0.2} />
      </div>

      <div style={{ display: "grid", gap: 20 }}>
        <Card>
          <SectionHeader title="Current Rate Rules" subtitle="Review auto-pricing and policy settings" action={<PrimaryButton label="Create Rule" color="#059669" />} />
          <div style={{ display: "grid", gap: 12, padding: "0 18px 18px" }}>
            {RULES.map((rule) => (
              <div key={rule.title} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "14px 16px", borderRadius: 14, background: "#f8fafc", border: "1px solid #e5e7eb" }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{rule.title}</p>
                  <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{rule.description}</p>
                </div>
                <Badge label="Active" color="#16a34a" bg="#ecfdf5" />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Room Pricing" subtitle="Rate overview by room type" />
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  {["Room Type", "Current Rate", "Demand", "Status"].map((heading) => (
                    <th key={heading} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRICING_RULES.map((rule) => (
                  <tr key={rule.room} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700 }}>{rule.room}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#111" }}>{rule.current}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>{rule.demand}</td>
                    <td style={{ padding: "14px 16px" }}><Badge label={rule.change} color={rule.change.startsWith("+") ? "#16a34a" : "#dc2626"} bg={rule.change.startsWith("+") ? "#ecfdf5" : "#fee2e2"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PortalShell>
  );
}
