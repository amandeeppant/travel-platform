"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TrainSearch from "./search/TrainSearch";
import FlightSearch from "./search/FlightSearch";
import BusSearch from "./search/BusSearch";
import HotelSearch from "./search/HotelSearch";

const TABS = ["Trains", "Flights", "Bus", "Hotels"] as const;
type Tab = (typeof TABS)[number];

const TAB_CONFIG: Record<Tab, {
  icon: string;
  gradient: string;
  particles: string;
  badge: string;
  badgeText: string;
  stats: { label: string; value: string }[];
}> = {
  Trains: {
    icon: "🚄",
    gradient: "linear-gradient(135deg, #0f2027 0%, #203a43 40%, #2c5364 100%)",
    particles: "#4FC3F7",
    badge: "🎫 IRCTC Connected",
    badgeText: "10,000+ daily trains",
    stats: [
      { label: "Daily Trains", value: "10,000+" },
      { label: "Stations", value: "8,000+" },
      { label: "Passengers/Day", value: "2.3 Cr" },
    ],
  },
  Flights: {
    icon: "✈️",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
    particles: "#90CAF9",
    badge: "✈️ 50+ Airlines",
    badgeText: "Best fare guarantee",
    stats: [
      { label: "Airlines", value: "50+" },
      { label: "Destinations", value: "500+" },
      { label: "Daily Flights", value: "3,000+" },
    ],
  },
  Bus: {
    icon: "🚌",
    gradient: "linear-gradient(135deg, #134e5e 0%, #1a6b4a 40%, #2d6a4f 100%)",
    particles: "#A5D6A7",
    badge: "🚌 500+ Operators",
    badgeText: "AC & Sleeper buses",
    stats: [
      { label: "Operators", value: "500+" },
      { label: "Routes", value: "15,000+" },
      { label: "Cities", value: "1,200+" },
    ],
  },
  Hotels: {
    icon: "🏨",
    gradient: "linear-gradient(135deg, #2d1b69 0%, #6b21a8 40%, #7c3aed 100%)",
    particles: "#C084FC",
    badge: "🏨 1M+ Properties",
    badgeText: "Free cancellation available",
    stats: [
      { label: "Hotels", value: "1M+" },
      { label: "Countries", value: "90+" },
      { label: "Reviews", value: "500M+" },
    ],
  },
};

