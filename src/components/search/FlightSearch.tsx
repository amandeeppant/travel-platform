"use client";
import { useState } from "react";
import { Plane, Calendar, Users, ArrowLeftRight, Search } from "lucide-react";

export default function FlightSearch() {
  const [tripType, setTripType] = useState<"one-way" | "round">("one-way");
  const [from, setFrom] = useState("DEL – New Delhi");
  const [to, setTo] = useState("BOM – Mumbai");
  const [travellers, setTravellers] = useState(1);
  const today = new Date().toISOString().split("T")[0];
  const [dep, setDep] = useState(today);
  const [ret, setRet] = useState(today);

  return (
    <div>
      {/* Trip type toggle */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        {(["one-way", "round"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTripType(t)}
            style={{
              padding: "6px 16px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              background: tripType === t ? "#1677FF" : "#ffffff",
              color: tripType === t ? "#fff" : "#6B7280",
            }}
          >
            {t === "one-way" ? "One Way" : "Round Trip"}
          </button>
        ))}
      </div>

      {/* Fields */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <div className="search-field w-full sm:min-w-[160px] sm:flex-1">
          <label>FROM</label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Plane size={15} color="#1677FF" style={{ flexShrink: 0 }} />
            <input value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
        </div>

        <button
          style={{
            width: "36px", height: "36px", borderRadius: "50%", background: "#1677FF",
            border: "none", cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(22,119,255,0.35)",
          }}
        >
          <ArrowLeftRight size={15} color="#fff" />
        </button>

        <div className="search-field w-full sm:min-w-[160px] sm:flex-1">
          <label>TO</label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Plane size={15} color="#1677FF" style={{ flexShrink: 0, transform: "rotate(90deg)" }} />
            <input value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>

        <div className="search-field w-full sm:min-w-[140px] sm:flex-1">
          <label>DEPARTURE</label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Calendar size={15} color="#1677FF" style={{ flexShrink: 0 }} />
            <input type="date" value={dep} onChange={(e) => setDep(e.target.value)} style={{ cursor: "pointer" }} />
          </div>
        </div>

        {tripType === "round" && (
          <div className="search-field w-full sm:min-w-[140px] sm:flex-1">
            <label>RETURN</label>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Calendar size={15} color="#1677FF" style={{ flexShrink: 0 }} />
              <input type="date" value={ret} onChange={(e) => setRet(e.target.value)} style={{ cursor: "pointer" }} />
            </div>
          </div>
        )}

        <div className="search-field w-full sm:min-w-[120px] sm:max-w-[140px]">
          <label>TRAVELLERS</label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Users size={15} color="#1677FF" style={{ flexShrink: 0 }} />
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                onClick={() => setTravellers(Math.max(1, travellers - 1))}
                style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#f3f4f6", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >-</button>
              <span style={{ fontWeight: 700, fontSize: "15px", color: "#111", minWidth: "16px", textAlign: "center" }}>{travellers}</span>
              <button
                onClick={() => setTravellers(travellers + 1)}
                style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#f3f4f6", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >+</button>
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
          Search Flights
        </button>
      </div>
    </div>
  );
}
