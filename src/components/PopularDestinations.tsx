"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Train } from "lucide-react";

const DESTINATIONS = [
  { name: "New Delhi", trains: "1,240 trains", img: "https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?w=500&q=80" },
  { name: "Goa",       trains: "380 trains",   img: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=500&q=80" },
  { name: "Chennai",   trains: "920 trains",   img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&q=80" },
  { name: "Mumbai",    trains: "1,580 trains", img: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=500&q=80" },
  { name: "Kolkata",   trains: "860 trains",   img: "https://images.unsplash.com/photo-1558431382-27e303142255?w=500&q=80" },
  { name: "Dwarka",    trains: "210 trains",   img: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=500&q=80" },
];

export default function PopularDestinations() {
  return (
    <section style={{ padding: "64px 24px", maxWidth: "1400px", margin: "0 auto" }}>
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
            Popular Destinations
          </h2>
          <p style={{ fontSize: "14px", color: "#6B7280" }}>Discover top travel spots across India</p>
        </div>
        <button style={{ fontSize: "13px", fontWeight: 600, color: "#1677FF", background: "none", border: "none", cursor: "pointer" }}>
          View All →
        </button>
      </motion.div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        {DESTINATIONS.map((dest, i) => (
          <motion.div
            key={dest.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.07 }}
            whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(0,0,0,0.18)" }}
            style={{
              position: "relative",
              height: "260px",
              borderRadius: "20px",
              overflow: "hidden",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
            }}
          >
            <Image
              src={dest.img}
              alt={dest.name}
              fill
              style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
              sizes="(max-width:640px) 50vw, (max-width:1200px) 33vw, 17vw"
              onMouseEnter={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1.08)")}
              onMouseLeave={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1)")}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 60%, transparent 100%)",
              }}
            />
            <div style={{ position: "absolute", bottom: "14px", left: "14px", right: "14px" }}>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: "16px", lineHeight: 1.2 }}>{dest.name}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "5px" }}>
                <Train size={11} color="rgba(255,255,255,0.8)" />
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px", fontWeight: 500 }}>{dest.trains}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
