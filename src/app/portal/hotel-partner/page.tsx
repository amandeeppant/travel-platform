"use client";
import { useState, useEffect } from "react";
import PortalShell from "@/components/portal/PortalShell";
import { useAuthDisplayName } from "@/lib/authClient";
import { StatCard, SectionHeader, Card, Badge, PrimaryButton } from "@/components/portal/DashboardWidgets";
import { motion } from "framer-motion";
import {
  Building2, LayoutDashboard, Package, BookOpen,
  BarChart2, DollarSign, Settings, ChevronRight,
  TrendingUp, Star, Users, BedDouble, Plus
} from "lucide-react";
import { useRouter } from "next/navigation";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard",           href: "/portal/hotel-partner" },
  { icon: Building2,       label: "Property Registration", href: "/portal/hotel-partner/register" },
  { icon: Package,         label: "Inventory Management", href: "/portal/hotel-partner/inventory" },
  { icon: BookOpen,        label: "Booking Management",   href: "/portal/hotel-partner/bookings" },
  { icon: DollarSign,      label: "Revenue Dashboard",   href: "/portal/hotel-partner/revenue" },
  { icon: Settings,        label: "Pricing Management",  href: "/portal/hotel-partner/pricing" },
  { icon: BarChart2,       label: "Analytics Dashboard", href: "/portal/hotel-partner/analytics" },
];

interface BookingItem {
  id: string;
  guestName?: string;
  roomType?: string;
  checkInDate?: string;
  checkOutDate?: string;
  amount?: number;
  status: string;
  user?: {
    name: string;
  };
}

interface RoomItem {
  id: string;
  type: string;
  status: string;
}

