"use client";
import { useState } from "react";
import { MapPin, Calendar, Users, Search } from "lucide-react";

export default function BusSearch() {
  const [from, setFrom] = useState("New Delhi");
  const [to, setTo] = useState("Agra");
  const [passengers, setPassengers] = useState(1);
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
      <div className="search-field" style={{ minWidth: "160px" }}>
        <label>FROM</label>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <MapPin size={15} color="#1677FF" style={{ flexShrink: 0 }} />
          <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Departure city" />
        </div>
      </div>

      <div className="search-field" style={{ minWidth: "160px" }}>
        <label>TO</label>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <MapPin size={15} color="#1677FF" style={{ flexShrink: 0 }} />
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Destination city" />
        </div>
      </div>

      <div className="search-field" style={{ minWidth: "150px" }}>
        <label>DEPARTURE DATE</label>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Calendar size={15} color="#1677FF" style={{ flexShrink: 0 }} />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ cursor: "pointer" }} />
        </div>
      </div>

      <div className="search-field" style={{ minWidth: "120px", maxWidth: "140px" }}>
        <label>PASSENGERS</label>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Users size={15} color="#1677FF" style={{ flexShrink: 0 }} />
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button onClick={() => setPassengers(Math.max(1, passengers - 1))} style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#f3f4f6", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>-</button>
            <span style={{ fontWeight: 700, fontSize: "15px", color: "#111", minWidth: "16px", textAlign: "center" }}>{passengers}</span>
            <button onClick={() => setPassengers(passengers + 1)} style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#f3f4f6", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          </div>
        </div>
      </div>

      <button
        style={{
          display: "flex", alignItems: "center", gap: "8px", background: "#1677FF", color: "#fff",
          border: "none", borderRadius: "999px", padding: "13px 28px", fontSize: "15px",
          fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 20px rgba(22,119,255,0.4)",
          whiteSpace: "nowrap", flexShrink: 0,
        }}
      >
        <Search size={17} />
        Search Buses
      </button>
    </div>
  );
}
