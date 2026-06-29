"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftRight, Search, SlidersHorizontal, Clock, CheckCircle2 } from "lucide-react";

const TRAINS = [
  {
    number: "12301",
    name: "Rajdhani Express",
    from: "NDLS", fromCity: "New Delhi",
    to: "MMCT", toCity: "Mumbai Central",
    dep: "16:55", arr: "08:35", duration: "15h 40m",
    days: "Mon Tue Wed Thu Fri Sat Sun",
    classes: [
      { cls: "1A", fare: "₹4,365", status: "AVL 12", avail: true },
      { cls: "2A", fare: "₹2,580", status: "AVL 45", avail: true },
      { cls: "3A", fare: "₹1,740", status: "WL 4",   avail: false },
    ],
  },
  {
    number: "12951",
    name: "Mumbai Rajdhani",
    from: "NDLS", fromCity: "New Delhi",
    to: "BCT",  toCity: "Mumbai Central",
    dep: "17:00", arr: "08:15", duration: "15h 15m",
    days: "Daily",
    classes: [
      { cls: "1A", fare: "₹4,895", status: "AVL 3",  avail: true  },
      { cls: "2A", fare: "₹2,840", status: "WL 2",   avail: false },
      { cls: "3A", fare: "₹1,950", status: "AVL 22", avail: true  },
      { cls: "SL", fare: "₹730",   status: "AVL 88", avail: true  },
    ],
  },
  {
    number: "22221",
    name: "CSMT Rajdhani",
    from: "NDLS", fromCity: "New Delhi",
    to: "CSMT",  toCity: "Chhatrapati Shivaji",
    dep: "11:00", arr: "05:45", duration: "18h 45m",
    days: "Tue Thu Sun",
    classes: [
      { cls: "2A", fare: "₹2,610", status: "AVL 17", avail: true  },
      { cls: "3A", fare: "₹1,780", status: "AVL 34", avail: true  },
      { cls: "SL", fare: "₹680",   status: "WL 12",  avail: false },
    ],
  },
];

const DATES = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return {
    day: d.toLocaleDateString("en-IN", { weekday: "short" }),
    date: d.getDate(),
    month: d.toLocaleDateString("en-IN", { month: "short" }),
    full: d.toISOString().split("T")[0],
  };
});