export default function HotelPartnerPortal() {
  const router = useRouter();
  const displayName = useAuthDisplayName("Manager");
  const [hotel, setHotel] = useState<any>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const authRaw = localStorage.getItem("travelEaseAuth");
        if (!authRaw) return;
        const token = JSON.parse(authRaw).token;

        // Fetch hotel profile
        const hotelRes = await fetch("/api/hotel-partner/property", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const hotelData = await hotelRes.json();
        setHotel(hotelData.hotel || null);

        // Fetch bookings
        const bookingsRes = await fetch("/api/hotel-partner/bookings", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.bookings || []);

        // Fetch rooms
        const roomsRes = await fetch("/api/hotel-partner/rooms", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const roomsData = await roomsRes.json();
        setRooms(roomsData.rooms || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Compute stats
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === "Occupied").length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Active guests today
  const guestsToday = bookings.filter(b => {
    if (b.status.toLowerCase() !== "confirmed" || !b.checkInDate || !b.checkOutDate) return false;
    const now = new Date();
    return new Date(b.checkInDate) <= now && new Date(b.checkOutDate) >= now;
  }).length;

  // Monthly Revenue from confirmed bookings
  const monthlyRevenue = bookings
    .filter(b => b.status.toLowerCase() === "confirmed" && b.amount)
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  // Format revenue as lakhs/thousands
  const formatRevenue = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)}L`;
    }
    return `₹${val.toLocaleString()}`;
  };

  // Group rooms by type for occupancy card
  const roomTypes = Array.from(new Set(rooms.map(r => r.type)));
  const occupancyByType = roomTypes.map(type => {
    const totalType = rooms.filter(r => r.type === type).length;
    const occupiedType = rooms.filter(r => r.type === type && r.status === "Occupied").length;
    return {
      type,
      total: totalType,
      booked: occupiedType,
      color: type.includes("Suite") ? "#059669" : type.includes("Penthouse") ? "#7C3AED" : type.includes("Deluxe") ? "#D97706" : "#1677FF"
    };
  });

  const recentBookings = bookings.slice(0, 5);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#fafafa" }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#059669" }}>Loading partner dashboard...</p>
      </div>
    );
  }

  return (
    <PortalShell portalName="Hotel Partner" portalColor="#059669" portalBg="#ECFDF5" portalIcon={Building2} navItems={NAV} userName={displayName} userRole="Property Manager">

      {/* Header Banner */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
        style={{ background:"linear-gradient(135deg,#059669,#10b981)", borderRadius:20, padding:"28px 32px", marginBottom:28, color:"#fff", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-20, top:-30, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
        <p style={{ fontSize:13, fontWeight:600, opacity:0.75, marginBottom:6 }}>Hotel Partner Dashboard</p>
        <h1 style={{ fontSize:26, fontWeight:900, marginBottom:8, letterSpacing:"-0.02em" }}>{hotel?.name || displayName}</h1>
        <p style={{ fontSize:13, opacity:0.72, marginBottom:20 }}>
          {hotel?.address || "Mumbai, Maharashtra"} · {hotel?.category || "4 ⭐"} · {totalRooms} Rooms
        </p>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <PrimaryButton label="Add New Room" color="rgba(255,255,255,0.25)" icon={Plus} onClick={() => router.push("/portal/hotel-partner/inventory")} />
          <PrimaryButton label="View Analytics" color="rgba(255,255,255,0.15)" icon={BarChart2} onClick={() => router.push("/portal/hotel-partner/analytics")} />
        </div>
      </motion.div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:14, marginBottom:28 }}>
        <StatCard icon={BedDouble}   label="Total Rooms"      value={String(totalRooms)}     color="#059669" bg="#ECFDF5" delay={0.05} />
        <StatCard icon={Users}       label="Guests Today"     value={String(guestsToday)}      change="+12"  color="#1677FF" bg="#EFF6FF" delay={0.10} />
        <StatCard icon={DollarSign}  label="Revenue (Month)"  value={formatRevenue(monthlyRevenue)}   change="+18%" color="#D97706" bg="#FFFBEB" delay={0.15} />
        <StatCard icon={Star}        label="Avg. Rating"      value={hotel?.rating ? String(hotel.rating) : "5.0"}     change="+0.2" color="#7C3AED" bg="#F5F3FF" delay={0.20} />
        <StatCard icon={TrendingUp}  label="Occupancy Rate"   value={`${occupancyRate}%`}     change="+5%"  color="#059669" bg="#ECFDF5" delay={0.25} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20 }}>

        {/* Bookings Table */}
        <div>
          <SectionHeader title="Recent Bookings" subtitle="Manage incoming reservations"
            action={<PrimaryButton label="View All" color="#059669" icon={ChevronRight} onClick={() => router.push("/portal/hotel-partner/bookings")} />}
          />
          <Card>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"#f9fafb", borderBottom:"1px solid #f0f0f0" }}>
                    {["Guest","Room Type","Check-in","Check-out","Amount","Status"].map(h => (
                      <th key={h} style={{ padding:"11px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "30px", textAlign: "center", color: "#9ca3af" }}>No recent bookings.</td>
                    </tr>
                  ) : (
                    recentBookings.map((b, i) => {
                      const guestName = b.guestName || b.user?.name || "Guest";
                      const roomType = b.roomType || "Standard Room";
                      const checkinStr = b.checkInDate ? new Date(b.checkInDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "N/A";
                      const checkoutStr = b.checkOutDate ? new Date(b.checkOutDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "N/A";
                      const amountStr = b.amount ? `₹${b.amount.toLocaleString()}` : "N/A";
                      
                      const normStatus = b.status.charAt(0).toUpperCase() + b.status.slice(1).toLowerCase();
                      const style = normStatus === "Confirmed" ? { color: "#16a34a", bg: "#f0fdf4" } : normStatus === "Cancelled" ? { color: "#dc2626", bg: "#fef2f2" } : { color: "#d97706", bg: "#fffbeb" };

                      return (
                        <tr key={i} style={{ borderBottom:"1px solid #f9fafb" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background="#f9fafb")}
                          onMouseLeave={(e) => (e.currentTarget.style.background="transparent")}>
                          <td style={{ padding:"12px 16px", fontSize:13, fontWeight:600, color:"#111", whiteSpace:"nowrap" }}>{guestName}</td>
                          <td style={{ padding:"12px 16px", fontSize:12, color:"#6B7280", whiteSpace:"nowrap" }}>{roomType}</td>
                          <td style={{ padding:"12px 16px", fontSize:12, color:"#6B7280", whiteSpace:"nowrap" }}>{checkinStr}</td>
                          <td style={{ padding:"12px 16px", fontSize:12, color:"#6B7280", whiteSpace:"nowrap" }}>{checkoutStr}</td>
                          <td style={{ padding:"12px 16px", fontSize:13, fontWeight:700, color:"#111", whiteSpace:"nowrap" }}>{amountStr}</td>
                          <td style={{ padding:"12px 16px" }}><Badge label={normStatus} color={style.color} bg={style.bg} /></td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Occupancy + Quick Actions */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <Card style={{ padding:20 }}>
            <p style={{ fontSize:12, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:16 }}>Room Occupancy</p>
            {occupancyByType.length === 0 ? (
              <p style={{ fontSize:12, color:"#9ca3af", textAlign:"center", padding:"10px 0" }}>No rooms configured.</p>
            ) : (
              occupancyByType.map((r) => (
                <div key={r.type} style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>{r.type}</span>
                    <span style={{ fontSize:11, color:"#9ca3af" }}>{r.booked}/{r.total}</span>
                  </div>
                  <div style={{ height:6, background:"#f0f0f0", borderRadius:999, overflow:"hidden" }}>
                    <motion.div initial={{ width:0 }} animate={{ width: r.total > 0 ? `${(r.booked/r.total)*100}%` : "0%" }} transition={{ duration:0.8, delay:0.3 }}
                      style={{ height:"100%", background:r.color, borderRadius:999 }} />
                  </div>
                </div>
              ))
            )}
          </Card>

          <Card style={{ padding:20 }}>
            <p style={{ fontSize:12, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>Quick Actions</p>
            {[
              { label:"Update Pricing",     icon:"💰", path: "/portal/hotel-partner/pricing" },
              { label:"Block Rooms",        icon:"🚫", path: "/portal/hotel-partner/inventory" },
              { label:"View Reviews",       icon:"⭐", path: "/portal/hotel-partner/analytics" },
              { label:"Download Report",    icon:"📊", path: "/portal/hotel-partner/revenue" },
            ].map((a) => (
              <button key={a.label} onClick={() => router.push(a.path)} style={{ display:"flex", alignItems:"center", gap:10, width:"100%", background:"#f9fafb", border:"1px solid #f0f0f0", borderRadius:10, padding:"10px 12px", marginBottom:8, cursor:"pointer", fontSize:12, fontWeight:600, color:"#374151", transition:"all 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background="#ECFDF5"; e.currentTarget.style.borderColor="#059669"; e.currentTarget.style.color="#059669"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background="#f9fafb"; e.currentTarget.style.borderColor="#f0f0f0"; e.currentTarget.style.color="#374151"; }}>
                <span>{a.icon}</span> {a.label}
              </button>
            ))}
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}
