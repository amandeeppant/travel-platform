"use client";
import { useState, useRef, useEffect } from "react";
import PortalShell from "@/components/portal/PortalShell";
import { useAuthDisplayName } from "@/lib/authClient";
import { Card, StatCard } from "@/components/portal/DashboardWidgets";
import { motion, AnimatePresence } from "framer-motion";
import { User, Globe, Train, Hotel, Plane, Map, Calendar, FileText, Shield, Bot, Zap, MessageSquare, Send, HelpCircle, RefreshCw, CheckCircle, Sparkles } from "lucide-react";

const NAV = [
  { icon: Globe, label: "Dashboard", href: "/portal/traveler" },
  { icon: Train, label: "Destination Discovery", href: "/portal/traveler/destinations" },
  { icon: Hotel, label: "Hotel Search", href: "/portal/traveler/hotels" },
  { icon: Plane, label: "Flight Search", href: "/portal/traveler/flights" },
  { icon: Map, label: "Package Booking", href: "/portal/traveler/packages" },
  { icon: Calendar, label: "Activity Booking", href: "/portal/traveler/activities" },
  { icon: FileText, label: "Visa Assistance", href: "/portal/traveler/visa" },
  { icon: Shield, label: "Travel Insurance", href: "/portal/traveler/insurance" },
  { icon: Bot, label: "AI Travel Planner", href: "/portal/traveler/ai-planner", badge: "NEW" },
  { icon: Zap, label: "AI Travel Assistant", href: "/portal/traveler/ai-assistant", badge: "NEW" },
];

const SUGGESTED_QUESTIONS = [
  "How do I book a hotel room?",
  "What is the cancellation and refund policy?",
  "Are flights operational from Mumbai to Dubai?",
  "Tell me about tourist packages in Goa."
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AITravelAssistantPage() {
  const displayName = useAuthDisplayName("Traveler");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am your TravelEase AI Support Assistant. How can I help you today? You can ask me about hotel reservations, flight routes, visa support packages, or active itinerary cancellation policies."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const authRaw = localStorage.getItem("travelEaseAuth");
      if (!authRaw) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "You must be logged in to chat with support. Please log in to your account."
        }]);
        setLoading(false);
        return;
      }
      const token = JSON.parse(authRaw).token;

      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ messages: updatedMessages })
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: data.error || "An error occurred. Please try again." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please check your network connection." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared. Hello! I am your TravelEase AI Support Assistant. How can I help you today?"
      }
    ]);
  };

  return (
    <PortalShell portalName="Traveler" portalColor="#1677FF" portalBg="#EFF6FF" portalIcon={User} navItems={NAV} userName={displayName} userRole="Traveler">
      
      {/* Header Banner */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{ background: "linear-gradient(135deg,#1677FF,#0ea5e9)", borderRadius: 20, padding: "28px 32px", marginBottom: 28, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -30, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.75, marginBottom: 6 }}>TRAVELER PORTAL</p>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>AI Support Assistant</h1>
        <p style={{ fontSize: 13, opacity: 0.72 }}>Get instant, 24/7 help with bookings, cancellations, packages, and travel guidelines.</p>
      </motion.div>

      {/* Quick stats indicators */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard icon={MessageSquare} label="Status" value="Online" color="#16a34a" bg="#f0fdf4" delay={0.05} />
        <StatCard icon={CheckCircle} label="Response Rate" value="Instant" color="#059669" bg="#ECFDF5" delay={0.1} />
        <StatCard icon={Sparkles} label="Capabilities" value="Full Support" color="#D97706" bg="#FFFBEB" delay={0.15} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "stretch", minHeight: 520 }}>
        
        {/* Chat Console Panel */}
        <Card style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden", height: "100%" }}>
          {/* Header of Chat */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f0f0f0", background: "#f8fafc" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#16a34a" }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#111" }}>TravelEase Agent</p>
                <p style={{ fontSize: 11, color: "#9ca3af" }}>Ready to help</p>
              </div>
            </div>
            <button onClick={handleClearChat} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", color: "#4b5563", fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>
              <RefreshCw size={12} /> Clear Chat
            </button>
          </div>

          {/* Messages Stream */}
          <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, background: "#fafbfc", maxHeight: 400 }}>
            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <div key={idx} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "75%",
                    padding: "12px 16px",
                    borderRadius: 16,
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    borderBottomRightRadius: isUser ? 2 : 16,
                    borderBottomLeftRadius: isUser ? 16 : 2,
                    background: isUser ? "#1677FF" : "#fff",
                    color: isUser ? "#fff" : "#1f2937",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    border: isUser ? "none" : "1px solid #e5e7eb",
                    whiteSpace: "pre-line"
                  }}>
                    {m.content}
                  </div>
                </div>
              );
            })}
            
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "12px 16px",
                  borderRadius: 16,
                  background: "#fff",
                  color: "#9ca3af",
                  border: "1px solid #e5e7eb",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}>
                  <div style={{ display: "flex", gap: 3 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#9ca3af", animation: "bounce 1.4s infinite ease-in-out both" }} />
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#9ca3af", animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "0.2s" }} />
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#9ca3af", animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "0.4s" }} />
                  </div>
                  <span>Agent is writing...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input Control Box */}
          <div style={{ padding: "16px 20px", borderTop: "1px solid #f0f0f0", background: "#fff" }}>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} style={{ display: "flex", gap: 10 }}>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your support request or travel question..."
                style={{ flex: 1, border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "12px 16px", fontSize: 13.5, outline: "none" }} />
              <button type="submit" disabled={!input.trim() || loading}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, background: "#1677FF", border: "none", borderRadius: 12, color: "#fff", cursor: (!input.trim() || loading) ? "not-allowed" : "pointer", opacity: (!input.trim() || loading) ? 0.6 : 1 }}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </Card>

        {/* Sidebar help tips panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <HelpCircle size={16} color="#1677FF" />
              <p style={{ fontSize: 12, fontWeight: 800, color: "#111" }}>Quick Questions</p>
            </div>
            <p style={{ fontSize: 11.5, color: "#6b7280", marginBottom: 12, lineHeight: 1.4 }}>Click on any typical question below to ask the Support Agent instantly:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SUGGESTED_QUESTIONS.map(q => (
                <button key={q} onClick={() => handleSend(q)} disabled={loading}
                  style={{ width: "100%", background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", cursor: "pointer", textTransform: "none", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#4b5563", transition: "all 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1677FF"; e.currentTarget.style.background = "#eff6ff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#f8fafc"; }}>
                  {q}
                </button>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {/* Bounce keyframe loader styling */}
      <style jsx global>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>
    </PortalShell>
  );
}
