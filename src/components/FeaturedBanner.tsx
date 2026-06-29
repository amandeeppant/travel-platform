"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function FeaturedBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section style={{ padding: "0 24px 64px", maxWidth: "1400px", margin: "0 auto" }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          position: "relative",
          height: "320px",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 16px 48px rgba(0,0,0,0.14)",
        }}
      >
        <motion.div style={{ position: "absolute", inset: "-10%", y: imgY }}>
          <Image
            src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1400&q=80"
            alt="Train journey"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </motion.div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            padding: "0 48px",
          }}
        >
          <div>
            <span
              style={{
                background: "#1677FF",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: "999px",
                display: "inline-block",
                marginBottom: "12px",
                letterSpacing: "0.05em",
              }}
            >
              SPECIAL OFFER
            </span>
            <h3
              style={{
                color: "#fff",
                fontSize: "clamp(24px, 3vw, 40px)",
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: "10px",
              }}
            >
              Explore India by Train<br />This Season
            </h3>
            <p style={{ color: "rgba(255,255,255,0.78)", marginBottom: "20px", fontSize: "14px" }}>
              Get up to 40% off on select routes
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "#ffffff",
                color: "#111111",
                border: "none",
                borderRadius: "999px",
                padding: "10px 24px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              }}
            >
              Book Now →
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