export default function TrainResults() {
  const [selectedDate, setSelectedDate] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <section style={{ padding: "64px 24px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#111", marginBottom: "6px" }}>
          Train Search Results
        </h2>
        <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "24px" }}>
          New Delhi → Mumbai &nbsp;·&nbsp; {TRAINS.length} trains found
        </p>

        {/* Search Bar */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "14px 18px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "12px",
            marginBottom: "14px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            border: "1px solid #f0f0f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "240px" }}>
            <div
              style={{
                background: "#f9fafb",
                borderRadius: "10px",
                padding: "8px 14px",
                fontWeight: 600,
                fontSize: "14px",
                color: "#111",
                flex: 1,
                textAlign: "center",
              }}
            >
              New Delhi
            </div>
            <button
              style={{
                width: "32px", height: "32px", borderRadius: "50%", background: "#1677FF",
                border: "none", cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0,
              }}
            >
              <ArrowLeftRight size={13} color="#fff" />
            </button>
            <div
              style={{
                background: "#f9fafb",
                borderRadius: "10px",
                padding: "8px 14px",
                fontWeight: 600,
                fontSize: "14px",
                color: "#111",
                flex: 1,
                textAlign: "center",
              }}
            >
              Mumbai
            </div>
          </div>
          <button
            style={{
              display: "flex", alignItems: "center", gap: "6px", background: "#1677FF",
              color: "#fff", border: "none", borderRadius: "999px", padding: "9px 18px",
              fontSize: "13px", fontWeight: 600, cursor: "pointer",
            }}
          >
            <Search size={13} />
            Search Again
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: showFilters ? "#EFF6FF" : "#f3f4f6",
              color: showFilters ? "#1677FF" : "#374151",
              border: "none", borderRadius: "999px", padding: "9px 16px",
              fontSize: "13px", fontWeight: 600, cursor: "pointer",
            }}
          >
            <SlidersHorizontal size={13} />
            Filters
          </button>
        </div>

        {/* Date Strip */}
        <div
          className="scrollbar-hide"
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "8px",
            marginBottom: "24px",
          }}
        >
          {DATES.map((d, i) => (
            <button
              key={d.full}
              onClick={() => setSelectedDate(i)}
              style={{
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "8px 18px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: 600,
                border: selectedDate === i ? "none" : "1px solid #e5e7eb",
                cursor: "pointer",
                background: selectedDate === i ? "#1677FF" : "#ffffff",
                color: selectedDate === i ? "#ffffff" : "#6B7280",
                boxShadow: selectedDate === i ? "0 4px 16px rgba(22,119,255,0.3)" : "none",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: "10px", opacity: 0.75 }}>{d.day}</span>
              <span style={{ fontWeight: 700 }}>{d.date} {d.month}</span>
            </button>
          ))}
        </div>

        {/* Main content: sidebar + cards */}
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
          {/* Filter Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                key="sidebar"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "240px" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                style={{ flexShrink: 0, overflow: "hidden" }}
              >
                <div
                  style={{
                    width: "240px",
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "18px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: "14px", color: "#111", marginBottom: "14px" }}>Filters</p>

                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", marginBottom: "10px", textTransform: "uppercase" }}>
                    Quick Filters
                  </p>
                  {["Available Only", "AC Classes", "Tatkal", "Alternate Trip"].map((f) => (
                    <label
                      key={f}
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 0", cursor: "pointer", fontSize: "13px", color: "#374151" }}
                    >
                      <input type="checkbox" style={{ accentColor: "#1677FF", width: "14px", height: "14px" }} />
                      {f}
                    </label>
                  ))}

                  <div style={{ height: "1px", background: "#f0f0f0", margin: "14px 0" }} />

                  {["Availability", "Ticket Class", "Quota", "Arriving Stations"].map((f) => (
                    <select
                      key={f}
                      style={{
                        width: "100%", background: "#f9fafb", border: "1px solid #e5e7eb",
                        borderRadius: "10px", padding: "8px 10px", fontSize: "12px",
                        color: "#374151", marginBottom: "8px", outline: "none", cursor: "pointer",
                      }}
                    >
                      <option>{f}</option>
                    </select>
                  ))}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Train Cards */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "14px" }}>
            {TRAINS.map((train, i) => (
              <motion.div
                key={train.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "20px 22px",
                  border: "1px solid #f0f0f0",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                  transition: "box-shadow 0.25s ease",
                }}
                whileHover={{ boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  {/* Left: train name + timing */}
                  <div style={{ flex: 1, minWidth: "260px" }}>
                    <div style={{ marginBottom: "12px" }}>
                      <span style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "monospace" }}>
                        #{train.number}
                      </span>
                      <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#111", lineHeight: 1.2 }}>
                        {train.name}
                      </h3>
                      <span style={{ fontSize: "11px", color: "#6B7280" }}>{train.days}</span>
                    </div>

                    {/* Timing row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: "22px", fontWeight: 900, color: "#111", lineHeight: 1 }}>
                          {train.dep}
                        </p>
                        <p style={{ fontSize: "11px", fontWeight: 600, color: "#1677FF", marginTop: "2px" }}>
                          {train.from}
                        </p>
                        <p style={{ fontSize: "10px", color: "#9ca3af" }}>{train.fromCity}</p>
                      </div>

                      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                          <Clock size={11} color="#9ca3af" />
                          <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 500 }}>{train.duration}</span>
                        </div>
                        <div style={{ width: "100%", height: "2px", background: "#e5e7eb", position: "relative", borderRadius: "2px" }}>
                          <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: "7px", height: "7px", borderRadius: "50%", background: "#1677FF" }} />
                          <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: "7px", height: "7px", borderRadius: "50%", background: "#1677FF" }} />
                        </div>
                      </div>

                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: "22px", fontWeight: 900, color: "#111", lineHeight: 1 }}>
                          {train.arr}
                        </p>
                        <p style={{ fontSize: "11px", fontWeight: 600, color: "#1677FF", marginTop: "2px" }}>
                          {train.to}
                        </p>
                        <p style={{ fontSize: "10px", color: "#9ca3af" }}>{train.toCity}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: class cards */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {train.classes.map((cls) => (
                      <motion.button
                        key={cls.cls}
                        whileHover={{ y: -3, scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          borderRadius: "12px",
                          padding: "10px 14px",
                          textAlign: "center",
                          minWidth: "78px",
                          background: cls.avail ? "#EAF7E6" : "#f9fafb",
                          border: cls.avail ? "1px solid #bbf7d0" : "1px solid #e5e7eb",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        <p style={{ fontSize: "11px", fontWeight: 700, color: "#374151" }}>{cls.cls}</p>
                        <p style={{ fontSize: "14px", fontWeight: 900, color: "#111", margin: "2px 0" }}>{cls.fare}</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "3px" }}>
                          {cls.avail && <CheckCircle2 size={10} color="#16a34a" />}
                          <span style={{ fontSize: "10px", fontWeight: 600, color: cls.avail ? "#16a34a" : "#f97316" }}>
                            {cls.status}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
