"use client";
import { useState, useEffect } from "react";
import PortalShell from "@/components/portal/PortalShell";
import { useAuthDisplayName } from "@/lib/authClient";
import { StatCard, SectionHeader, Card, Badge } from "@/components/portal/DashboardWidgets";
import { motion } from "framer-motion";
import {
  User, Plane, Train, Hotel, Map, Globe, Shield, Zap,
  Calendar, Clock, MapPin, Star, ChevronRight, Bot, FileText
} from "lucide-react";
import { useRouter } from "next/navigation";

const NAV = [
  { icon: Globe,    label: "Dashboard",          href: "/portal/traveler" },
  { icon: Train,    label: "Destination Discovery", href: "/portal/traveler/destinations" },
  { icon: Hotel,    label: "Hotel Search",        href: "/portal/traveler/hotels" },
  { icon: Plane,    label: "Flight Search",       href: "/portal/traveler/flights" },
  { icon: Map,      label: "Package Booking",     href: "/portal/traveler/packages" },
  { icon: Calendar, label: "Activity Booking",    href: "/portal/traveler/activities" },
  { icon: FileText, label: "Visa Assistance",     href: "/portal/traveler/visa" },
  { icon: Shield,   label: "Travel Insurance",    href: "/portal/traveler/insurance" },
  { icon: Bot,      label: "AI Travel Planner",   href: "/portal/traveler/ai-planner", badge: "NEW" },
  { icon: Zap,      label: "AI Customer Support", href: "/portal/traveler/ai-assistant", badge: "NEW" },
];

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  confirmed: { color: "#16a34a", bg: "#f0fdf4" },
  pending: { color: "#d97706", bg: "#fffbeb" },
  cancelled: { color: "#dc2626", bg: "#fef2f2" },
  processing: { color: "#2563eb", bg: "#eff6ff" },
};

interface BookingItem {
  id: string;
  itemType: string;
  itemId: string;
  status: string;
  createdAt: string;
  checkInDate?: string;
  checkOutDate?: string;
  roomType?: string;
  amount?: number;
}

