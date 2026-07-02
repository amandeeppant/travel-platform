"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
};

export default function PortalShell({
  portalName, portalColor, portalBg, portalIcon: PortalIcon,
  navItems, children, userName = "John Doe", userRole = "Member"
}: Props) {
  const pathname  = usePathname();
  const router    = useRouter();
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
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? "20px 12px" : "20px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${portalColor},${portalColor}bb)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:`0 4px 12px ${portalColor}50` }}>
          <PortalIcon size={18} color="#fff" />
        </div>
        {!collapsed && (
          <div>
            <p style={{ color:"#fff", fontWeight:800, fontSize:14, lineHeight:1.1 }}>TravelEase</p>
            <p style={{ color:"rgba(255,255,255,0.45)", fontSize:10, fontWeight:600, letterSpacing:"0.06em" }}>{portalName.toUpperCase()}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"14px 10px", overflowY:"auto", display:"flex", flexDirection:"column", gap:2 }}>
        {!collapsed && (
          <p style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.25)", letterSpacing:"0.12em", textTransform:"uppercase", padding:"6px 10px 8px" }}>NAVIGATION</p>
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
                display:"flex", alignItems:"center", gap:10,
                padding: collapsed ? "11px 12px" : "10px 12px",
                borderRadius:12, border:"none", cursor:"pointer",
                background: active ? `${portalColor}22` : "transparent",
                color: active ? portalColor : "rgba(255,255,255,0.55)",
                fontSize:13, fontWeight: active ? 700 : 500,
                transition:"all 0.15s",
                width:"100%", textAlign:"left", position:"relative",
                borderLeft: active ? `3px solid ${portalColor}` : "3px solid transparent",
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.color="rgba(255,255,255,0.85)"; }}}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,0.55)"; }}}
            >
              <Icon size={17} style={{ flexShrink:0 }} />
              {!collapsed && <span style={{ flex:1 }}>{item.label}</span>}
              {!collapsed && item.badge && (
                <span style={{ background: portalColor, color:"#fff", fontSize:9, fontWeight:800, padding:"2px 6px", borderRadius:999 }}>{item.badge}</span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ padding:"12px 10px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
        {!collapsed && (
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:12, background:"rgba(255,255,255,0.05)", marginBottom:6 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:`${portalColor}33`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ color:portalColor, fontWeight:800, fontSize:13 }}>{effectiveUserName[0]}</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ color:"#fff", fontSize:12, fontWeight:700, lineHeight:1.1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{effectiveUserName}</p>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:10, lineHeight:1 }}>{effectiveUserRole}</p>
            </div>
          </div>
        )}
        <motion.button
          onClick={() => {
            clearAuthData();
            setAuthUser(null);
            router.push("/login");
          }}
          whileHover={{ background:"rgba(239,68,68,0.15)" }}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 12px", borderRadius:10, border:"none", cursor:"pointer", background:"transparent", color:"rgba(255,255,255,0.4)", fontSize:12, fontWeight:600, width:"100%" }}
        >
          <LogOut size={15} />
          {!collapsed && "Sign Out"}
        </motion.button>
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#f8f9fb" }}>

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 230 }}
        transition={{ duration:0.25, ease:"easeInOut" }}
        style={{ background:"#0f172a", flexShrink:0, position:"sticky", top:0, height:"100vh", overflow:"hidden", zIndex:40, display:"flex", flexDirection:"column" }}
        className="hidden lg:flex"
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ position:"absolute", top:24, right:-12, width:24, height:24, borderRadius:"50%", background:"#1e293b", border:"2px solid #0f172a", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"rgba(255,255,255,0.6)", zIndex:50 }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:50 }}
            />
            <motion.aside
              initial={{ x:-240 }} animate={{ x:0 }} exit={{ x:-240 }}
              transition={{ duration:0.25, ease:"easeInOut" }}
              style={{ position:"fixed", top:0, left:0, bottom:0, width:240, background:"#0f172a", zIndex:60, display:"flex", flexDirection:"column" }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>

        {/* Topbar */}
        <header className="px-4 md:px-6" style={{ height:60, background:"#fff", borderBottom:"1px solid #f0f0f0", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:30, boxShadow:"0 1px 0 #f0f0f0" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={() => setMobileOpen(true)} className="lg:hidden" style={{ background:"none", border:"none", cursor:"pointer", color:"#374151" }}>
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex" style={{ alignItems:"center", gap:8, background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:10, padding:"7px 14px", minWidth:220 }}>
              <Search size={14} color="#9ca3af" />
              <input placeholder="Search..." style={{ background:"transparent", border:"none", outline:"none", fontSize:13, color:"#374151", width:"100%" }} />
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ position:"relative" }}>
              <button style={{ width:36, height:36, borderRadius:10, background:"#f9fafb", border:"1px solid #e5e7eb", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                <Bell size={16} color="#6B7280" />
              </button>
              <div style={{ position:"absolute", top:6, right:6, width:8, height:8, borderRadius:"50%", background:"#EF4444", border:"2px solid #fff" }} />
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px", borderRadius:10, background:`${portalBg}`, border:`1px solid ${portalColor}22`, cursor:"pointer" }}>
              <div style={{ width:26, height:26, borderRadius:8, background:portalColor, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:"#fff", fontWeight:800, fontSize:12 }}>{effectiveUserName[0]}</span>
              </div>
              <div className="hidden sm:block">
                <p style={{ fontSize:12, fontWeight:700, color:"#111", lineHeight:1 }}>{effectiveUserName}</p>
                <p style={{ fontSize:10, color:portalColor, fontWeight:600, lineHeight:1, marginTop:1 }}>{portalName}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-7" style={{ flex:1, overflowY:"auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
