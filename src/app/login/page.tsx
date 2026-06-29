"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, ChevronLeft } from "lucide-react";
import { saveAuthData, getPortalRouteForUser } from "@/lib/authClient";

const PORTAL_LABELS: Record<string, string> = {
  traveler: "Traveler",
  hotel_partner: "Hotel Partner",
  travel_agent: "Travel Agent",
  corporate: "Corporate",
  admin: "Administrator",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Login failed. Please try again.");
        return;
      }

      saveAuthData(data);
      const route = getPortalRouteForUser(data.user);
      router.push(route);
    } catch (err) {
      setError("Unable to complete login. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#0f172a 0%,#111827 60%,#1f2937 100%)", padding: "32px" }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{ width: "100%", maxWidth: 520, background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, boxShadow: "0 24px 80px rgba(0,0,0,0.4)", overflow: "hidden" }}>
        <div style={{ padding: "32px 32px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <button onClick={() => router.push("/")} style={{ width: 34, height: 34, borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronLeft size={18} />
            </button>
            <div>
              <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.18em", color: "#7dd3fc", textTransform: "uppercase", fontWeight: 700 }}>Welcome back</p>
              <h1 style={{ margin: "8px 0 0", color: "#fff", fontSize: 30, lineHeight: 1.05, fontWeight: 800 }}>Sign in to your portal</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
            <label style={{ display: "grid", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
              Email address
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                type="email"
                required
                style={{ width: "100%", borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "#fff", padding: "14px 16px", outline: "none", fontSize: 14 }}
              />
            </label>

            <label style={{ display: "grid", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
              Password
              <div style={{ position: "relative" }}>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  required
                  style={{ width: "100%", borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "#fff", padding: "14px 16px", outline: "none", fontSize: 14 }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", top: "50%", right: 14, transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer", color: "rgba(255,255,255,0.65)" }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {error && <div style={{ color: "#fecaca", fontSize: 13, lineHeight: 1.5, background: "rgba(244,63,94,0.12)", padding: "12px 14px", borderRadius: 14 }}>{error}</div>}

            <button type="submit" disabled={loading} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, width: "100%", borderRadius: 14, background: "linear-gradient(135deg,#22c55e,#0ea5e9)", color: "#fff", fontWeight: 800, fontSize: 15, padding: "14px 16px", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.75 : 1 }}>
              {loading ? "Signing in..." : "Sign in"}
              <ArrowRight size={18} />
            </button>
          </form>

          <p style={{ marginTop: 18, color: "rgba(255,255,255,0.55)", fontSize: 13, textAlign: "center" }}>
            New here? <a href="/register" style={{ color: "#7dd3fc", fontWeight: 700 }}>Create an account</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
