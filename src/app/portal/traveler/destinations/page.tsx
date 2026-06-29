"use client";
import PortalShell from "@/components/portal/PortalShell";
import { useAuthDisplayName } from "@/lib/authClient";
import { StatCard, SectionHeader, Card, Badge, PrimaryButton } from "@/components/portal/DashboardWidgets";
import { motion } from "framer-motion";
import { User, Globe, Train, Hotel, Plane, Map, Calendar, FileText, Shield, Bot, Zap, Sparkles, MapPin, ArrowRight } from "lucide-react";

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

const DESTINATIONS = [
  { name: "Goa", description: "Beach escapes and nightlife", tag: "Beach" },
  { name: "Jaipur", description: "Heritage palaces and forts", tag: "Culture" },
  { name: "Manali", description: "Mountain retreats and adventure", tag: "Hills" },
  { name: "Udaipur", description: "Romantic lake city", tag: "Luxury" },
];

export default function DestinationDiscoveryPage() {
  const displayName = useAuthDisplayName("Traveler");

  return (
    <PortalShell portalName="Traveler" portalColor="#1677FF" portalBg="#EFF6FF" portalIcon={User} navItems={NAV} userName={displayName} userRole="Traveler">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{ background: "linear-gradient(135deg,#1677FF,#0ea5e9)", borderRadius: 20, padding: "28px 32px", marginBottom: 28, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -30, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.75, marginBottom: 6 }}>TRAVELER PORTAL</p>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Destination Discovery</h1>
        <p style={{ fontSize: 13, opacity: 0.72 }}>Explore curated destinations for your next adventure.</p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard icon={Sparkles} label="Curated Destinations" value="24" color="#1677FF" bg="#EFF6FF" delay={0.05} />
        <StatCard icon={MapPin} label="Top Trending" value="Goa" color="#059669" bg="#ECFDF5" delay={0.1} />
        <StatCard icon={ArrowRight} label="Fastest Booking" value="2 min" color="#D97706" bg="#FFFBEB" delay={0.15} />
      </div>

      <Card>
        <SectionHeader title="Recommended Destinations" subtitle="Handpicked for your next getaway" />
        <div style={{ display: "grid", gap: 12, padding: "0 18px 18px" }}>
          {DESTINATIONS.map((destination) => (
            <div key={destination.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 18px", background: "#f8fafc", borderRadius: 16, border: "1px solid #e5e7eb" }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>{destination.name}</p>
                <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{destination.description}</p>
              </div>
              <Badge label={destination.tag} color="#2563eb" bg="#eff6ff" />
            </div>
          ))}
        </div>
      </Card>
    </PortalShell>
  );
}
