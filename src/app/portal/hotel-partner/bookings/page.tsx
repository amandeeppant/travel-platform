"use client";
import { useState, useEffect } from "react";
import PortalShell from "@/components/portal/PortalShell";
import { useAuthDisplayName } from "@/lib/authClient";
import { StatCard, SectionHeader, Card, Badge, PrimaryButton } from "@/components/portal/DashboardWidgets";
import { motion } from "framer-motion";
import { Building2, LayoutDashboard, Package, BookOpen, BarChart2, DollarSign, Settings, CalendarDays, Users, Ticket, ArrowRight, CheckCircle, XCircle } from "lucide-react";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/portal/hotel-partner" },
  { icon: Building2, label: "Property Registration", href: "/portal/hotel-partner/register" },
  { icon: Package, label: "Inventory Management", href: "/portal/hotel-partner/inventory" },
  { icon: BookOpen, label: "Booking Management", href: "/portal/hotel-partner/bookings" },
  { icon: DollarSign, label: "Revenue Dashboard", href: "/portal/hotel-partner/revenue" },
  { icon: Settings, label: "Pricing Management", href: "/portal/hotel-partner/pricing" },
  { icon: BarChart2, label: "Analytics Dashboard", href: "/portal/hotel-partner/analytics" },
];

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  Confirmed: { color: "#16a34a", bg: "#ecfdf5" },
  Pending: { color: "#d97706", bg: "#ffedd5" },
  Cancelled: { color: "#dc2626", bg: "#fee2e2" },
};

interface BookingItem {
  id: string;
  itemType: string;
  itemId: string;
  status: string;
  createdAt: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestName?: string;
  roomType?: string;
  amount?: number;
  paymentStatus?: string;
  user?: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function BookingManagementPage() {
  const displayName = useAuthDisplayName("Hotel Partner");
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const authRaw = localStorage.getItem("travelEaseAuth");
      if (!authRaw) return;
      const token = JSON.parse(authRaw).token;
      const res = await fetch("/api/hotel-partner/bookings", {
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
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const updateBookingStatus = async (id: string, nextStatus: "Confirmed" | "Cancelled") => {
    try {
      const authRaw = localStorage.getItem("travelEaseAuth");
      if (!authRaw) return;
      const token = JSON.parse(authRaw).token;

      const res = await fetch("/api/hotel-partner/bookings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id, status: nextStatus })
      });

      if (res.ok) {
        loadBookings();
      } else {
        alert("Failed to update booking status.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate dynamic stats
  const pendingCount = bookings.filter(b => b.status.toLowerCase() === "pending" || b.status === "processing").length;
  const confirmedCount = bookings.filter(b => b.status.toLowerCase() === "confirmed").length;
  const cancelledCount = bookings.filter(b => b.status.toLowerCase() === "cancelled").length;
  const activeGuestsCount = bookings.filter(b => {
    if (!b.checkInDate || !b.checkOutDate) return false;
    const now = new Date();
    return new Date(b.checkInDate) <= now && new Date(b.checkOutDate) >= now;
  }).length;

  return (
    <PortalShell portalName="Hotel Partner" portalColor="#059669" portalBg="#ECFDF5" portalIcon={Building2} navItems={NAV} userName={displayName} userRole="Property Manager">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{ background: "linear-gradient(135deg,#059669,#10b981)", borderRadius: 20, padding: "26px 30px", marginBottom: 28, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -16, top: -28, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.75, marginBottom: 6 }}>HOTEL PARTNER PORTAL</p>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Booking Management</h1>
        <p style={{ fontSize: 13, opacity: 0.72 }}>Review upcoming bookings, confirm new arrivals, and keep your property schedule on track.</p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard icon={CalendarDays} label="Upcoming Check-ins" value={String(confirmedCount)} color="#059669" bg="#ecfdf5" delay={0.05} />
        <StatCard icon={Users} label="Active Guests" value={String(activeGuestsCount)} color="#1677FF" bg="#eff6ff" delay={0.1} />
        <StatCard icon={Ticket} label="Pending Requests" value={String(pendingCount)} color="#d97706" bg="#ffedd5" delay={0.15} />
        <StatCard icon={ArrowRight} label="Cancelled Bookings" value={String(cancelledCount)} color="#dc2626" bg="#fee2e2" delay={0.2} />
      </div>

      <Card>
        <SectionHeader title="Recent Bookings" subtitle="Manage the latest reservations" action={<PrimaryButton label="Export Bookings" color="#059669" />} />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                { ["ID", "Guest", "Room Type", "Check-in", "Check-out", "Amount", "Status", "Actions"].map((heading) => (
                  <th key={heading} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>{heading}</th>
                )) }
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: "30px", textAlign: "center", color: "#9ca3af" }}>Loading bookings...</td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "30px", textAlign: "center", color: "#9ca3af" }}>No bookings found for your property.</td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const guestName = booking.guestName || booking.user?.name || "Guest";
                  const roomName = booking.roomType || "Standard Room";
                  const checkinStr = booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "N/A";
                  const checkoutStr = booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "N/A";
                  const amountVal = booking.amount ? `₹${booking.amount.toLocaleString()}` : "N/A";
                  
                  // Normalize status case
                  const normalizedStatus = booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase();

                  return (
                    <tr key={booking.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700 }}>{booking.id.substring(0, 8).toUpperCase()}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{guestName}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>{roomName}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>{checkinStr}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>{checkoutStr}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#111" }}>{amountVal}</td>
                      <td style={{ padding: "14px 16px" }}><Badge label={normalizedStatus} color={STATUS_STYLE[normalizedStatus]?.color ?? "#374151"} bg={STATUS_STYLE[normalizedStatus]?.bg ?? "#f3f4f6"} /></td>
                      <td style={{ padding: "14px 16px" }}>
                        {booking.status.toLowerCase() === "pending" && (
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => updateBookingStatus(booking.id, "Confirmed")} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                              <CheckCircle size={12} /> Confirm
                            </button>
                            <button onClick={() => updateBookingStatus(booking.id, "Cancelled")} style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                              <XCircle size={12} /> Decline
                            </button>
                          </div>
                        )}
                        {booking.status.toLowerCase() === "confirmed" && (
                          <button onClick={() => updateBookingStatus(booking.id, "Cancelled")} style={{ background: "#f3f4f6", color: "#dc2626", border: "1px solid #e5e7eb", borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                            Cancel Booking
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </PortalShell>
  );
}
