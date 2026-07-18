"use client";
import { useState } from "react";
import { MapPin, Calendar, DoorOpen, Users, Search } from "lucide-react";

export default function HotelSearch() {
  const [dest, setDest] = useState("Dubai");
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const formatDate = (value: Date) => value.toISOString().split("T")[0];
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const [checkIn, setCheckIn] = useState(formatDate(today));
  const [checkOut, setCheckOut] = useState(formatDate(nextWeek));

  return (
    <div>
      <div className="search-shell" style={{ alignItems: "flex-end", gap: "12px", flexWrap: "wrap" }}>
        <div className="search-field w-full sm:min-w-[200px] sm:flex-[2]">
          <label>DESTINATION</label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <MapPin size={15} color="#1677FF" style={{ flexShrink: 0 }} />
            <input value={dest} onChange={(e) => setDest(e.target.value)} placeholder="City, hotel or area" />
          </div>
        </div>

        <div className="search-field w-full sm:min-w-[140px] sm:flex-1">
          <label>CHECK IN</label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Calendar size={15} color="#1677FF" style={{ flexShrink: 0 }} />
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} style={{ cursor: "pointer" }} />
          </div>
        </div>

        <div className="search-field w-full sm:min-w-[140px] sm:flex-1">
          <label>CHECK OUT</label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Calendar size={15} color="#1677FF" style={{ flexShrink: 0 }} />
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} style={{ cursor: "pointer" }} />
          </div>
        </div>

        <div className="search-field w-full sm:min-w-[110px] sm:max-w-[130px]">
          <label>ROOMS</label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <DoorOpen size={15} color="#1677FF" style={{ flexShrink: 0 }} />
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <button onClick={() => setRooms(Math.max(1, rooms - 1))} style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#f3f4f6", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center" }}>-</button>
              <span style={{ fontWeight: 700, fontSize: "15px", color: "#111", minWidth: "14px", textAlign: "center" }}>{rooms}</span>
              <button onClick={() => setRooms(rooms + 1)} style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#f3f4f6", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
            </div>
          </div>
        </div>

        <div className="search-field w-full sm:min-w-[110px] sm:max-w-[130px]">
          <label>GUESTS</label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Users size={15} color="#1677FF" style={{ flexShrink: 0 }} />
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <button onClick={() => setGuests(Math.max(1, guests - 1))} style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#f3f4f6", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center" }}>-</button>
              <span style={{ fontWeight: 700, fontSize: "15px", color: "#111", minWidth: "14px", textAlign: "center" }}>{guests}</span>
              <button onClick={() => setGuests(guests + 1)} style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#f3f4f6", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
        <button
          className="search-action"
          style={{
            display: "flex", alignItems: "center", gap: "8px", background: "#1677FF", color: "#fff",
            border: "none", borderRadius: "999px", padding: "13px 28px", fontSize: "15px",
            fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 20px rgba(22,119,255,0.4)",
            whiteSpace: "nowrap", flexShrink: 0,
          }}
        >
          <Search size={17} />
          Search Hotels
        </button>
      </div>
    </div>
  );
}
