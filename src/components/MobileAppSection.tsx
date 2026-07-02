"use client";
import { motion } from "framer-motion";
import { Apple, Play, Star } from "lucide-react";

export default function MobileAppSection() {
  return (
    <section style={{ padding: "64px 24px", maxWidth: "1400px", margin: "0 auto", overflow: "hidden" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "28px",
          padding: "60px 56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "40px",
          background: "linear-gradient(130deg, #FF6B35 0%, #FF8E4A 40%, #FFAD60 100%)",
          boxShadow: "0 24px 64px rgba(255,107,53,0.28)",
          flexWrap: "wrap",
        }}
      >
        {/* Bg circles */}
        <div style={{ position: "absolute", top: "-60px", right: "280px", width: "320px", height: "320px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", left: "40%", width: "260px", height: "260px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{ flex: 1, minWidth: "280px", position: "relative", zIndex: 1 }}
        >
          <span
            style={{
              background: "rgba(255,255,255,0.22)",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 700,
              padding: "5px 12px",
              borderRadius: "999px",
              display: "inline-block",
              marginBottom: "16px",
              letterSpacing: "0.08em",
            }}
          >
            📱 MOBILE APP
          </span>

          <h2
            style={{
              color: "#fff",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "14px",
              fontSize: "clamp(28px, 4vw, 48px)",
            }}
          >
            Your journey,<br />Just a Tap Away
          </h2>
          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "15px", marginBottom: "28px", maxWidth: "380px", lineHeight: 1.6 }}>
            Download the TravelEase app for exclusive deals, real-time tracking, and instant bookings.
          </p>

          {/* Ratings */}
          <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "28px" }}>
            {[
              { score: "4.9", label: "App Store" },
              { score: "4.8", label: "Google Play" },
              { score: "10M+", label: "Downloads" },
            ].map((stat, i) => (
              <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                {i > 0 && <div style={{ width: "1px", height: "36px", background: "rgba(255,255,255,0.25)" }} />}
                <div style={{ textAlign: "center" }}>
                  {i < 2 && (
                    <div style={{ display: "flex", gap: "2px", justifyContent: "center", marginBottom: "2px" }}>
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={11} fill="#fff" color="#fff" />
                      ))}
                    </div>
                  )}
                  <p style={{ color: "#fff", fontWeight: 900, fontSize: "18px", lineHeight: 1 }}>{stat.score}</p>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", marginTop: "2px" }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Store Buttons */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {[
              { icon: <Apple size={22} />, line1: "Download on the", line2: "App Store" },
              { icon: <Play size={18} fill="#fff" />, line1: "Get it on", line2: "Google Play" },
            ].map((btn) => (
              <motion.button
                key={btn.line2}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "#000",
                  color: "#fff",
                  border: "none",
                  borderRadius: "14px",
                  padding: "12px 20px",
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                }}
              >
                {btn.icon}
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: "9px", color: "#aaa", lineHeight: 1, marginBottom: "2px" }}>{btn.line1}</p>
                  <p style={{ fontSize: "14px", fontWeight: 700, lineHeight: 1 }}>{btn.line2}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Phone mockups */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        className="hidden sm:flex"
          style={{
            alignItems: "flex-end",
            gap: "16px",
            flexShrink: 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Phone 1 – back */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            style={{
              width: "140px",
              height: "270px",
              borderRadius: "28px",
              background: "linear-gradient(170deg, #60A5FA, #3B82F6)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
              border: "3px solid rgba(255,255,255,0.3)",
              position: "relative",
              overflow: "hidden",
              marginBottom: "30px",
              padding: "14px 10px",
            }}
          >
            <div style={{ width: "50px", height: "4px", background: "rgba(255,255,255,0.4)", borderRadius: "2px", margin: "0 auto 10px" }} />
            {[...Array(5)].map((_, j) => (
              <div key={j} style={{ background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "8px", marginBottom: "6px" }}>
                <div style={{ height: "6px", background: "rgba(255,255,255,0.35)", borderRadius: "3px", marginBottom: "4px", width: `${70 - j * 8}%` }} />
                <div style={{ height: "5px", background: "rgba(255,255,255,0.2)", borderRadius: "3px", width: `${55 - j * 5}%` }} />
              </div>
            ))}
          </motion.div>

          {/* Phone 2 – front */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "165px",
              height: "320px",
              borderRadius: "32px",
              background: "linear-gradient(170deg, #FB923C, #DC2626)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
              border: "3px solid rgba(255,255,255,0.35)",
              position: "relative",
              overflow: "hidden",
              padding: "16px 12px",
              zIndex: 2,
            }}
          >
            <div style={{ width: "60px", height: "4px", background: "rgba(255,255,255,0.45)", borderRadius: "2px", margin: "0 auto 12px" }} />
            <div style={{ background: "rgba(255,255,255,0.22)", borderRadius: "14px", padding: "12px", marginBottom: "10px" }}>
              <p style={{ color: "#fff", fontSize: "8px", fontWeight: 700, marginBottom: "6px" }}>🚄 QUICK BOOK</p>
              {[...Array(2)].map((_, j) => (
                <div key={j} style={{ background: "rgba(255,255,255,0.28)", borderRadius: "8px", padding: "6px", marginBottom: "4px" }}>
                  <div style={{ height: "6px", background: "rgba(255,255,255,0.5)", borderRadius: "3px", width: "75%" }} />
                </div>
              ))}
              <div style={{ background: "#fff", borderRadius: "8px", padding: "5px", marginTop: "6px", textAlign: "center" }}>
                <span style={{ color: "#EA580C", fontSize: "8px", fontWeight: 800 }}>SEARCH TRAINS</span>
              </div>
            </div>
            {[...Array(3)].map((_, j) => (
              <div key={j} style={{ background: "rgba(255,255,255,0.18)", borderRadius: "12px", padding: "8px", marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "8px", background: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                <div>
                  <div style={{ height: "5px", background: "rgba(255,255,255,0.4)", borderRadius: "3px", width: "60px", marginBottom: "4px" }} />
                  <div style={{ height: "4px", background: "rgba(255,255,255,0.25)", borderRadius: "3px", width: "40px" }} />
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