export default function TravelerPortal() {
  const router = useRouter();
  const displayName = useAuthDisplayName("Rahul Sharma");
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      try {
        const authRaw = localStorage.getItem("travelEaseAuth");
        if (!authRaw) return;
        const token = JSON.parse(authRaw).token;

        const res = await fetch("/api/bookings", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  const totalTrips = bookings.filter(b => b.status.toLowerCase() === "confirmed").length;
  const pendingCount = bookings.filter(b => b.status.toLowerCase() === "pending" || b.status.toLowerCase() === "processing").length;

  return (
    <PortalShell portalName="Traveler" portalColor="#1677FF" portalBg="#EFF6FF" portalIcon={User} navItems={NAV} userName={displayName} userRole="Traveler">

      {/* Welcome */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
        style={{ background:"linear-gradient(135deg,#1677FF 0%,#0ea5e9 100%)", borderRadius:20, padding:"28px 32px", marginBottom:28, color:"#fff", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-20, top:-30, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
        <div style={{ position:"absolute", right:60, bottom:-40, width:140, height:140, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />
        <p style={{ fontSize:13, fontWeight:600, opacity:0.75, marginBottom:6 }}>Welcome back 👋</p>
        <h1 style={{ fontSize:26, fontWeight:900, marginBottom:8, letterSpacing:"-0.02em" }}>{displayName}</h1>
        <p style={{ fontSize:13, opacity:0.72, marginBottom:20 }}>
          You have {totalTrips} upcoming trips and {pendingCount} pending booking{pendingCount === 1 ? "" : "s"}
        </p>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {[{ icon:Train, t:"Book Train", path:"/portal/traveler/destinations" },{ icon:Plane, t:"Book Flight", path:"/portal/traveler/flights" },{ icon:Hotel, t:"Find Hotels", path:"/portal/traveler/hotels" },{ icon:Bot, t:"AI Planner", path:"/portal/traveler/ai-planner" },{ icon:Zap, t:"AI Support", path:"/portal/traveler/ai-assistant" }].map(({icon:I,t,path}) => (
            <button key={t} onClick={() => router.push(path)} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.18)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:999, padding:"7px 14px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", backdropFilter:"blur(8px)" }}>
              <I size={13} /> {t}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:14, marginBottom:28 }}>
        <StatCard icon={Train}  label="Total Trips"       value={String(totalTrips)}    change="+3"  color="#1677FF" bg="#EFF6FF" delay={0.05} />
        <StatCard icon={Star}   label="Reward Points"     value="4,820" change="+120" color="#D97706" bg="#FFFBEB" delay={0.10} />
        <StatCard icon={Shield} label="Active Insurance"  value="1"     color="#059669" bg="#ECFDF5" delay={0.15} />
        <StatCard icon={MapPin} label="Countries Visited" value="4"     change="+1"  color="#7C3AED" bg="#F5F3FF" delay={0.20} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20 }}>

        {/* Recent Bookings */}
        <div>
          <SectionHeader title="Recent Bookings" subtitle="Your latest travel bookings"
            action={<button onClick={() => router.push("/portal/traveler")} style={{ fontSize:12, fontWeight:600, color:"#1677FF", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>View All <ChevronRight size={13} /></button>}
          />
          <Card>
            <div style={{ padding:"0 4px" }}>
              {loading ? (
                <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Loading bookings...</div>
              ) : bookings.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>You don't have any bookings yet.</div>
              ) : (
                bookings.map((b, i) => {
                  const checkinStr = b.checkInDate ? new Date(b.checkInDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "";
                  const checkoutStr = b.checkOutDate ? new Date(b.checkOutDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "";
                  const dateStr = checkinStr ? `${checkinStr} – ${checkoutStr}` : new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                  
                  const isHotel = b.itemType === "hotel" || b.itemType === "room";
                  const routeName = isHotel ? `${b.roomType || "Hotel Room"}` : "Travel booking";
                  const typeIcon = isHotel ? "🏨" : b.itemType === "flight" ? "✈️" : b.itemType === "train" ? "🚄" : "🗺️";
                  const amountStr = b.amount ? `₹${b.amount.toLocaleString()}` : "Free";
                  const statusKey = b.status.toLowerCase();
                  const style = STATUS_STYLE[statusKey] ?? { color: "#374151", bg: "#f3f4f6" };

                  return (
                    <motion.div key={b.id} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.07 }}
                      style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", borderBottom: i<bookings.length-1 ? "1px solid #f9fafb" : "none", gap:12 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, flex:1, minWidth:0 }}>
                        <div style={{ width:36, height:36, borderRadius:10, background:"#EFF6FF", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <span style={{ fontSize:16 }}>{typeIcon}</span>
                        </div>
                        <div style={{ minWidth:0 }}>
                          <p style={{ fontSize:13, fontWeight:700, color:"#111", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{routeName}</p>
                          <p style={{ fontSize:11, color:"#9ca3af" }}>{b.id.substring(0, 8).toUpperCase()} · {dateStr}</p>
                        </div>
                      </div>
                      <div style={{ textAlign:"right", flexShrink:0 }}>
                        <p style={{ fontSize:13, fontWeight:800, color:"#111" }}>{amountStr}</p>
                        <Badge label={b.status.charAt(0).toUpperCase() + b.status.slice(1).toLowerCase()} color={style.color} bg={style.bg} />
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* AI Planner Promo + Upcoming */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* AI Card */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
            style={{ background:"linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius:16, padding:"20px", color:"#fff", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", right:-10, bottom:-10, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }} />
            <Bot size={28} color="#fff" style={{ marginBottom:10 }} />
            <h3 style={{ fontSize:16, fontWeight:800, marginBottom:6 }}>AI Travel Planner</h3>
            <p style={{ fontSize:12, opacity:0.8, marginBottom:14, lineHeight:1.5 }}>Plan your perfect trip in seconds with our AI assistant</p>
            <button onClick={() => router.push("/portal/traveler/ai-planner")} style={{ background:"#fff", color:"#7C3AED", border:"none", borderRadius:999, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              Start Planning →
            </button>
          </motion.div>

          {/* Upcoming Trip */}
          <Card style={{ padding:18 }}>
            <p style={{ fontSize:12, fontWeight:700, color:"#9ca3af", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12 }}>NEXT TRIP</p>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"#EFF6FF", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Plane size={20} color="#1677FF" />
              </div>
              <div>
                <p style={{ fontSize:14, fontWeight:700, color:"#111" }}>BOM → DXB</p>
                <p style={{ fontSize:11, color:"#9ca3af" }}>Jan 5, 2025</p>
              </div>
            </div>
            {[{ icon:Clock, t:"Departs 06:30 AM" },{ icon:MapPin, t:"Terminal 2, BOM" }].map(({icon:I,t}) => (
              <div key={t} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <I size={13} color="#9ca3af" />
                <span style={{ fontSize:12, color:"#6B7280" }}>{t}</span>
              </div>
            ))}
            <button style={{ width:"100%", marginTop:12, background:"#EFF6FF", color:"#1677FF", border:"none", borderRadius:10, padding:"9px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              View Details
            </button>
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}
