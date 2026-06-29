"use client";
import { motion } from "framer-motion";
import { Train, UtensilsCrossed, Hash, Armchair, FileCheck, MapPin, Radio, LayoutList } from "lucide-react";

const ACTIONS = [
  { icon: Train,          label: "Metro Ticket",        bg: "#EFF6FF", color: "#2563EB" },
  { icon: UtensilsCrossed,label: "Order Food On Train",  bg: "#FFF7ED", color: "#EA580C" },
  { icon: Hash,           label: "Train By Name/No.",    bg: "#FAF5FF", color: "#9333EA" },
  { icon: Armchair,       label: "Seat Availability",   bg: "#F0FDF4", color: "#16A34A" },
  { icon: FileCheck,      label: "PNR Status",          bg: "#FEFCE8", color: "#CA8A04" },
  { icon: MapPin,         label: "Platform Locator",    bg: "#FFF1F2", color: "#E11D48" },
  { icon: Radio,          label: "Live Status",         bg: "#ECFEFF", color: "#0891B2" },
  { icon: LayoutList,     label: "Coach Position",      bg: "#FDF4FF", color: "#C026D3" },
];

export default function QuickActions() {
  return (
    <section style={{ padding: "48px 24px", maxWidth: "1400px", margin: "0 auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gap: "16px",
        }}
      >
        {ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(0,0,0,0.12)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                padding: "20px 12px",
                borderRadius: "20px",
                background: "#ffffff",
                border: "1px solid #f3f4f6",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  background: action.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={26} color={action.color} />
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#374151",
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
