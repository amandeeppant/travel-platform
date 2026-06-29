"use client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

export function StatCard({ icon: Icon, label, value, change, color, bg, delay = 0 }: {
  icon: LucideIcon; label: string; value: string; change?: string; positive?: boolean; color: string; bg: string; delay?: number;
}) {
  const isUp = change?.startsWith("+");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.1)" }}
      style={{ background: "#fff", borderRadius: 16, padding: "20px 22px", border: "1px solid #f0f0f0", boxShadow: "0 4px 16px rgba(0,0,0,0.05)", cursor: "default" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={20} color={color} />
        </div>
        {change && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: isUp ? "#f0fdf4" : "#fef2f2", borderRadius: 999, padding: "3px 8px" }}>
            {isUp ? <TrendingUp size={11} color="#16a34a" /> : <TrendingDown size={11} color="#dc2626" />}
            <span style={{ fontSize: 11, fontWeight: 700, color: isUp ? "#16a34a" : "#dc2626" }}>{change}</span>
          </div>
        )}
      </div>
      <p style={{ fontSize: 26, fontWeight: 900, color: "#111", lineHeight: 1, marginBottom: 4 }}>{value}</p>
      <p style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>{label}</p>
    </motion.div>
  );
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111", lineHeight: 1.2 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 3 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f0f0f0", boxShadow: "0 4px 16px rgba(0,0,0,0.05)", overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

export function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>{label}</span>
  );
}

export function PrimaryButton({ label, onClick, color = "#1677FF", icon: Icon }: { label: string; onClick?: () => void; color?: string; icon?: LucideIcon }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      style={{ display: "flex", alignItems: "center", gap: 6, background: color, color: "#fff", border: "none", borderRadius: 999, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 14px ${color}40` }}
    >
      {Icon && <Icon size={14} />}
      {label}
    </motion.button>
  );
}
