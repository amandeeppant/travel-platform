"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, ArrowLeftRight, Search } from "lucide-react";

export default function TrainSearch() {
  const router = useRouter();
  const [from, setFrom] = useState("New Delhi");
  const [to, setTo] = useState("Mumbai");
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);
  const [date, setDate] = useState(fmt(today));

  const swap = () => { const t = from; setFrom(to); setTo(t); };

  const handleSearch = () => {
    const params = new URLSearchParams({ from, to, date });
    router.push(`/trains?${params.toString()}`);
  };

  return (
    <div>
      <div className="search-shell train-search-row" style={{ alignItems: "flex-end", gap: "12px", flexWrap: "wrap" }}>

        {/* FROM */}
        <div className="search-field w-full sm:min-w-[160px] sm:flex-1">
          <label>FROM</label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <MapPin size={15} color="#1677FF" style={{ flexShrink: 0 }} />
            <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Origin station" />
          </div>
        </div>

        {/* SWAP */}
        <button
          onClick={swap}
          className="search-swap"
          style={{ width: 36, height: 36, borderRadius: "50%", background: "#1677FF", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(22,119,255,0.35)", transition: "transform 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.12)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <ArrowLeftRight size={15} color="#fff" />
        </button>

        {/* TO */}
        <div className="search-field w-full sm:min-w-[160px] sm:flex-1">
          <label>TO</label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <MapPin size={15} color="#1677FF" style={{ flexShrink: 0 }} />
            <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Destination station" />
          </div>
        </div>

        {/* DATE */}
        <div className="search-field w-full sm:min-w-[150px] sm:flex-1">
          <label>DEPARTURE</label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Calendar size={15} color="#1677FF" style={{ flexShrink: 0 }} />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ cursor: "pointer" }} />
          </div>
        </div>

        {/* Quick date buttons */}
        <div className="quick-date-row" style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          {[{ label: "Tomorrow", d: tomorrow }, { label: "Day After", d: dayAfter }].map(({ label, d }) => (
            <button
              key={label}
              onClick={() => setDate(fmt(d))}
              style={{ background: "#fff", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 20, padding: "6px 12px", fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              {label}
            </button>
          ))}
        </div>

      </div>

      {/* Search */}
      <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
        <button
          onClick={handleSearch}
          className="search-action"
          style={{ display: "flex", alignItems: "center", gap: 8, background: "#1677FF", color: "#fff", border: "none", borderRadius: 999, padding: "13px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 20px rgba(22,119,255,0.4)", whiteSpace: "nowrap", flexShrink: 0, transition: "background 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1260d6")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#1677FF")}
        >
          <Search size={17} />
          Search Trains
        </button>
      </div>

      {/* Benefits */}
      <div className="search-benefits" style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
        {["✅  No cancellation fee", "⚡  Instant full refund", "🕐  24/7 support", "📋  No documentation required"].map((b) => (
          <span key={b} style={{ color: "rgba(255,255,255,0.88)", fontSize: 12, fontWeight: 500 }}>{b}</span>
        ))}
      </div>
    </div>
  );
}
