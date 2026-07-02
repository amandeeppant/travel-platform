"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Bell, Search, LogOut, Menu,
  LucideIcon
} from "lucide-react";
import { clearAuthData, getAuthUser, getPortalDisplayName, getPortalRouteForUser, type AuthUser } from "@/lib/authClient";

export type NavItem = {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: string;
};

type Props = {
  portalName: string;
  portalColor: string;
  portalBg: string;
  portalIcon: LucideIcon;
  navItems: NavItem[];
  children: React.ReactNode;
  userName?: string;
  userRole?: string;
  pageClassName?: string;
};

export default function PortalShell({
  portalName, portalColor, portalBg, portalIcon: PortalIcon,
  navItems, children, userName = "John Doe", userRole = "Member",
  pageClassName = ""
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const effectiveUserName = authUser?.name ?? userName;
  const effectiveUserRole = authUser ? getPortalDisplayName(authUser.portal) : userRole;

  useEffect(() => {
    try {
      const user = getAuthUser();
      setAuthUser(user);
      if (!user) {
        router.replace("/login");
        return;
      }

      const expectedRoute = getPortalRouteForUser(user);
      if (pathname !== expectedRoute && !pathname.startsWith(expectedRoute + "/")) {
        router.replace(expectedRoute);
      }
    } catch (err) {
      console.error("Auth error:", err);
      router.replace("/login");
    }
  }, [pathname, router]);
  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? "20px 12px" : "20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${portalColor},${portalColor}bb)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 4px 12px ${portalColor}50` }}>
          <PortalIcon size={18} color="#fff" />
        </div>
        {!collapsed && (
          <div>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: 14, lineHeight: 1.1 }}>TravelEase</p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em" }}>{portalName.toUpperCase()}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
        {!collapsed && (
          <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em", textTransform: "uppercase", padding: "6px 10px 8px" }}>NAVIGATION</p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <motion.button
              key={item.href}
              onClick={() => { router.push(item.href); setMobileOpen(false); }}
              whileHover={{ x: 2 }}
              title={collapsed ? item.label : undefined}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: collapsed ? "11px 12px" : "10px 12px",
                borderRadius: 12, border: "none", cursor: "pointer",
                background: active ? `${portalColor}22` : "transparent",
                color: active ? portalColor : "rgba(255,255,255,0.55)",
                fontSize: 13, fontWeight: active ? 700 : 500,
                transition: "all 0.15s",
                width: "100%", textAlign: "left", position: "relative",
                borderLeft: active ? `3px solid ${portalColor}` : "3px solid transparent",
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; } }}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
              {!collapsed && item.badge && (
                <span style={{ background: portalColor, color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 999 }}>{item.badge}</span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.05)", marginBottom: 6 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: `${portalColor}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: portalColor, fontWeight: 800, fontSize: 13 }}>{effectiveUserName[0]}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "#fff", fontSize: 12, fontWeight: 700, lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{effectiveUserName}</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, lineHeight: 1 }}>{effectiveUserRole}</p>
            </div>
          </div>
        )}
        <motion.button
          onClick={() => {
            clearAuthData();
            setAuthUser(null);
            router.push("/login");
          }}
          whileHover={{ background: "rgba(239,68,68,0.15)" }}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, width: "100%" }}
        >
          <LogOut size={15} />
          {!collapsed && "Sign Out"}
        </motion.button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fb" }}>

      <input
        id="portal-mobile-toggle"
        type="checkbox"
        className="portal-mobile-toggle"
        checked={mobileOpen}
        onChange={(e) => setMobileOpen(e.target.checked)}
        hidden
      />

      <motion.aside
        animate={{ width: collapsed ? 64 : 230 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        style={{ display: "flex", background: "#0f172a", flexShrink: 0, position: "fixed", left: 0, top: 0, bottom: 0, height: "100vh", overflowY: "auto", zIndex: 40, flexDirection: "column" }}
        className="nav-desktop-only"
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ position: "absolute", top: 24, right: 6, width: 24, height: 24, borderRadius: "50%", background: "#1e293b", border: "2px solid #0f172a", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.6)", zIndex: 50 }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <label htmlFor="portal-mobile-toggle" className="portal-mobile-backdrop" />
      <aside
        className="nav-mobile-only portal-mobile-drawer"
        style={{ display: "flex", position: "fixed", top: 0, left: 0, bottom: 0, width: 240, background: "#0f172a", zIndex: 60, flexDirection: "column", overflowY: "auto" }}
      >
        <SidebarContent />
      </aside>

      {/* Main area */}
      <div className="portal-main-area" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, marginLeft: collapsed ? 64 : 230, transition: "margin-left 0.25s ease", minHeight: "100vh" }}>

        {/* Topbar */}
        <header className="portal-topbar" style={{ height: 60, background: "#fff", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", position: "sticky", top: 0, zIndex: 30, boxShadow: "0 1px 0 #f0f0f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label htmlFor="portal-mobile-toggle" className="mobile-menu-button" style={{ background: "none", border: "none", cursor: "pointer", color: "#374151", padding: 8, zIndex: 35 }} aria-label="Toggle mobile menu">
              <Menu size={20} />
            </label>
            <div className="portal-topbar-search" style={{ display: "flex", alignItems: "center", gap: 8, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "7px 14px", minWidth: 220 }}>
              <Search size={14} color="#9ca3af" />
              <input placeholder="Search..." style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#374151", width: "100%" }} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative" }}>
              <button style={{ width: 36, height: 36, borderRadius: 10, background: "#f9fafb", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Bell size={16} color="#6B7280" />
              </button>
              <div style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "#EF4444", border: "2px solid #fff" }} />
            </div>

            <div className="portal-topbar-user" style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 10, background: `${portalBg}`, border: `1px solid ${portalColor}22`, cursor: "pointer" }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: portalColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: 12 }}>{effectiveUserName[0]}</span>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#111", lineHeight: 1 }}>{effectiveUserName}</p>
                <p style={{ fontSize: 10, color: portalColor, fontWeight: 600, lineHeight: 1, marginTop: 1 }}>{portalName}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={`portal-main ${pageClassName}`} style={{ flex: 1, padding: "28px 28px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
