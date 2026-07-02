"use client";
import { useState, useEffect } from "react";
import PortalShell from "@/components/portal/PortalShell";
import { useAuthDisplayName } from "@/lib/authClient";
import { StatCard, SectionHeader, Card, Badge, PrimaryButton } from "@/components/portal/DashboardWidgets";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, LayoutDashboard, Package, BookOpen,
  BarChart2, DollarSign, Settings, BedDouble,
  Plus, Upload, Sparkles, TrendingUp, TrendingDown,
  Calendar, Wrench, Eye, ToggleLeft, ToggleRight, X
} from "lucide-react";
import { useRouter } from "next/navigation";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard",             href: "/portal/hotel-partner" },
  { icon: Building2,       label: "Property Registration",  href: "/portal/hotel-partner/register" },
  { icon: Package,         label: "Inventory Management",   href: "/portal/hotel-partner/inventory" },
  { icon: BookOpen,        label: "Booking Management",     href: "/portal/hotel-partner/bookings" },
  { icon: DollarSign,      label: "Revenue Dashboard",      href: "/portal/hotel-partner/revenue" },
  { icon: Settings,        label: "Pricing Management",     href: "/portal/hotel-partner/pricing" },
  { icon: BarChart2,       label: "Analytics Dashboard",    href: "/portal/hotel-partner/analytics" },
];

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  Available:   { color:"#16a34a", bg:"#f0fdf4" },
  Occupied:    { color:"#2563eb", bg:"#eff6ff" },
  Maintenance: { color:"#d97706", bg:"#fffbeb" },
  Blocked:     { color:"#dc2626", bg:"#fef2f2" },
};

const CALENDAR_WEEKS = [
  ["25","26","27","28","29","30","31"],
  ["1","2","3","4","5","6","7"],
  ["8","9","10","11","12","13","14"],
  ["15","16","17","18","19","20","21"],
];
const CALENDAR_OCCUPIED = ["27","28","29","3","4","5","11","12"];
const CALENDAR_BLOCKED  = ["30","13","14"];

const AI_FORECASTS = [
  { label:"Predicted Occupancy (Next 7 days)", value:"84%",   change:"+6%",  up:true,  icon:TrendingUp  },
  { label:"Demand Forecast (Jan Peak)",        value:"High",  change:"Peak", up:true,  icon:TrendingUp  },
  { label:"Inventory Optimization",            value:"18 rooms", change:"Release",  up:true,  icon:BedDouble   },
  { label:"Cancellation Risk",                 value:"12%",   change:"-3%",  up:false, icon:TrendingDown },
];

interface HotelItem {
  id: string;
  name: string;
  location: string;
}

interface RoomItem {
  id: string;
  roomNumber: string;
  type: string;
  floor: number;
  capacity: number;
  price: number;
  status: string;
  occupancy: number;
  maintenance: boolean;
}

