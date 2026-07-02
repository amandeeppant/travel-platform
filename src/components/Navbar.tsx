"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Wallet, Utensils, LayoutGrid, Phone, User,
  Menu, X, ChevronDown, Zap, Shield, Gift, Headphones,
  Train, Plane, Bus, Hotel, Map, Star
} from "lucide-react";

const SERVICES_MENU = [
  { icon: Train, label: "Train Booking", desc: "10,000+ daily trains", color: "#3B82F6" },
  { icon: Plane, label: "Flight Booking", desc: "50+ airline partners", color: "#8B5CF6" },
  { icon: Bus, label: "Bus Booking", desc: "500+ operators", color: "#10B981" },
  { icon: Hotel, label: "Hotel Booking", desc: "1M+ properties", color: "#F59E0B" },
  { icon: Map, label: "Tour Packages", desc: "Curated experiences", color: "#EF4444" },
  { icon: Star, label: "Holiday Deals", desc: "Exclusive offers", color: "#EC4899" },
];

export default function Navbar({ forceLight = false }: { forceLight?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [notifCount] = useState(3);

  // Added drawerStyle constant for right-side mobile drawer
  const drawerStyle = {
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100vh',
    width: '280px', // configurable width
    maxWidth: '80vw',
    background: '#ffffff',
    padding: '16px 20px',
    overflowY: 'auto',
    boxShadow: '-4px 0 12px rgba(0,0,0,0.1)',
    zIndex: 200,
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close services dropdown on outside click
  useEffect(() => {
    const fn = () => setServicesOpen(false);
    if (servicesOpen) document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, [servicesOpen]);

  const isLight = forceLight || scrolled;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: "all 0.35s ease",
          background: (forceLight || scrolled)
            ? "rgba(255,255,255,0.96)"
            : "transparent",
          backdropFilter: (forceLight || scrolled) ? "blur(24px)" : "none",
          WebkitBackdropFilter: (forceLight || scrolled) ? "blur(24px)" : "none",
          boxShadow: (forceLight || scrolled) ? "0 1px 0 rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* ─── LOGO ─── */}
          <motion.a
            href="/"
            whileHover={{ scale: 1.03 }}
            style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", flexShrink: 0 }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #1677FF 0%, #0ea5e9 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(22,119,255,0.4)",
                flexShrink: 0,
              }}
            >
              <span style={{ color: "#fff", fontWeight: 900, fontSize: "17px", letterSpacing: "-1px" }}>T</span>
            </div>
            <div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "19px",
                  letterSpacing: "-0.02em",
                  color: isLight ? "#111111" : "#ffffff",
                  transition: "color 0.3s",
                  display: "block",
                  lineHeight: 1,
                }}
              >
                TravelEase
              </span>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  color: isLight ? "#1677FF" : "rgba(255,255,255,0.6)",
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                Book. Explore. Go.
              </span>
            </div>
          </motion.a>

          {/* ─── DESKTOP NAV ─── */}
          <nav className="nav-desktop-only" style={{ alignItems: "center", gap: "2px" }}>

            {/* MEAL */}
            <NavItem icon={<Utensils size={13} />} label="MEAL" isLight={isLight} />

            {/* E-WALLET */}
            <NavItem icon={<Wallet size={13} />} label="E-WALLET" isLight={isLight} />

            {/* ALERTS with badge */}
            <div style={{ position: "relative" }}>
              <NavItem icon={<Bell size={13} />} label="ALERTS" isLight={isLight} />
              {notifCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "10px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "#EF4444",
                    border: "2px solid",
                    borderColor: isLight ? "#fff" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    fontWeight: 800,
                    color: "#fff",
                  }}
                >
                  {notifCount}
                </motion.div>
              )}
            </div>

            {/* SERVICES — with dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={(e) => { e.stopPropagation(); setServicesOpen(!servicesOpen); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  border: "none",
                  cursor: "pointer",
                  background: servicesOpen
                    ? (isLight ? "rgba(22,119,255,0.08)" : "rgba(255,255,255,0.15)")
                    : "transparent",
                  color: servicesOpen
                    ? "#1677FF"
                    : (isLight ? "#6B7280" : "rgba(255,255,255,0.88)"),
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isLight ? "rgba(22,119,255,0.08)" : "rgba(255,255,255,0.12)";
                  e.currentTarget.style.color = isLight ? "#1677FF" : "#fff";
                }}
                onMouseLeave={(e) => {
                  if (!servicesOpen) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = isLight ? "#6B7280" : "rgba(255,255,255,0.88)";
                  }
                }}
              >
                <LayoutGrid size={13} />
                SERVICES
                <motion.span animate={{ rotate: servicesOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown size={11} />
                </motion.span>
              </button>

              {/* SERVICES MEGA DROPDOWN */}
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 12px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "380px",
                      background: "#ffffff",
                      borderRadius: "20px",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
                      padding: "16px",
                      zIndex: 200,
                    }}
                  >
                    {/* Arrow */}
                    <div style={{ position: "absolute", top: "-6px", left: "50%", transform: "translateX(-50%)", width: "12px", height: "12px", background: "#fff", rotate: "45deg", boxShadow: "-2px -2px 4px rgba(0,0,0,0.04)" }} />

                    <p style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px", paddingLeft: "4px" }}>
                      All Services
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                      {SERVICES_MENU.map((svc) => {
                        const SvcIcon = svc.icon;
                        return (
                          <motion.a
                            key={svc.label}
                            href="#"
                            whileHover={{ x: 3, background: "#f8faff" }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "10px 12px",
                              borderRadius: "12px",
                              textDecoration: "none",
                              transition: "all 0.15s",
                            }}
                          >
                            <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: svc.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <SvcIcon size={16} color={svc.color} />
                            </div>
                            <div>
                              <p style={{ fontSize: "13px", fontWeight: 600, color: "#111", lineHeight: 1.2 }}>{svc.label}</p>
                              <p style={{ fontSize: "11px", color: "#9ca3af", lineHeight: 1.2 }}>{svc.desc}</p>
                            </div>
                          </motion.a>
                        );
                      })}
                    </div>
                    {/* Bottom CTA */}
                    <div style={{ marginTop: "12px", padding: "12px", background: "linear-gradient(135deg, #EFF6FF, #F5F3FF)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Zap size={15} color="#1677FF" />
                        <div>
                          <p style={{ fontSize: "12px", fontWeight: 700, color: "#111" }}>Try AI Travel Planner</p>
                          <p style={{ fontSize: "10px", color: "#6B7280" }}>Plan your perfect trip in seconds</p>
                        </div>
                      </div>
                      <button style={{ background: "#1677FF", color: "#fff", border: "none", borderRadius: "8px", padding: "6px 12px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>Try Now</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CONTACT US */}
            <button
              onClick={() => setContactOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "8px 12px",
                borderRadius: "10px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: isLight ? "#6B7280" : "rgba(255,255,255,0.88)",
                textDecoration: "none",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = isLight ? "rgba(22,119,255,0.07)" : "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.color = isLight ? "#1677FF" : "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = isLight ? "#6B7280" : "rgba(255,255,255,0.88)"; }}
            >
              <Phone size={13} />
              CONTACT US
            </button>
          </nav>

          {/* ─── RIGHT ACTIONS ─── */}
          <div className="nav-desktop-only" style={{ alignItems: "center", gap: "10px", flexShrink: 0 }}>

            {/* Quick perks */}
            <div
              className="hidden xl:flex"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              {[
                { icon: <Shield size={13} />, text: "Secure" },
                { icon: <Gift size={13} />, text: "Offers" },
                { icon: <Headphones size={13} />, text: "Support" },
              ].map((perk) => (
                <motion.button
                  key={perk.text}
                  whileHover={{ y: -1 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "5px 10px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: 600,
                    border: "1px solid",
                    borderColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.15)",
                    background: isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.08)",
                    color: isLight ? "#6B7280" : "rgba(255,255,255,0.8)",
                    cursor: "pointer",
                  }}
                >
                  {perk.icon}
                  {perk.text}
                </motion.button>
              ))}
            </div>

            {/* Login button */}
            <motion.a
              href="/login"
              whileHover={{ scale: 1.04, boxShadow: "0 6px 20px rgba(22,119,255,0.4)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                background: "linear-gradient(135deg, #1677FF 0%, #0ea5e9 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "999px",
                padding: "9px 20px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(22,119,255,0.35)",
                whiteSpace: "nowrap",
                letterSpacing: "0.01em",
                textDecoration: "none",
              }}
            >
              <User size={14} />
              Login / Register
            </motion.a>

          </div>

          {/* ─── MOBILE HAMBURGER (only visible on mobile) ─── */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            className="nav-mobile-only"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              border: "1.5px solid",
              borderColor: isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.25)",
              background: isLight ? "#fff" : "rgba(255,255,255,0.12)",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: isLight ? "#111" : "#fff",
              flexShrink: 0,
            }}
          >
            <AnimatePresence mode="wait">
              {mobileOpen
                ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={20} /></motion.span>
                : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={20} /></motion.span>
              }
            </AnimatePresence>
          </motion.button>
        </div>

       <AnimatePresence>
  {mobileOpen && (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 120,
        }}
        onClick={() => setMobileOpen(false)}
      />
      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
        style={drawerStyle}
        className="mobile-drawer"
      >
        <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {[{ icon: Utensils, label: "Meal" },{ icon: Wallet, label: "E-Wallet" },{ icon: Bell, label: "Alerts" },{ icon: LayoutGrid, label: "Services" },{ icon: Phone, label: "Contact Us" }].map(({ icon: Icon, label }) => (
            label === "Contact Us" ? (
              <button
                key={label}
                onClick={() => { setContactOpen(true); setMobileOpen(false); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "11px 14px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151",
                  textDecoration: "none",
                  transition: "all 0.15s",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#EFF6FF"; (e.currentTarget as HTMLElement).style.color = "#1677FF"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#374151"; }}
              >
                <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={15} color="#1677FF" />
                </div>
                {label}
              </button>
            ) : (
              <a
                key={label}
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "11px 14px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151",
                  textDecoration: "none",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#EFF6FF"; e.currentTarget.style.color = "#1677FF"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#374151"; }}
              >
                <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={15} color="#1677FF" />
                </div>
                {label}
              </a>
            )
          ))}
          <a
            href="/register"
            style={{
              marginTop: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: "linear-gradient(135deg, #1677FF, #0ea5e9)",
              color: "#fff",
              borderRadius: "12px",
              padding: "12px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            <User size={15} />
            Login / Register
          </a>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>

        {/* Contact modal */}
        <AnimatePresence>
          {contactOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setContactOpen(false)}
                style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 120 }}
              />
              <motion.div
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 12, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ position: "fixed", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 121, width: 340 }}
              >
                <div style={{ background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 20px 60px rgba(2,6,23,0.2)", color: "#111" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Contact Us</h3>
                    <button onClick={() => setContactOpen(false)} style={{ border: "none", background: "transparent", cursor: "pointer" }}><X size={18} /></button>
                  </div>
                  <div style={{ fontSize: 13, color: "#374151", marginBottom: 10 }}>
                    <div style={{ marginBottom: 8 }}><strong>Phone:</strong> <span style={{ marginLeft: 8 }}>+91-8532068799</span></div>
                    <div><strong>Email:</strong> <a href="mailto:deepaman75655@gmail.com" style={{ color: "#1677FF", fontWeight: 700, textDecoration: "none" }}>deepaman75655@gmail.com</a></div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <button onClick={() => setContactOpen(false)} style={{ background: "#F3F4F6", border: "none", padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}>Close</button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

// Reusable nav item
function NavItem({ icon, label, isLight, href }: { icon: React.ReactNode; label: string; isLight: boolean; href?: string }) {
  return (
    <motion.a
      href={href ?? "#"}
      whileHover={{ y: -1 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        padding: "8px 12px",
        borderRadius: "10px",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        color: isLight ? "#6B7280" : "rgba(255,255,255,0.88)",
        textDecoration: "none",
        transition: "all 0.2s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isLight ? "rgba(22,119,255,0.07)" : "rgba(255,255,255,0.12)";
        e.currentTarget.style.color = isLight ? "#1677FF" : "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = isLight ? "#6B7280" : "rgba(255,255,255,0.88)";
      }}
    >
      {icon}
      {label}
    </motion.a>
  );
}
