"use client";
import { useEffect, useState } from "react";
import PortalShell from "@/components/portal/PortalShell";
import { useAuthDisplayName } from "@/lib/authClient";
import { motion } from "framer-motion";
import { Gift, Plus, Trash2, Save } from "lucide-react";

type OfferForm = {
  percentOff: string;
  note: string;
  couponCode: string;
  validity: string;
  lives: string;
  isActive: boolean;
};

type OfferRecord = {
  id: string;
  percentOff: number;
  note: string;
  couponCode: string;
  validity: string;
  lives: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const emptyForm = (): OfferForm => ({
  percentOff: "",
  note: "",
  couponCode: "",
  validity: "",
  lives: "10",
  isActive: true,
});

export default function AdminOffersPage() {
  const displayName = useAuthDisplayName("Administrator");
  const [offers, setOffers] = useState<OfferRecord[]>([]);
  const [form, setForm] = useState<OfferForm>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadOffers = async () => {
    const response = await fetch("/api/admin/offers");
    const data = await response.json();
    setOffers(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/offers", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to save offer");
      }

      setForm(emptyForm());
      setEditingId(null);
      setMessage(editingId ? "Offer updated successfully" : "Offer created successfully");
      await loadOffers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save offer");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (offer: OfferRecord) => {
    setEditingId(offer.id);
    setForm({
      percentOff: String(offer.percentOff),
      note: offer.note,
      couponCode: offer.couponCode,
      validity: offer.validity,
      lives: String(offer.lives),
      isActive: offer.isActive,
    });
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/admin/offers?id=${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data?.error || "Unable to delete offer");
      return;
    }
    setMessage("Offer deleted");
    await loadOffers();
  };

  return (
    <PortalShell portalName="Administration" portalColor="#DC2626" portalBg="#FEF2F2" portalIcon={Gift} navItems={[]} userName={displayName} userRole="Administrator">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ display: "grid", gap: 24 }}>
        <div style={{ background: "linear-gradient(135deg, #DC2626, #ef4444)", color: "#fff", borderRadius: 20, padding: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 700, opacity: 0.8, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Offer Management</p>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Create and update homepage offers</h1>
          <p style={{ fontSize: 14, opacity: 0.85 }}>Every active offer will appear for all visitors on the homepage.</p>
        </div>

        {message ? <div style={{ background: "#eff6ff", color: "#1d4ed8", padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>{message}</div> : null}

        <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 18, padding: 20, boxShadow: "0 10px 35px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
            <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600 }}>
              Off type (Train, Flight, ...)
              <input required value={form.percentOff} onChange={(e) => setForm({ ...form, percentOff: e.target.value })} type="text" style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #e5e7eb" }} />
            </label>
            <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600 }}>
              Note
              <input required value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #e5e7eb" }} />
            </label>
            <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600 }}>
              Coupon Code
              <input required value={form.couponCode} onChange={(e) => setForm({ ...form, couponCode: e.target.value.toUpperCase() })} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #e5e7eb" }} />
            </label>
            <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600 }}>
              Validity
              <input required value={form.validity} onChange={(e) => setForm({ ...form, validity: e.target.value })} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #e5e7eb" }} />
            </label>
            <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600 }}>
              Lives
              <input required value={form.lives} onChange={(e) => setForm({ ...form, lives: e.target.value })} type="number" min="0" style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #e5e7eb" }} />
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, alignSelf: "end" }}>
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              Active
            </label>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button disabled={loading} type="submit" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 999, background: "#DC2626", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700 }}>
              {editingId ? <Save size={15} /> : <Plus size={15} />} {editingId ? "Update Offer" : "Add Offer"}
            </button>
            {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm()); }} style={{ padding: "10px 14px", borderRadius: 999, background: "#f3f4f6", color: "#374151", border: "none", cursor: "pointer", fontWeight: 700 }}>Cancel</button> : null}
          </div>
        </form>

        <div style={{ background: "#fff", borderRadius: 18, padding: 20, boxShadow: "0 10px 35px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Current Offers</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {offers.map((offer) => (
              <div key={offer.id} style={{ border: "1px solid #f1f5f9", borderRadius: 14, padding: 14, display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 800, color: "#111" }}>
                    {typeof offer.percentOff === "number" && Number.isFinite(offer.percentOff)
                      ? `${offer.percentOff}% off · ${offer.note}`
                      : `${offer.percentOff} · ${offer.note}`}
                  </div>
                  <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{offer.couponCode} · {offer.validity} · {offer.lives} lives · {offer.isActive ? "Active" : "Inactive"}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleEdit(offer)} style={{ padding: "8px 10px", borderRadius: 10, background: "#eff6ff", color: "#1d4ed8", border: "none", cursor: "pointer", fontWeight: 700 }}>Edit</button>
                  <button onClick={() => handleDelete(offer.id)} style={{ padding: "8px 10px", borderRadius: 10, background: "#fef2f2", color: "#dc2626", border: "none", cursor: "pointer", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </PortalShell>
  );
}