// Floating orb component
function Orb({ x, y, size, color, delay }: { x: string; y: string; size: number; color: string; delay: number }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}40 0%, ${color}00 70%)`,
        pointerEvents: "none",
      }}
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.4, 0.7, 0.4],
        x: [0, 30, -20, 0],
        y: [0, -25, 15, 0],
      }}
      transition={{
        duration: 8 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

// Animated grid lines
function GridLines() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* Horizontal lines */}
      {[20, 40, 60, 80].map((pct) => (
        <motion.div
          key={`h${pct}`}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${pct}%`,
            height: "1px",
            background: "rgba(255,255,255,0.04)",
          }}
          animate={{ scaleX: [0, 1], opacity: [0, 1] }}
          transition={{ duration: 1.5, delay: pct / 100 }}
        />
      ))}
      {/* Vertical lines */}
      {[20, 40, 60, 80].map((pct) => (
        <motion.div
          key={`v${pct}`}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${pct}%`,
            width: "1px",
            background: "rgba(255,255,255,0.04)",
          }}
          animate={{ scaleY: [0, 1], opacity: [0, 1] }}
          transition={{ duration: 1.5, delay: pct / 100 + 0.3 }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const [activeTab, setActiveTab] = useState<Tab>("Trains");
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const cfg = TAB_CONFIG[activeTab];

  // Video URLs — using more reliable CDN sources
  const VIDEO_URLS: Record<Tab, string> = {
    Trains: "https://www.w3schools.com/html/mov_bbb.mp4", // fallback test
    Flights: "https://www.w3schools.com/html/mov_bbb.mp4",
    Bus: "https://www.w3schools.com/html/mov_bbb.mp4",
    Hotels: "https://www.w3schools.com/html/mov_bbb.mp4",
  };

  useEffect(() => {
    setVideoLoaded(false);
  }, [activeTab]);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        maxWidth: "100vw",
      }}
    >
      {/* ── BACKGROUND LAYER ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + "-bg"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: "absolute",
            inset: 0,
            background: cfg.gradient,
          }}
        />
      </AnimatePresence>

      {/* Animated mesh gradient blobs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <Orb x="5%" y="10%" size={500} color={cfg.particles} delay={0} />
        <Orb x="65%" y="5%" size={400} color={cfg.particles} delay={2} />
        <Orb x="80%" y="55%" size={350} color={cfg.particles} delay={4} />
        <Orb x="10%" y="65%" size={300} color={cfg.particles} delay={1} />
        <Orb x="45%" y="80%" size={280} color={cfg.particles} delay={3} />
      </div>

      {/* Grid lines */}
      <GridLines />

      {/* Noise texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
          opacity: 0.6,
        }}
      />

      {/* Bottom gradient fade to page */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "180px",
          background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── CONTENT ── */}
      <div
        className="hero-content"
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "90px",
          paddingBottom: "56px",
          paddingLeft: "20px",
          paddingRight: "20px",
          minHeight: "100vh",
          gap: "0px",
        }}
      >
        {/* Badge */}
        <motion.div
          key={activeTab + "-badge"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hero-badge"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "999px",
            padding: "6px 16px",
            marginBottom: "24px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#fff",
            letterSpacing: "0.02em",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#4ade80",
              boxShadow: "0 0 8px #4ade80",
              animation: "pulse 2s infinite",
              flexShrink: 0,
            }}
          />
          {cfg.badge}
          <span style={{ color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>·</span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{cfg.badgeText}</span>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{ textAlign: "center", marginBottom: "10px" }}
        >
          <h1
            className="hero-title"
            style={{
              color: "#ffffff",
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              fontSize: "clamp(38px, 6.5vw, 78px)",
              textShadow: "0 4px 30px rgba(0,0,0,0.3)",
            }}
          >
            Your journey,
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Just a Tap Away
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hero-subtitle"
          style={{
            color: "rgba(255,255,255,0.72)",
            fontSize: "clamp(14px, 1.4vw, 18px)",
            maxWidth: "500px",
            textAlign: "center",
            lineHeight: 1.6,
            marginBottom: "32px",
          }}
        >
          Search great deals on trains, flights, hotels and more — all in one place
        </motion.p>

        {/* Stats Row */}
        <motion.div
          key={activeTab + "-stats"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="hero-stats"
          style={{
            display: "flex",
            gap: "0",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "16px",
            padding: "12px 0",
            marginBottom: "28px",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", overflowX: "auto", WebkitOverflowScrolling: "touch" }} className="scrollbar-hide">
          {cfg.stats.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                textAlign: "center",
                padding: "0 20px",
                borderRight: i < cfg.stats.length - 1 ? "1px solid rgba(255,255,255,0.12)" : "none",
                flexShrink: 0,
              }}
            >
              <p style={{ color: "#fff", fontWeight: 800, fontSize: "20px", lineHeight: 1.1 }}>{stat.value}</p>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "11px", marginTop: "3px", fontWeight: 500 }}>{stat.label}</p>
            </div>
          ))}
          </div>
        </motion.div>

        {/* Tab Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="hero-tabs"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "4px",
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "999px",
            padding: "5px",
            marginBottom: "18px",
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "9px 22px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 500,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  background: isActive ? "#ffffff" : "transparent",
                  color: isActive ? "#111111" : "rgba(255,255,255,0.85)",
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                  boxShadow: isActive ? "0 4px 16px rgba(0,0,0,0.2)" : "none",
                }}
              >
                <span style={{ fontSize: "15px" }}>{TAB_CONFIG[tab].icon}</span>
                {tab}
              </button>
            );
          })}
        </motion.div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          style={{ width: "100%", maxWidth: "1080px" }}
        >
          <div
            className="hero-search-card"
            style={{
              background: "rgba(255,255,255,0.13)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: "24px",
              padding: "28px 32px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22 }}
              >
                {activeTab === "Trains" && <TrainSearch />}
                {activeTab === "Flights" && <FlightSearch />}
                {activeTab === "Bus" && <BusSearch />}
                {activeTab === "Hotels" && <HotelSearch />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
            marginTop: "28px",
          }}
        >
          {[
            { icon: "🔒", text: "100% Secure Payments" },
            { icon: "⚡", text: "Instant Confirmation" },
            { icon: "💰", text: "Best Price Guaranteed" },
            { icon: "🎧", text: "24/7 Customer Support" },
          ].map((item) => (
            <div
              key={item.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                color: "rgba(255,255,255,0.7)",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              <span>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </section>
  );
}
