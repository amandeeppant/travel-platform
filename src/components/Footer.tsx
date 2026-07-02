"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Apple, Play, Mail, ArrowRight, Share2, MessageCircle, BookOpen, Briefcase } from "lucide-react";

const COLUMNS: Record<string, string[]> = {
  "Popular Cities": ["New Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"],
  "Services": ["Train Booking", "Flight Booking", "Bus Booking", "Hotel Booking", "Tour Packages", "Cab Rental", "Cruise Booking", "Holiday Packages"],
  "Partners": ["IRCTC", "Air India", "IndiGo", "SpiceJet", "OYO Rooms", "MakeMyTrip", "Cleartrip", "Agoda"],
  "About Us": ["Our Story", "Careers", "Press", "Blog", "Investor Relations", "Partnerships", "Sustainability", "Contact Us"],
};

const SOCIAL = [
  { icon: Share2,        label: "Twitter" },
  { icon: MessageCircle, label: "Facebook" },
  { icon: BookOpen,      label: "Blog" },
  { icon: Briefcase,     label: "LinkedIn" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer style={{ background: "#ffffff", borderTop: "1px solid #f0f0f0" }}>
      <div className="px-4 md:px-6 pt-10 md:pt-16 pb-8" style={{ maxWidth: "1400px", margin: "0 auto" }}>

        {/* Top grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-[1.4fr_repeat(4,1fr)] gap-10 mb-12"
        >
          {/* Brand column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "#1677FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontWeight: 900, fontSize: "16px" }}>T</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: "18px", color: "#111" }}>TravelEase</span>
            </div>
            <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.65, marginBottom: "20px" }}>
              Your one-stop platform for trains, flights, hotels &amp; more. Travel smart.
            </p>

            <p style={{ fontSize: "11px", fontWeight: 700, color: "#111", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
              Stay Updated
            </p>
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "9px 12px" }}>
                <Mail size={13} color="#9ca3af" />
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "13px", color: "#111" }}
                />
              </div>
              <button style={{ background: "#1677FF", border: "none", borderRadius: "10px", padding: "9px 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowRight size={15} color="#fff" />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                style={{ display: "flex", alignItems: "center", gap: "8px", background: "#111", color: "#fff", border: "none", borderRadius: "10px", padding: "9px 14px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#374151")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#111")}
              >
                <Apple size={15} /> App Store
              </button>
              <button
                style={{ display: "flex", alignItems: "center", gap: "8px", background: "#111", color: "#fff", border: "none", borderRadius: "10px", padding: "9px 14px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#374151")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#111")}
              >
                <Play size={13} fill="#fff" /> Google Play
              </button>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(COLUMNS).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontSize: "11px", fontWeight: 700, color: "#111", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "14px" }}>
                {title}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href={link === "Contact Us" ? "mailto:deepaman75655@gmail.com" : "#"}
                      style={{ fontSize: "13px", color: "#6B7280", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#1677FF")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#f0f0f0] pt-6">
          <p style={{ fontSize: "12px", color: "#9ca3af" }}>
            © {new Date().getFullYear()} TravelEase. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "Sitemap"].map((link) => (
              <a
                key={link}
                href="#"
                style={{ fontSize: "12px", color: "#9ca3af", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#1677FF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
              >
                {link}
              </a>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {SOCIAL.map(({ icon: Icon, label }) => (
              <motion.a
                key={label}
                href="#"
                whileHover={{ scale: 1.15, y: -2 }}
                style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#EFF6FF")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#f3f4f6")}
              >
                <Icon size={15} color="#6B7280" />
              </motion.a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
