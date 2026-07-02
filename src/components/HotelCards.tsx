"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";

const HOTELS = [
  {
    name: "Burj Al Arab",
    address: "Jumeirah Beach Road, Dubai",
    rating: 4.9,
    reviews: 12430,
    price: "₹45,000",
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
    badge: "Luxury",
  },
  {
    name: "Atlantis The Palm",
    address: "Palm Jumeirah, Dubai",
    rating: 4.7,
    reviews: 9850,
    price: "₹28,500",
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    badge: "Resort",
  },
  {
    name: "Address Downtown",
    address: "Downtown Dubai, UAE",
    rating: 4.8,
    reviews: 7320,
    price: "₹22,000",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    badge: "5 Star",
  },
  {
    name: "Jumeirah Beach Hotel",
    address: "Jumeirah, Dubai, UAE",
    rating: 4.6,
    reviews: 6100,
    price: "₹18,750",
    img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
    badge: "Beachfront",
  },
];

export default function HotelCards() {
  return (
    <section className="px-4 md:px-6 py-10 md:py-16" style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-0 mb-7"
      >
        <div>
          <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#111111", marginBottom: "6px" }}>
            Top Hotels in Dubai
          </h2>
          <p style={{ fontSize: "14px", color: "#6B7280" }}>Handpicked luxury stays at best prices</p>
        </div>
        <button style={{ fontSize: "13px", fontWeight: 600, color: "#1677FF", background: "none", border: "none", cursor: "pointer" }}>
          View All →
        </button>
      </motion.div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "20px",
        }}
      >
        {HOTELS.map((hotel, i) => (
          <motion.div
            key={hotel.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            whileHover={{ y: -10, boxShadow: "0 24px 60px rgba(0,0,0,0.16)" }}
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              overflow: "hidden",
              cursor: "pointer",
              boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
              border: "1px solid #f0f0f0",
              transition: "all 0.3s ease",
            }}
          >
            {/* Image */}
            <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
              <Image
                src={hotel.img}
                alt={hotel.name}
                fill
                style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                sizes="(max-width:640px) 100vw, (max-width:1200px) 50vw, 25vw"
                onMouseEnter={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1.06)")}
                onMouseLeave={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1)")}
              />
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  background: "#1677FF",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "999px",
                }}
              >
                {hotel.badge}
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111", marginBottom: "4px" }}>
                {hotel.name}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#9ca3af", marginBottom: "12px" }}>
                <MapPin size={11} />
                <span style={{ fontSize: "11px" }}>{hotel.address}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "#f0fdf4",
                      color: "#16a34a",
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "4px 8px",
                      borderRadius: "8px",
                    }}
                  >
                    <Star size={11} fill="#16a34a" />
                    {hotel.rating}
                  </div>
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                    ({hotel.reviews.toLocaleString()})
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "10px", color: "#9ca3af" }}>per night</p>
                  <p style={{ fontSize: "16px", fontWeight: 900, color: "#111" }}>{hotel.price}</p>
                </div>
              </div>

              <button
                style={{
                  width: "100%",
                  marginTop: "12px",
                  background: "#1677FF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "999px",
                  padding: "10px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1260d6")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#1677FF")}
              >
                Book Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
