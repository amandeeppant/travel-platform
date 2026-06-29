"use client";
import PortalShell from "@/components/portal/PortalShell";
import { useAuthDisplayName } from "@/lib/authClient";
import { Card } from "@/components/portal/DashboardWidgets";
import { motion } from "framer-motion";
import { User, Globe, Train, Hotel, Plane, Map, Calendar, FileText, Shield, Bot, Zap, Clock } from "lucide-react";

const NAV = [
  { icon: Globe, label: "Dashboard", href: "/portal/traveler" },
  { icon: Train, label: "Destination Discovery", href: "/portal/traveler/destinations" },
  { icon: Hotel, label: "Hotel Search", href: "/portal/traveler/hotels" },
  { icon: Plane, label: "Flight Search", href: "/portal/traveler/flights" },
  { icon: Map, label: "Package Booking", href: "/portal/traveler/packages" },
  { icon: Calendar, label: "Activity Booking", href: "/portal/traveler/activities" },
  { icon: FileText, label: "Visa Assistance", href: "/portal/traveler/visa" },
  { icon: Shield, label: "Travel Insurance", href: "/portal/traveler/insurance" },
  { icon: Bot, label: "AI Travel Planner", href: "/portal/traveler/ai-planner", badge: "NEW" },
  { icon: Zap, label: "AI Travel Assistant", href: "/portal/traveler/ai-assistant", badge: "NEW" },
];

/*
const FLIGHTS = [
  { route: "BOM → DXB", duration: "3h 45m", price: "₹18,200", airline: "Air India", departure: "06:30 AM" },
  { route: "DEL → SIN", duration: "5h 30m", price: "₹22,400", airline: "IndiGo", departure: "09:15 PM" },
  { route: "BLR → LHR", duration: "10h 20m", price: "₹55,000", airline: "British Airways", departure: "02:00 PM" },
];
*/

export default function FlightSearchPage() {
  const displayName = useAuthDisplayName("Traveler");

  return (
    <PortalShell portalName="Traveler" portalColor="#1677FF" portalBg="#EFF6FF" portalIcon={User} navItems={NAV} userName={displayName} userRole="Traveler">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{ background: "linear-gradient(135deg,#1677FF,#0ea5e9)", borderRadius: 20, padding: "28px 32px", marginBottom: 28, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -30, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.75, marginBottom: 6 }}>TRAVELER PORTAL</p>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Flight Search</h1>
        <p style={{ fontSize: 13, opacity: 0.72 }}>Compare fares and book tickets for domestic and international airlines.</p>
      </motion.div>

      <Card style={{ padding: 60, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Clock size={40} color="#1677FF" />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#111", marginBottom: 8 }}>Coming Soon</h2>
        <p style={{ fontSize: 14, color: "#6b7280", maxWidth: 440, lineHeight: 1.6 }}>
          We are currently integrating with GDS flight booking systems to bring you live availability and instant ticket generation. Check back soon!
        </p>
      </Card>
    </PortalShell>
  );
}
