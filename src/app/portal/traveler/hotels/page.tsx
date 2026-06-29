"use client";
import { useState, useEffect } from "react";
import PortalShell from "@/components/portal/PortalShell";
import { useAuthDisplayName } from "@/lib/authClient";
import { StatCard, SectionHeader, Card, Badge, PrimaryButton } from "@/components/portal/DashboardWidgets";
import { motion, AnimatePresence } from "framer-motion";
import { User, Globe, Train, Hotel, Plane, Map, Calendar, FileText, Shield, Bot, Zap, Star, Search, ArrowRight, X, CalendarDays, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

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

interface RoomTypeInfo {
  type: string;
  price: number;
  capacity: number;
  availableCount: number;
}

interface HotelItem {
  id: string;
  name: string;
  location: string;
  address?: string;
  description?: string;
  category?: string;
  rating: number;
  nightlyRate: number;
  rooms: {
    id: string;
    type: string;
    price: number;
    capacity: number;
    status: string;
  }[];
}

export default function HotelSearchPage() {
  const router = useRouter();
  const displayName = useAuthDisplayName("Traveler");
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Booking Modal States
  const [selectedHotel, setSelectedHotel] = useState<HotelItem | null>(null);
  const [bookingRoomType, setBookingRoomType] = useState<string>("");
  const [bookingRoomPrice, setBookingRoomPrice] = useState<number>(0);
  const [guestName, setGuestName] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchHotels = async (query = "") => {
    try {
      setLoading(true);
      const res = await fetch(`/api/hotels?dest=${encodeURIComponent(query)}`);
      const data = await res.json();
      const allHotels = (data.hotels || []) as HotelItem[];
      // Filter out dummy hotels with no registered room inventory
      const realHotels = allHotels.filter(h => h.rooms && h.rooms.length > 0);
      setHotels(realHotels);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHotels(searchQuery);
  };

  const handleBookRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel) return;

    try {
      setBookingLoading(true);
      const authRaw = localStorage.getItem("travelEaseAuth");
      if (!authRaw) {
        alert("Please sign in to book hotels.");
        router.push("/login");
        return;
      }
      const token = JSON.parse(authRaw).token;

      // Calculate number of nights
      const checkinDate = new Date(checkIn);
      const checkoutDate = new Date(checkOut);
      const diffTime = Math.abs(checkoutDate.getTime() - checkinDate.getTime());
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      const totalAmount = bookingRoomPrice * nights;

      // Find an available room of this type in the hotel
      const matchingRoom = selectedHotel.rooms.find(r => r.type === bookingRoomType && r.status === "Available");
      const itemId = matchingRoom ? matchingRoom.id : selectedHotel.id;
      const itemType = matchingRoom ? "room" : "hotel";

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          itemType,
          itemId,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          guestName: guestName || displayName,
          roomType: bookingRoomType,
          amount: totalAmount,
          paymentStatus: "paid"
        })
      });

      if (res.ok) {
        alert(`🎉 Booking confirmed! Total amount paid: ₹${totalAmount.toLocaleString()}`);
        setSelectedHotel(null);
        setCheckIn("");
        setCheckOut("");
        setGuestName("");
        // Reload hotel listings to reflect availability
        fetchHotels(searchQuery);
        router.push("/portal/traveler");
      } else {
        const errorData = await res.json();
        alert(`Failed to book room: ${errorData.error || "Server error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while placing booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  // Group rooms for the selected hotel by room type
  const getSelectedHotelRoomTypes = (): RoomTypeInfo[] => {
    if (!selectedHotel) return [];
    const roomsByType: Record<string, { price: number; capacity: number; count: number; available: number }> = {};
    selectedHotel.rooms.forEach(r => {
      if (!roomsByType[r.type]) {
        roomsByType[r.type] = { price: r.price, capacity: r.capacity, count: 0, available: 0 };
      }
      roomsByType[r.type].count++;
      if (r.status === "Available") {
        roomsByType[r.type].available++;
      }
    });

    return Object.entries(roomsByType).map(([type, info]) => ({
      type,
      price: info.price,
      capacity: info.capacity,
      availableCount: info.available
    }));
  };

  const highestRating = hotels.length > 0 ? Math.max(...hotels.map(h => h.rating)) : 5.0;

  return (
    <PortalShell portalName="Traveler" portalColor="#1677FF" portalBg="#EFF6FF" portalIcon={User} navItems={NAV} userName={displayName} userRole="Traveler">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{ background: "linear-gradient(135deg,#1677FF,#0ea5e9)", borderRadius: 20, padding: "28px 32px", marginBottom: 28, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -30, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.75, marginBottom: 6 }}>TRAVELER PORTAL</p>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Hotel Search</h1>
        <p style={{ fontSize: 13, opacity: 0.72 }}>Find the best stays for your next trip.</p>
      </motion.div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard icon={Hotel} label="Hotels Found" value={String(hotels.length)} color="#1677FF" bg="#EFF6FF" delay={0.05} />
        <StatCard icon={Star} label="Top Rating" value={`${highestRating} ★`} color="#D97706" bg="#FFFBEB" delay={0.1} />
        <StatCard icon={ArrowRight} label="Fast Booking" value="Instant" color="#059669" bg="#ECFDF5" delay={0.15} />
      </div>

      {/* Search Input Box */}
      <Card style={{ padding: 18, marginBottom: 20 }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by hotel name or city (e.g. Mumbai, Goa...)"
              style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "12px 14px 12px 42px", fontSize: 14, outline: "none" }} />
            <Search size={18} color="#9ca3af" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
          </div>
          <button type="submit" style={{ padding: "10px 24px", background: "#1677FF", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Search
          </button>
        </form>
      </Card>

      {/* Available Hotels */}
      <Card>
        <SectionHeader title="Available Hotels" subtitle="Choose your ideal stay" />
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Searching properties...</div>
        ) : hotels.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>No hotels found matching your search.</div>
        ) : (
          <div style={{ display: "grid", gap: 14, padding: "0 18px 18px" }}>
            {hotels.map((hotel) => {
              const basePrice = hotel.rooms.length > 0 ? Math.min(...hotel.rooms.map(r => r.price)) : hotel.nightlyRate;
              
              return (
                <div key={hotel.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "18px 20px", background: "#f8fafc", borderRadius: 16, border: "1px solid #e5e7eb", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <p style={{ fontSize: 16, fontWeight: 800, color: "#111" }}>{hotel.name}</p>
                      <Badge label={`${hotel.category || "Hotel"}`} color="#1677FF" bg="#eff6ff" />
                    </div>
                    <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>📍 {hotel.address || hotel.location}</p>
                    {hotel.description && <p style={{ fontSize: 12, color: "#4b5563", marginTop: 8, lineHeight: 1.4 }}>{hotel.description}</p>}
                  </div>
                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12, color: "#6b7280" }}>Starting from</span>
                      <span style={{ fontSize: 18, fontWeight: 900, color: "#111" }}>₹{basePrice.toLocaleString()}/night</span>
                    </div>
                    <Badge label={`${hotel.rating} ★`} color="#f59e0b" bg="#fffbeb" />
                    <button onClick={() => { setSelectedHotel(hotel); setGuestName(displayName); }} style={{ marginTop: 8, padding: "8px 18px", background: "#1677FF", color: "#fff", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      Select Room & Book →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Select Room & Booking Modal */}
      {selectedHotel && (
        <div style={{ position: "fixed", top:0, left:0, width:"100vw", height:"100vh", background:"rgba(0,0,0,0.5)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <motion.div initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }}
            style={{ width:500, maxHeight: "90vh", overflowY: "auto", background:"#fff", borderRadius:16, padding:24, boxShadow:"0 10px 25px rgba(0,0,0,0.15)", position:"relative" }}>
            <button onClick={() => { setSelectedHotel(null); setBookingRoomType(""); }} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", cursor:"pointer", color:"#9ca3af" }}>
              <X size={18} />
            </button>
            <h2 style={{ fontSize:18, fontWeight:800, color:"#111", marginBottom:4 }}>{selectedHotel.name}</h2>
            <p style={{ fontSize:12, color:"#6b7280", marginBottom:16 }}>📍 {selectedHotel.address || selectedHotel.location}</p>

            {bookingRoomType === "" ? (
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:"#374151", marginBottom:12 }}>Select a Room Type</p>
                {getSelectedHotelRoomTypes().length === 0 ? (
                  <div style={{ padding: 20, textAlign: "center", color: "#9ca3af", fontSize: 12 }}>No room inventory available right now.</div>
                ) : (
                  getSelectedHotelRoomTypes().map((rt) => (
                    <div key={rt.type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#f9fafb", borderRadius: 12, marginBottom:8, border: "1px solid #e5e7eb" }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{rt.type}</p>
                        <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Max capacity: {rt.capacity} guests · {rt.availableCount} available</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 14, fontWeight: 800, color: "#111" }}>₹{rt.price.toLocaleString()}/night</p>
                        <button disabled={rt.availableCount === 0} onClick={() => { setBookingRoomType(rt.type); setBookingRoomPrice(rt.price); }}
                          style={{ marginTop: 6, padding: "5px 12px", background: rt.availableCount === 0 ? "#cbd5e1" : "#1677FF", color: "#fff", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: rt.availableCount === 0 ? "not-allowed":"pointer" }}>
                          {rt.availableCount === 0 ? "Sold Out" : "Select"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <form onSubmit={handleBookRoom}>
                <div style={{ background: "#eff6ff", borderRadius: 10, padding: 12, marginBottom: 16 }}>
                  <p style={{ fontSize: 12, color: "#1e40af", fontWeight: 700 }}>Selected: {bookingRoomType}</p>
                  <p style={{ fontSize: 12, color: "#1e40af", marginTop: 2 }}>Rate: ₹{bookingRoomPrice.toLocaleString()} per night</p>
                  <button type="button" onClick={() => setBookingRoomType("")} style={{ background: "none", border: "none", color: "#1677FF", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: 0, marginTop: 6 }}>
                    ← Change Room Type
                  </button>
                </div>
                
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#4b5563", marginBottom:6 }}>Guest Full Name *</label>
                  <input required type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="e.g. John Doe"
                    style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#111" }} />
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
                  <div>
                    <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#4b5563", marginBottom:6 }}>Check-in Date *</label>
                    <input required type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} min={new Date().toISOString().split("T")[0]}
                      style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#111" }} />
                  </div>
                  <div>
                    <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#4b5563", marginBottom:6 }}>Check-out Date *</label>
                    <input required type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split("T")[0]}
                      style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#111" }} />
                  </div>
                </div>

                <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
                  <button type="button" onClick={() => { setSelectedHotel(null); setBookingRoomType(""); }} style={{ padding:"10px 16px", background:"#f3f4f6", border:"none", borderRadius:10, fontSize:12, fontWeight:700, color:"#4b6563", cursor:"pointer" }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={bookingLoading} style={{ padding:"10px 20px", background:"#1677FF", border:"none", borderRadius:10, fontSize:12, fontWeight:700, color:"#fff", cursor:"pointer", opacity: bookingLoading ? 0.75 : 1 }}>
                    {bookingLoading ? "Booking..." : "Book Room"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </PortalShell>
  );
}
