"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Tag, Copy, Check } from "lucide-react";

const OFFERS = [
  {
    tag: "TRAINS",
    headline: "Flat 45% Off",
    sub: "On all Rajdhani Express bookings",
    code: "RAIL45",
    bg: "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
    valid: "Valid till 31 Dec",
  },
  {
    tag: "FLIGHTS",
    headline: "Flat 15% Off",
    sub: "International flights to Dubai & Singapore",
    code: "FLY15",
    bg: "linear-gradient(135deg, #A855F7 0%, #EC4899 100%)",
    valid: "Valid till 15 Jan",
  },
  {
    tag: "HOTELS",
    headline: "Flat ₹700 Off",
    sub: "On luxury hotels above ₹5,000/night",
    code: "HOTEL700",
    bg: "linear-gradient(135deg, #F97316 0%, #EF4444 100%)",
    valid: "Valid till 30 Nov",
  },
  {
    tag: "BUS",
    headline: "Buy 1 Get 1",
    sub: "On selected inter-city bus routes",
    code: "BUS2X",
    bg: "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)",
    valid: "Weekends only",
  },
];

export default function OffersSection() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="home-section" style={{ padding: "64px 24px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "28px" }}
      >
        <div>
          <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#111111", marginBottom: "6px" }}>
            Best offers for you
          </h2>
          <p style={{ fontSize: "14px", color: "#6B7280" }}>Exclusive deals you won&apos;t find anywhere else</p>
        </div>
        <button style={{ fontSize: "13px", fontWeight: 600, color: "#1677FF", background: "none", border: "none", cursor: "pointer" }}>
          All Offers →
        </button>
      </motion.div>

      {/* Grid */}
      <div
        className="offer-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "16px",
        }}
      >
        {OFFERS.map((offer, i) => (
          <motion.div
            key={offer.code}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            whileHover={{ y: -8, scale: 1.02 }}
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "20px",
              padding: "24px",
              background: offer.bg,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {/* Decorative circles */}
            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-30px",
                left: "-15px",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <span
                style={{
                  background: "rgba(255,255,255,0.22)",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "999px",
                  display: "inline-block",
                  marginBottom: "10px",
                  letterSpacing: "0.08em",
                }}
              >
                {offer.tag}
              </span>
              <h3 style={{ fontSize: "28px", fontWeight: 900, lineHeight: 1.1, marginBottom: "6px" }}>
                {offer.headline}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "13px", marginBottom: "16px", lineHeight: 1.4 }}>
                {offer.sub}
              </p>

              {/* Coupon row */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    flex: 1,
                  }}
                >
                  <Tag size={12} />
                  <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "13px", letterSpacing: "0.05em" }}>
                    {offer.code}
                  </span>
                </div>
                <button
                  onClick={() => copy(offer.code)}
                  style={{
                    background: "#ffffff",
                    color: "#374151",
                    border: "none",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.2s",
                  }}
                >
                  {copied === offer.code ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                  {copied === offer.code ? "Copied!" : "Copy"}
                </button>
              </div>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "11px", marginTop: "8px" }}>
                {offer.valid}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