function RoomRow({ room, onToggleMaintenance, onEdit }: { room: RoomItem; onToggleMaintenance: (r: RoomItem) => void; onEdit: (r: RoomItem) => void }) {
  const s = STATUS_STYLE[room.status] ?? STATUS_STYLE.Available;
  return (
    <tr style={{ borderBottom:"1px solid #f9fafb" }}
      onMouseEnter={(e) => (e.currentTarget.style.background="#f9fafb")}
      onMouseLeave={(e) => (e.currentTarget.style.background="transparent")}>
      <td style={{ padding:"11px 16px", fontSize:13, fontWeight:700, color:"#111", whiteSpace:"nowrap" }}>{room.roomNumber}</td>
      <td style={{ padding:"11px 16px", fontSize:12, color:"#6b7280", whiteSpace:"nowrap" }}>{room.type}</td>
      <td style={{ padding:"11px 16px", fontSize:12, color:"#6b7280" }}>Floor {room.floor}</td>
      <td style={{ padding:"11px 16px", fontSize:12, color:"#6b7280" }}>{room.capacity} guests</td>
      <td style={{ padding:"11px 16px", fontSize:13, fontWeight:700, color:"#111" }}>₹{room.price.toLocaleString()}/night</td>
      <td style={{ padding:"11px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ flex:1, height:5, background:"#f0f0f0", borderRadius:999, minWidth:60 }}>
            <div style={{ height:"100%", width:`${room.occupancy}%`, background: room.occupancy > 80 ? "#16a34a" : room.occupancy > 50 ? "#d97706" : "#2563eb", borderRadius:999 }} />
          </div>
          <span style={{ fontSize:11, color:"#9ca3af", whiteSpace:"nowrap" }}>{room.occupancy}%</span>
        </div>
      </td>
      <td style={{ padding:"11px 16px" }}><Badge label={room.status} color={s.color} bg={s.bg} /></td>
      <td style={{ padding:"11px 16px" }}>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <button title="Edit Status/Price"
            onClick={() => onEdit(room)}
            style={{ padding:"5px 10px", border:"1.5px solid #059669", borderRadius:7, background:"#fff", cursor:"pointer", color:"#059669", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", gap:4 }}>
            ✏️ Edit
          </button>
          <button title={room.maintenance ? "Remove Block" : "Maintenance Block"}
            onClick={() => onToggleMaintenance(room)}
            style={{ padding:"5px", border:`1px solid ${room.maintenance ? "#d97706":"#e5e7eb"}`, borderRadius:7, background: room.maintenance ? "#fffbeb":"#fff", cursor:"pointer" }}>
            <Wrench size={13} color={room.maintenance ? "#d97706":"#6b7280"} />
          </button>
          {room.maintenance
            ? <button onClick={() => onToggleMaintenance(room)} style={{ padding:"5px", border:"none", background:"none", cursor:"pointer" }}><ToggleLeft size={20} color="#d97706" /></button>
            : <button onClick={() => onToggleMaintenance(room)} style={{ padding:"5px", border:"none", background:"none", cursor:"pointer" }}><ToggleRight size={20} color="#16a34a" /></button>
          }
        </div>
      </td>
    </tr>
  );
}

export default function InventoryPage() {
  const router = useRouter();
  const displayName = useAuthDisplayName("Grand Palace");
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");
  const [loading, setLoading] = useState(true);

  // Add Room Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [newRoomType, setNewRoomType] = useState("Standard Room");
  const [newRoomFloor, setNewRoomFloor] = useState("1");
  const [newRoomPrice, setNewRoomPrice] = useState("2500");
  const [newRoomCapacity, setNewRoomCapacity] = useState("2");

  // Edit Room Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomItem | null>(null);
  const [editRoomNumber, setEditRoomNumber] = useState("");
  const [editRoomType, setEditRoomType] = useState("");
  const [editRoomFloor, setEditRoomFloor] = useState("");
  const [editRoomPrice, setEditRoomPrice] = useState("");
  const [editRoomCapacity, setEditRoomCapacity] = useState("");
  const [editRoomStatus, setEditRoomStatus] = useState("");
  const [editRoomOccupancy, setEditRoomOccupancy] = useState("");

  // Load properties first
  const loadHotels = async () => {
    try {
      const authRaw = localStorage.getItem("travelEaseAuth");
      if (!authRaw) return;
      const token = JSON.parse(authRaw).token;
      const res = await fetch("/api/hotel-partner/property", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      const list = data.hotels || [];
      setHotels(list);
      if (list.length > 0) {
        setSelectedHotelId(list[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const loadRooms = async (hotelId: string) => {
    if (!hotelId) return;
    try {
      setLoading(true);
      const authRaw = localStorage.getItem("travelEaseAuth");
      if (!authRaw) return;
      const token = JSON.parse(authRaw).token;
      const res = await fetch(`/api/hotel-partner/rooms?hotelId=${hotelId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setRooms(data.rooms || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  useEffect(() => {
    if (selectedHotelId) {
      loadRooms(selectedHotelId);
    }
  }, [selectedHotelId]);

  const toggleMaintenance = async (room: RoomItem) => {
    try {
      const authRaw = localStorage.getItem("travelEaseAuth");
      if (!authRaw) return;
      const token = JSON.parse(authRaw).token;

      const nextMaintenance = !room.maintenance;
      const nextStatus = nextMaintenance ? "Maintenance" : "Available";

      const res = await fetch("/api/hotel-partner/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: room.id,
          hotelId: selectedHotelId,
          roomNumber: room.roomNumber,
          type: room.type,
          price: room.price,
          floor: room.floor,
          capacity: room.capacity,
          status: nextStatus,
          maintenance: nextMaintenance,
          occupancy: nextMaintenance ? 0 : room.occupancy
        })
      });

      if (res.ok) {
        loadRooms(selectedHotelId);
      } else {
        alert("Failed to toggle room maintenance status.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotelId) {
      alert("Please select a hotel first.");
      return;
    }

    try {
      const authRaw = localStorage.getItem("travelEaseAuth");
      if (!authRaw) return;
      const token = JSON.parse(authRaw).token;

      const res = await fetch("/api/hotel-partner/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          hotelId: selectedHotelId,
          roomNumber: newRoomNumber,
          type: newRoomType,
          floor: Number(newRoomFloor),
          capacity: Number(newRoomCapacity),
          price: Number(newRoomPrice),
          status: "Available",
          occupancy: 0,
          maintenance: false
        })
      });

      if (res.ok) {
        setModalOpen(false);
        setNewRoomNumber("");
        loadRooms(selectedHotelId);
      } else {
        const data = await res.json();
        alert(`Failed to add room: ${data.error || "Server error"}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom || !selectedHotelId) return;

    try {
      const authRaw = localStorage.getItem("travelEaseAuth");
      if (!authRaw) return;
      const token = JSON.parse(authRaw).token;

      const isMaintenance = editRoomStatus === "Maintenance";

      const res = await fetch("/api/hotel-partner/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: editingRoom.id,
          hotelId: selectedHotelId,
          roomNumber: editRoomNumber,
          type: editRoomType,
          floor: Number(editRoomFloor),
          capacity: Number(editRoomCapacity),
          price: Number(editRoomPrice),
          status: editRoomStatus,
          occupancy: Number(editRoomOccupancy),
          maintenance: isMaintenance
        })
      });

      if (res.ok) {
        setEditModalOpen(false);
        setEditingRoom(null);
        loadRooms(selectedHotelId);
      } else {
        const data = await res.json();
        alert(`Failed to update room: ${data.error || "Server error"}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = rooms.filter(r =>
    (filterType   === "All" || r.type   === filterType) &&
    (filterStatus === "All" || r.status === filterStatus)
  );

  const types    = ["All", ...Array.from(new Set(rooms.map(r => r.type)))];
  const statuses = ["All", "Available", "Occupied", "Maintenance", "Blocked"];

  const total       = rooms.length;
  const available   = rooms.filter(r => r.status === "Available").length;
  const occupied    = rooms.filter(r => r.status === "Occupied").length;
  const maintenance = rooms.filter(r => r.status === "Maintenance").length;

  const roomTypesList = Array.from(new Set(rooms.map(r => r.type)));
  const occupancyByType = roomTypesList.map(type => {
    const totalType = rooms.filter(r => r.type === type).length;
    const occupiedType = rooms.filter(r => r.type === type && (r.status === "Occupied" || r.occupancy > 0)).length;
    const pct = totalType > 0 ? Math.round((occupiedType / totalType) * 100) : 0;
    return {
      type,
      pct,
      color: type.includes("Suite") ? "#059669" : type.includes("Penthouse") ? "#7c3aed" : type.includes("Deluxe") ? "#d97706" : "#2563eb"
    };
  });

  return (
    <PortalShell portalName="Hotel Partner" portalColor="#059669" portalBg="#ECFDF5" portalIcon={Building2} navItems={NAV} userName={displayName} userRole="Property Manager" pageClassName="inventory-page">

      {/* Header */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
        style={{ background:"linear-gradient(135deg,#059669,#10b981)", borderRadius:20, padding:"24px 28px", marginBottom:28, color:"#fff", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-20, top:-30, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
        <p style={{ fontSize:12, fontWeight:600, opacity:0.75, marginBottom:4 }}>FR-002</p>
        <h1 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>Inventory Management</h1>
        <p style={{ fontSize:12, opacity:0.72, marginBottom:18 }}>Centralized room inventory · Managed by {displayName}</p>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <button disabled={!selectedHotelId} onClick={() => setModalOpen(true)}
            style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"10px 20px", background: selectedHotelId ? "#fff" : "#a7f3d0", color:"#059669", border:"none", borderRadius:10, fontSize:13, fontWeight:700, cursor: selectedHotelId ? "pointer" : "not-allowed" }}>
            <Plus size={16} /> Add New Room
          </button>
        </div>
      </motion.div>

      {/* Hotel Selector dropdown */}
      {hotels.length > 0 && (
        <Card style={{ padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Building2 size={18} color="#059669" />
            <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Select Hotel to Manage:</label>
          </div>
          <select value={selectedHotelId} onChange={(e) => setSelectedHotelId(e.target.value)}
            style={{ border: "1.5px solid #e5e7eb", borderRadius: 9, padding: "8px 14px", fontSize: 13, fontWeight: 700, color: "#111", background: "#fff", outline: "none", minWidth: 220 }}>
            {hotels.map(h => <option key={h.id} value={h.id}>{h.name} ({h.location})</option>)}
          </select>
        </Card>
      )}

      {hotels.length === 0 && !loading ? (
        <Card style={{ padding: 40, textAlign: "center", marginBottom: 28 }}>
          <Building2 size={48} color="#9ca3af" style={{ margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111" }}>No Properties Registered</h3>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4, marginBottom: 20 }}>You must register a property before you can manage its room inventory.</p>
          <button onClick={() => router.push("/portal/hotel-partner/register")}
            style={{ padding: "10px 20px", background: "#059669", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Register Property Now
          </button>
        </Card>
      ) : (
        <>
          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:14, marginBottom:28 }}>
            <StatCard icon={BedDouble}  label="Total Rooms"       value={String(total)}       color="#059669" bg="#ECFDF5" delay={0.05} />
            <StatCard icon={ToggleRight} label="Available"         value={String(available)}   color="#16a34a" bg="#f0fdf4" delay={0.10} />
            <StatCard icon={BookOpen}   label="Occupied"           value={String(occupied)}    color="#2563eb" bg="#eff6ff" delay={0.15} />
            <StatCard icon={Wrench}     label="Maintenance"        value={String(maintenance)} color="#d97706" bg="#fffbeb" delay={0.20} />
            <StatCard icon={TrendingUp} label="Occupancy Rate"     value={total > 0 ? `${Math.round((occupied/total)*100)}%` : "0%"} change="+5%" color="#7c3aed" bg="#f5f3ff" delay={0.25} />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20 }}>

            {/* Main Table + Calendar */}
            <div>
              {/* Tab + Filters */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:10 }}>
                <div style={{ display:"flex", gap:4, background:"#f0f0f0", borderRadius:12, padding:4 }}>
                  {(["list","calendar"] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      style={{ padding:"7px 18px", borderRadius:9, border:"none", cursor:"pointer", fontSize:12, fontWeight:700,
                        background: activeTab === tab ? "#fff":"transparent",
                        color: activeTab === tab ? "#059669":"#6b7280",
                        boxShadow: activeTab === tab ? "0 2px 8px rgba(0,0,0,0.08)":"none",
                        transition:"all 0.15s" }}>
                      {tab === "list" ? "🗂 Room List" : "📅 Calendar"}
                    </button>
                  ))}
                </div>
                {activeTab === "list" && (
                  <div style={{ display:"flex", gap:8 }}>
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                      style={{ border:"1.5px solid #e5e7eb", borderRadius:9, padding:"7px 12px", fontSize:12, fontWeight:600, color:"#374151", background:"#fff", outline:"none" }}>
                      {types.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                      style={{ border:"1.5px solid #e5e7eb", borderRadius:9, padding:"7px 12px", fontSize:12, fontWeight:600, color:"#374151", background:"#fff", outline:"none" }}>
                      {statuses.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "list" ? (
                  <motion.div key="list" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                    <Card>
                      {loading ? (
                        <div style={{ padding:40, textAlign:"center", color:"#9ca3af" }}>Loading rooms database...</div>
                      ) : (
                        <div style={{ overflowX:"auto" }}>
                          <table style={{ width:"100%", borderCollapse:"collapse" }}>
                            <thead>
                              <tr style={{ background:"#f9fafb", borderBottom:"1px solid #f0f0f0" }}>
                                {["Room ID","Type","Floor","Capacity","Price","Occupancy","Status","Actions"].map(h => (
                                  <th key={h} style={{ padding:"11px 16px", textAlign:"left", fontSize:10, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {filtered.map(r => (
                                <RoomRow key={r.id} room={r} onToggleMaintenance={toggleMaintenance}
                                  onEdit={(room) => {
                                    setEditingRoom(room);
                                    setEditRoomNumber(room.roomNumber);
                                    setEditRoomType(room.type);
                                    setEditRoomFloor(String(room.floor));
                                    setEditRoomCapacity(String(room.capacity));
                                    setEditRoomPrice(String(room.price));
                                    setEditRoomStatus(room.status);
                                    setEditRoomOccupancy(String(room.occupancy));
                                    setEditModalOpen(true);
                                  }}
                                />
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {!loading && filtered.length === 0 && (
                        <div style={{ padding:"40px", textAlign:"center", color:"#9ca3af", fontSize:13 }}>No rooms match the selected filters</div>
                      )}
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div key="calendar" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                    <Card style={{ padding:20 }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                        <div>
                          <p style={{ fontSize:14, fontWeight:800, color:"#111" }}>Reservation Calendar</p>
                          <p style={{ fontSize:12, color:"#9ca3af" }}>January 2025 · Availability overview</p>
                        </div>
                        <div style={{ display:"flex", gap:10 }}>
                          {[{ label:"Available", color:"#16a34a", bg:"#f0fdf4" },{ label:"Occupied", color:"#2563eb", bg:"#eff6ff" },{ label:"Blocked", color:"#dc2626", bg:"#fef2f2" }]
                            .map(l => <Badge key={l.label} label={l.label} color={l.color} bg={l.bg} />)}
                        </div>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:8 }}>
                        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                          <div key={d} style={{ textAlign:"center", fontSize:10, fontWeight:800, color:"#9ca3af", padding:"6px 0" }}>{d}</div>
                        ))}
                      </div>
                      {CALENDAR_WEEKS.map((week, wi) => (
                        <div key={wi} style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:4 }}>
                          {week.map((day) => {
                            const isOccupied  = CALENDAR_OCCUPIED.includes(day);
                            const isBlocked   = CALENDAR_BLOCKED.includes(day);
                            const isToday     = day === "28";
                            return (
                              <div key={day} style={{
                                textAlign:"center", padding:"10px 4px", borderRadius:10, fontSize:12, fontWeight:700, cursor:"pointer",
                                background: isBlocked ? "#fef2f2" : isOccupied ? "#eff6ff" : "#f0fdf4",
                                color:      isBlocked ? "#dc2626"  : isOccupied ? "#2563eb" : "#16a34a",
                                border:     isToday ? "2px solid #059669" : "1px solid transparent",
                                transition:"transform 0.1s",
                              }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform="scale(1.05)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform="scale(1)")}>
                                {day}
                                {isToday && <div style={{ width:4, height:4, borderRadius:"50%", background:"#059669", margin:"2px auto 0" }} />}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Panel + Occupancy */}
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

              {/* AI Capabilities */}
              <Card style={{ padding:20 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                  <Sparkles size={16} color="#7c3aed" />
                  <p style={{ fontSize:12, fontWeight:800, color:"#111" }}>AI Capabilities</p>
                </div>
                {AI_FORECASTS.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #f0f0f0" }}>
                      <div>
                        <p style={{ fontSize:11, color:"#6b7280", marginBottom:2 }}>{f.label}</p>
                        <p style={{ fontSize:15, fontWeight:800, color:"#111" }}>{f.value}</p>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:4, background: f.up ? "#f0fdf4":"#fef2f2", borderRadius:999, padding:"3px 8px" }}>
                        <Icon size={11} color={f.up ? "#16a34a":"#dc2626"} />
                        <span style={{ fontSize:10, fontWeight:700, color: f.up ? "#16a34a":"#dc2626" }}>{f.change}</span>
                      </div>
                    </div>
                  );
                })}
              </Card>

              {/* Room Type Occupancy */}
              <Card style={{ padding:20 }}>
                <p style={{ fontSize:12, fontWeight:800, color:"#111", marginBottom:16 }}>Occupancy by Type</p>
                {occupancyByType.length === 0 ? (
                  <p style={{ fontSize:12, color:"#9ca3af", textAlign:"center", padding:"10px 0" }}>No rooms configured</p>
                ) : (
                  occupancyByType.map((r) => (
                    <div key={r.type} style={{ marginBottom:14 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                        <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>{r.type}</span>
                        <span style={{ fontSize:11, fontWeight:700, color:r.color }}>{r.pct}%</span>
                      </div>
                      <div style={{ height:7, background:"#f0f0f0", borderRadius:999 }}>
                        <motion.div initial={{ width:0 }} animate={{ width:`${r.pct}%` }} transition={{ duration:0.8, delay:0.3 }}
                          style={{ height:"100%", background:r.color, borderRadius:999 }} />
                      </div>
                    </div>
                  ))
                )}
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Add Room Modal */}
      {modalOpen && (
        <div style={{ position:"fixed", top:0, left:0, width:"100vw", height:"100vh", background:"rgba(0,0,0,0.5)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <motion.div initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }}
            style={{ width:450, background:"#fff", borderRadius:16, padding:24, boxShadow:"0 10px 25px rgba(0,0,0,0.15)", position:"relative" }}>
            <button onClick={() => setModalOpen(false)} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", cursor:"pointer", color:"#9ca3af" }}>
              <X size={18} />
            </button>
            <h2 style={{ fontSize:18, fontWeight:800, color:"#111", marginBottom:16 }}>Add New Room</h2>
            <form onSubmit={handleAddRoom}>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#4b5563", marginBottom:6 }}>Room Number *</label>
                <input required type="text" value={newRoomNumber} onChange={(e) => setNewRoomNumber(e.target.value)} placeholder="e.g. R-105"
                  style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#111" }} />
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#4b5563", marginBottom:6 }}>Room Type *</label>
                <select value={newRoomType} onChange={(e) => setNewRoomType(e.target.value)}
                  style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#111", background:"#fff" }}>
                  <option>Standard Room</option>
                  <option>Deluxe Room</option>
                  <option>Suite</option>
                  <option>Penthouse</option>
                </select>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#4b5563", marginBottom:6 }}>Floor</label>
                  <input type="number" value={newRoomFloor} onChange={(e) => setNewRoomFloor(e.target.value)}
                    style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#111" }} />
                </div>
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#4b5563", marginBottom:6 }}>Capacity (Guests)</label>
                  <input type="number" value={newRoomCapacity} onChange={(e) => setNewRoomCapacity(e.target.value)}
                    style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#111" }} />
                </div>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#4b5563", marginBottom:6 }}>Price per Night (INR) *</label>
                <input required type="number" value={newRoomPrice} onChange={(e) => setNewRoomPrice(e.target.value)}
                  style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#111" }} />
              </div>
              <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ padding:"10px 16px", background:"#f3f4f6", border:"none", borderRadius:10, fontSize:12, fontWeight:700, color:"#4b6563", cursor:"pointer" }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding:"10px 20px", background:"#059669", border:"none", borderRadius:10, fontSize:12, fontWeight:700, color:"#fff", cursor:"pointer" }}>
                  Create Room
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Room Modal */}
      {editModalOpen && editingRoom && (
        <div style={{ position:"fixed", top:0, left:0, width:"100vw", height:"100vh", background:"rgba(0,0,0,0.5)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <motion.div initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }}
            style={{ width:450, background:"#fff", borderRadius:16, padding:24, boxShadow:"0 10px 25px rgba(0,0,0,0.15)", position:"relative" }}>
            <button onClick={() => setEditModalOpen(false)} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", cursor:"pointer", color:"#9ca3af" }}>
              <X size={18} />
            </button>
            <h2 style={{ fontSize:18, fontWeight:800, color:"#111", marginBottom:16 }}>Edit Room - {editRoomNumber}</h2>
            <form onSubmit={handleEditRoom}>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#4b5563", marginBottom:6 }}>Room Type *</label>
                <select value={editRoomType} onChange={(e) => setEditRoomType(e.target.value)}
                  style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#111", background:"#fff" }}>
                  <option>Standard Room</option>
                  <option>Deluxe Room</option>
                  <option>Suite</option>
                  <option>Penthouse</option>
                </select>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#4b5563", marginBottom:6 }}>Floor</label>
                  <input type="number" value={editRoomFloor} onChange={(e) => setEditRoomFloor(e.target.value)}
                    style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#111" }} />
                </div>
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#4b5563", marginBottom:6 }}>Capacity (Guests)</label>
                  <input type="number" value={editRoomCapacity} onChange={(e) => setEditRoomCapacity(e.target.value)}
                    style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#111" }} />
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#4b5563", marginBottom:6 }}>Price per Night (INR) *</label>
                <input required type="number" value={editRoomPrice} onChange={(e) => setEditRoomPrice(e.target.value)}
                  style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#111" }} />
              </div>
              
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#4b5563", marginBottom:6 }}>Status *</label>
                  <select value={editRoomStatus} onChange={(e) => setEditRoomStatus(e.target.value)}
                    style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#111", background:"#fff" }}>
                    <option>Available</option>
                    <option>Occupied</option>
                    <option>Maintenance</option>
                    <option>Blocked</option>
                  </select>
                </div>
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#4b5563", marginBottom:6 }}>Occupancy (%)</label>
                  <input type="number" min="0" max="100" value={editRoomOccupancy} onChange={(e) => setEditRoomOccupancy(e.target.value)}
                    style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#111" }} />
                </div>
              </div>

              <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
                <button type="button" onClick={() => setEditModalOpen(false)} style={{ padding:"10px 16px", background:"#f3f4f6", border:"none", borderRadius:10, fontSize:12, fontWeight:700, color:"#4b6563", cursor:"pointer" }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding:"10px 20px", background:"#059669", border:"none", borderRadius:10, fontSize:12, fontWeight:700, color:"#fff", cursor:"pointer" }}>
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </PortalShell>
  );
}
