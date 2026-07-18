"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tag, Copy, Check } from "lucide-react";

type Offer = {
  id: string;
  percentOff: number | string;
  note: string;
  couponCode: string;
  validity: string;
  lives: number;
};

const gradients = [
  "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
  "linear-gradient(135deg, #A855F7 0%, #EC4899 100%)",
  "linear-gradient(135deg, #F97316 0%, #EF4444 100%)",
  "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)",
];

export default function OffersSection() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const response = await fetch("/api/offers");
        const data = await response.json();
        setOffers(Array.isArray(data) ? data : []);
      } catch (error) {
        setOffers([]);
      }
    };

    loadOffers();
  }, []);

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section id="offers-section" className="home-section" style={{ padding: "64px 24px", maxWidth: "1400px", margin: "0 auto" }}>
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
        {offers.length === 0 ? null : offers.map((offer, i) => (
          <motion.div
            key={offer.id}
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
              background: gradients[i % gradients.length],
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
                {typeof offer.percentOff === "number" && Number.isFinite(offer.percentOff)
                  ? `${offer.percentOff}% OFF`
                  : String(offer.percentOff)}
              </span>
              <h3 style={{ fontSize: "28px", fontWeight: 900, lineHeight: 1.1, marginBottom: "6px" }}>
                {offer.note}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "13px", marginBottom: "16px", lineHeight: 1.4 }}>
                Valid for {offer.lives} {offer.lives === 1 ? "use" : "uses"}
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
                    {offer.couponCode}
                  </span>
                </div>
                <button
                  onClick={() => copy(offer.couponCode)}
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
                  {copied === offer.couponCode ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                  {copied === offer.couponCode ? "Copied!" : "Copy"}
                </button>
              </div>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "11px", marginTop: "8px" }}>
                {offer.validity}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
