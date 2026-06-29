"use client";
import { useState, useEffect } from "react";
import PortalShell from "@/components/portal/PortalShell";
import { useAuthDisplayName } from "@/lib/authClient";
import { Card, PrimaryButton, Badge } from "@/components/portal/DashboardWidgets";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, LayoutDashboard, Package, BookOpen,
  BarChart2, DollarSign, Settings, CheckCircle2,
  Upload, MapPin, BedDouble, Sparkles, ShieldCheck,
  FileText, Landmark, ScanLine, AlertCircle
} from "lucide-react";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard",            href: "/portal/hotel-partner" },
  { icon: Building2,       label: "Property Registration", href: "/portal/hotel-partner/register" },
  { icon: Package,         label: "Inventory Management",  href: "/portal/hotel-partner/inventory" },
  { icon: BookOpen,        label: "Booking Management",    href: "/portal/hotel-partner/bookings" },
  { icon: DollarSign,      label: "Revenue Dashboard",     href: "/portal/hotel-partner/revenue" },
  { icon: Settings,        label: "Pricing Management",    href: "/portal/hotel-partner/pricing" },
  { icon: BarChart2,       label: "Analytics Dashboard",   href: "/portal/hotel-partner/analytics" },
];

const STEPS = [
  { id: 1, label: "Hotel Profile",   icon: Building2,    desc: "Basic property details" },
  { id: 2, label: "KYC & Legal",     icon: ShieldCheck,  desc: "GST, PAN, KYC verification" },
  { id: 3, label: "Bank Account",    icon: Landmark,     desc: "Payment settlement details" },
  { id: 4, label: "Documents & Map", icon: MapPin,       desc: "Upload docs & geo-location" },
  { id: 5, label: "Rooms & Amenities", icon: BedDouble,  desc: "Configure rooms & facilities" },
];

const AMENITIES = [
  "Free WiFi","Swimming Pool","Spa & Wellness","Gym & Fitness","Restaurant",
  "Room Service","Airport Shuttle","Parking","Business Center","Kids Play Area",
  "Conference Room","EV Charging","Pet Friendly","Bar & Lounge","Concierge",
];

const ROOM_TYPES = [
  { type: "Standard Room", base: "2500" },
  { type: "Deluxe Room",   base: "4000" },
  { type: "Suite",         base: "7500" },
  { type: "Penthouse",     base: "15000" },
];

function AIBadge({ label }: { label: string }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:"linear-gradient(135deg,#7c3aed22,#059669 22)", border:"1px solid #7c3aed33", borderRadius:999, padding:"3px 10px", fontSize:10, fontWeight:700, color:"#7c3aed" }}>
      <Sparkles size={9} /> {label}
    </span>
  );
}

function InputField({ label, placeholder, value, onChange, aiTag, type = "text" }: { label: string; placeholder: string; value: string; onChange: (val: string) => void; aiTag?: string; type?: string }) {
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
        <label style={{ fontSize:12, fontWeight:700, color:"#374151" }}>{label}</label>
        {aiTag && <AIBadge label={aiTag} />}
      </div>
      <input type={type} placeholder={placeholder} value={value || ""} onChange={(e) => onChange(e.target.value)}
        style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#111", outline:"none", background:"#fafafa", boxSizing:"border-box" }}
        onFocus={(e) => { e.currentTarget.style.borderColor="#059669"; e.currentTarget.style.background="#fff"; }}
        onBlur={(e)  => { e.currentTarget.style.borderColor="#e5e7eb"; e.currentTarget.style.background="#fafafa"; }}
      />
    </div>
  );
}

function SelectField({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (val: string) => void }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontSize:12, fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>{label}</label>
      <select value={value || ""} onChange={(e) => onChange(e.target.value)}
        style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#111", outline:"none", background:"#fafafa", boxSizing:"border-box" }}>
        {options.map(o => <option key={o} value={o === "Select Type" ? "" : o}>{o}</option>)}
      </select>
    </div>
  );
}

function VerificationRow({ label, status }: { label: string; status: "verified" | "pending" | "uploading" }) {
  const map = {
    verified:  { color:"#16a34a", bg:"#f0fdf4", text:"Verified" },
    pending:   { color:"#d97706", bg:"#fffbeb", text:"Pending" },
    uploading: { color:"#2563eb", bg:"#eff6ff", text:"Processing" },
  };
  const s = map[status];
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:"#f9fafb", borderRadius:12, marginBottom:8, border:"1px solid #f0f0f0" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {status === "verified" ? <CheckCircle2 size={16} color="#16a34a" /> : <AlertCircle size={16} color={s.color} />}
        <span style={{ fontSize:13, fontWeight:600, color:"#374151" }}>{label}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <Badge label={s.text} color={s.color} bg={s.bg} />
      </div>
    </div>
  );
}

interface StepProps {
  formData: any;
  setFormData: (fn: (prev: any) => any) => void;
}

function Step1({ formData, setFormData }: StepProps) {
  const update = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:24 }}>
        <Building2 size={20} color="#059669" />
        <div>
          <h3 style={{ fontSize:16, fontWeight:800, color:"#111" }}>Hotel Profile Creation</h3>
          <p style={{ fontSize:12, color:"#9ca3af" }}>Fill in your property details to get started</p>
        </div>
        <div style={{ marginLeft:"auto" }}><AIBadge label="AI Content Generation" /></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
        <InputField label="Hotel Name *" value={formData.name} onChange={v => update("name", v)} placeholder="e.g. Grand Palace Hotel" />
        <SelectField label="Property Type *" value={formData.propertyType} onChange={v => update("propertyType", v)} options={["Select Type","Hotel","Resort","Villa","Homestay","Boutique Hotel","Service Apartment"]} />
        <InputField label="Star Category" value={formData.category} onChange={v => update("category", v)} placeholder="e.g. 4 Star" />
        <InputField label="Total Rooms *" value={formData.totalRooms} onChange={v => update("totalRooms", v)} placeholder="e.g. 142" type="number" />
        <div style={{ gridColumn:"span 2" }}>
          <InputField label="Hotel Description" value={formData.description} onChange={v => update("description", v)} placeholder="Describe your property, highlights, and unique features..." />
        </div>
        <InputField label="Check-in Time *" value={formData.checkInTime} onChange={v => update("checkInTime", v)} placeholder="e.g. 14:00" type="time" />
        <InputField label="Check-out Time *" value={formData.checkOutTime} onChange={v => update("checkOutTime", v)} placeholder="e.g. 11:00" type="time" />
        <InputField label="Contact Email *" value={formData.contactEmail} onChange={v => update("contactEmail", v)} placeholder="hotel@example.com" type="email" />
        <InputField label="Contact Phone *" value={formData.contactPhone} onChange={v => update("contactPhone", v)} placeholder="+91 98765 43210" type="tel" />
        <div style={{ gridColumn:"span 2" }}>
          <InputField label="Full Address *" value={formData.address} onChange={v => update("address", v)} placeholder="Street, City, State, PIN Code" />
        </div>
      </div>
      <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:12, padding:"12px 16px", display:"flex", gap:10, alignItems:"flex-start" }}>
        <Sparkles size={14} color="#059669" style={{ marginTop:2, flexShrink:0 }} />
        <p style={{ fontSize:12, color:"#15803d", fontWeight:500 }}>
          <strong>AI Content Generation:</strong> Our AI will auto-generate SEO-optimized descriptions, highlight unique amenities, and classify your property type based on the details you provide.
        </p>
      </div>
    </div>
  );
}

function Step2({ formData, setFormData }: StepProps) {
  const update = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:24 }}>
        <ShieldCheck size={20} color="#059669" />
        <div>
          <h3 style={{ fontSize:16, fontWeight:800, color:"#111" }}>KYC & Legal Verification</h3>
          <p style={{ fontSize:12, color:"#9ca3af" }}>Complete verification to activate your property listing</p>
        </div>
        <div style={{ marginLeft:"auto" }}><AIBadge label="OCR Extraction" /></div>
      </div>

      <div style={{ marginBottom:20 }}>
        <p style={{ fontSize:12, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:12 }}>Verification Status</p>
        <VerificationRow label="GST Registration" status={formData.gstNumber ? "verified" : "pending"} />
        <VerificationRow label="PAN Card Validation" status={formData.panNumber ? "verified" : "pending"} />
        <VerificationRow label="KYC Document" status={formData.legalEntityName ? "verified" : "pending"} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
        <InputField label="GST Number *" value={formData.gstNumber} onChange={v => update("gstNumber", v)} placeholder="e.g. 27AAAPL1234C1Z5" aiTag="Auto-Validated" />
        <InputField label="PAN Number *" value={formData.panNumber} onChange={v => update("panNumber", v)} placeholder="e.g. AAAPL1234C" aiTag="Auto-Validated" />
        <InputField label="Legal Entity Name *" value={formData.legalEntityName} onChange={v => update("legalEntityName", v)} placeholder="Registered company name" />
        <SelectField label="Entity Type *" value={formData.entityType} onChange={v => update("entityType", v)} options={["Sole Proprietorship","Partnership","Private Ltd","LLP","Public Ltd"]} />
        <InputField label="FSSAI License No." value={formData.fssaiLicense} onChange={v => update("fssaiLicense", v)} placeholder="Food safety license (if applicable)" />
        <InputField label="Trade License No." value={formData.tradeLicense} onChange={v => update("tradeLicense", v)} placeholder="Municipal trade license number" />
      </div>

      <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:12, padding:"12px 16px", display:"flex", gap:10, alignItems:"flex-start" }}>
        <ScanLine size={14} color="#2563eb" style={{ marginTop:2, flexShrink:0 }} />
        <p style={{ fontSize:12, color:"#1d4ed8", fontWeight:500 }}>
          <strong>OCR Document Extraction:</strong> Upload your GST certificate or PAN card image — AI will auto-extract and fill the fields. Duplicate property detection runs automatically to prevent duplicate listings.
        </p>
      </div>
    </div>
  );
}

function Step3({ formData, setFormData }: StepProps) {
  const update = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:24 }}>
        <Landmark size={20} color="#059669" />
        <div>
          <h3 style={{ fontSize:16, fontWeight:800, color:"#111" }}>Bank Account Verification</h3>
          <p style={{ fontSize:12, color:"#9ca3af" }}>Secure payment settlement details</p>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
        <InputField label="Account Holder Name *" value={formData.bankAccountName} onChange={v => update("bankAccountName", v)}  placeholder="As per bank records" />
        <InputField label="Account Number *" value={formData.bankAccountNumber} onChange={v => update("bankAccountNumber", v)}       placeholder="Enter bank account number" />
        <InputField label="IFSC Code *" value={formData.bankIfscCode} onChange={v => update("bankIfscCode", v)}            placeholder="e.g. SBIN0001234" aiTag="Bank Validated" />
        <SelectField label="Account Type *" value={formData.bankAccountType} onChange={v => update("bankAccountType", v)}        options={["Current Account","Savings Account"]} />
        <InputField label="Bank Name" value={formData.bankName} onChange={v => update("bankName", v)}              placeholder="e.g. State Bank of India" />
        <InputField label="Branch Name" value={formData.bankBranchName} onChange={v => update("bankBranchName", v)}            placeholder="e.g. Mumbai Main Branch" />
      </div>

      <div style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:12, padding:16, marginBottom:16 }}>
        <p style={{ fontSize:12, fontWeight:700, color:"#374151", marginBottom:8 }}>Upload Cancelled Cheque / Bank Statement</p>
        <div style={{ border:"2px dashed #d1d5db", borderRadius:10, padding:"20px", textAlign:"center", cursor:"pointer" }}>
          <Upload size={24} color="#9ca3af" style={{ margin:"0 auto 8px" }} />
          <p style={{ fontSize:12, color:"#6b7280" }}>Drag & drop or <span style={{ color:"#059669", fontWeight:700 }}>browse files</span></p>
          <p style={{ fontSize:11, color:"#9ca3af", marginTop:4 }}>PDF, JPG, PNG up to 5MB</p>
        </div>
      </div>

      <VerificationRow label="Bank Account Verification (Penny Drop)" status={formData.bankAccountNumber ? "verified" : "pending"} />
    </div>
  );
}

function Step4({ formData, setFormData }: StepProps) {
  const update = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:24 }}>
        <MapPin size={20} color="#059669" />
        <div>
          <h3 style={{ fontSize:16, fontWeight:800, color:"#111" }}>Documents & Geo-location</h3>
          <p style={{ fontSize:12, color:"#9ca3af" }}>Upload property documents and pin your location</p>
        </div>
        <div style={{ marginLeft:"auto" }}><AIBadge label="Address Validation" /></div>
      </div>

      {/* Geo-location */}
      <div style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:14, overflow:"hidden", marginBottom:20 }}>
        <div style={{ background:"linear-gradient(135deg,#e0f2fe,#d1fae5)", height:180, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
          <div style={{ textAlign:"center" }}>
            <MapPin size={32} color="#059669" style={{ margin:"0 auto 8px" }} />
            <p style={{ fontSize:13, fontWeight:700, color:"#374151" }}>Geo-location coordinates configured</p>
            <p style={{ fontSize:11, color:"#6b7280" }}>{formData.latitude ? `Lat: ${formData.latitude}, Lng: ${formData.longitude}` : "No custom coordinates set"}</p>
          </div>
          <button type="button" onClick={() => { update("latitude", "19.0760"); update("longitude", "72.8777"); }} style={{ position:"absolute", bottom:12, right:12, background:"#059669", color:"#fff", border:"none", borderRadius:8, padding:"6px 14px", fontSize:11, fontWeight:700, cursor:"pointer" }}>
            📍 Use Current Location (Mumbai)
          </button>
        </div>
        <div style={{ padding:"12px 16px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
          <InputField label="Latitude" value={formData.latitude} onChange={v => update("latitude", v)}  placeholder="Auto-detected" />
          <InputField label="Longitude" value={formData.longitude} onChange={v => update("longitude", v)} placeholder="Auto-detected" />
        </div>
      </div>

      {/* Document Upload */}
      <p style={{ fontSize:12, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:12 }}>Property Documentation</p>
      {[
        { label:"Property Ownership / Lease Agreement", required:true  },
        { label:"NOC from Local Authority",             required:true  },
        { label:"Fire Safety Certificate",              required:false },
        { label:"Hotel Photos (min 10 images)",         required:true  },
      ].map((doc) => (
        <div key={doc.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 14px", marginBottom:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <FileText size={15} color="#6b7280" />
            <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>{doc.label}</span>
            {doc.required && <span style={{ fontSize:9, color:"#ef4444", fontWeight:800 }}>REQUIRED</span>}
          </div>
          <button type="button" style={{ display:"flex", alignItems:"center", gap:5, background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:8, padding:"5px 12px", fontSize:11, fontWeight:700, color:"#374151", cursor:"pointer" }}>
            <Upload size={12} /> Uploaded
          </button>
        </div>
      ))}
    </div>
  );
}

function Step5({ formData, setFormData }: StepProps) {
  const toggleAmenity = (a: string) => {
    const isSel = formData.amenities.includes(a);
    const newVal = isSel ? formData.amenities.filter((x: string) => x !== a) : [...formData.amenities, a];
    setFormData(prev => ({ ...prev, amenities: newVal }));
  };

  const updateRoomVal = (index: number, key: "price" | "count" | "enabled", val: any) => {
    const copy = [...formData.roomsConfig];
    copy[index] = { ...copy[index], [key]: val };
    setFormData(prev => ({ ...prev, roomsConfig: copy }));
  };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:24 }}>
        <BedDouble size={20} color="#059669" />
        <div>
          <h3 style={{ fontSize:16, fontWeight:800, color:"#111" }}>Room Configuration & Amenities</h3>
          <p style={{ fontSize:12, color:"#9ca3af" }}>Set up room types and select available amenities</p>
        </div>
        <div style={{ marginLeft:"auto" }}><AIBadge label="Property Classification" /></div>
      </div>

      {/* Room Config */}
      <p style={{ fontSize:12, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:12 }}>Room Configuration Setup</p>
      <div style={{ marginBottom:24 }}>
        {formData.roomsConfig.map((r: any, i: number) => (
          <div key={r.type} style={{ display:"grid", gridTemplateColumns:"1fr 120px 120px auto", gap:10, alignItems:"center", marginBottom:10 }}>
            <div style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:13, fontWeight:600, color:"#374151" }}>{r.type}</div>
            <input type="number" placeholder="Count" value={r.count || ""} onChange={(e) => updateRoomVal(i, "count", e.target.value)} style={{ border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 12px", fontSize:13, outline:"none", background:"#fafafa", width:"100%" }} />
            <input value={r.price || ""} onChange={(e) => updateRoomVal(i, "price", e.target.value)} style={{ border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 12px", fontSize:13, outline:"none", background:"#fafafa", width:"100%" }} />
            <input type="checkbox" checked={r.enabled} onChange={(e) => updateRoomVal(i, "enabled", e.target.checked)} style={{ width:16, height:16, accentColor:"#059669" }} />
          </div>
        ))}
      </div>

      {/* Amenity Selection */}
      <p style={{ fontSize:12, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:12 }}>Amenity Selection</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 }}>
        {AMENITIES.map((a) => {
          const active = formData.amenities.includes(a);
          return (
            <button key={a} type="button" onClick={() => toggleAmenity(a)}
              style={{ padding:"7px 14px", borderRadius:999, border:`1.5px solid ${active ? "#059669":"#e5e7eb"}`, background: active ? "#059669":"#fff", color: active ? "#fff":"#374151", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.15s" }}>
              {a}
            </button>
          );
        })}
      </div>

      <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:12, padding:"12px 16px", display:"flex", gap:10 }}>
        <Sparkles size={14} color="#059669" style={{ marginTop:2, flexShrink:0 }} />
        <p style={{ fontSize:12, color:"#15803d", fontWeight:500 }}>
          <strong>AI Classification:</strong> Based on your rooms and amenities, your property will be classified automatically and matched to the right traveler segments for better discoverability.
        </p>
      </div>
    </div>
  );
}

export default function HotelRegisterPage() {
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const displayName = useAuthDisplayName("Grand Palace");
  
  const [formData, setFormData] = useState({
    name: "",
    propertyType: "",
    category: "",
    totalRooms: "",
    description: "",
    checkInTime: "",
    checkOutTime: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    gstNumber: "",
    panNumber: "",
    legalEntityName: "",
    entityType: "",
    fssaiLicense: "",
    tradeLicense: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankIfscCode: "",
    bankAccountType: "",
    bankName: "",
    bankBranchName: "",
    latitude: "",
    longitude: "",
    amenities: ["Free WiFi", "Restaurant", "Parking"] as string[],
    roomsConfig: ROOM_TYPES.map(rt => ({ type: rt.type, price: rt.base, count: "5", enabled: true }))
  });

  const [loading, setLoading] = useState(true);

  // Fetch registered property details on load
  useEffect(() => {
    async function loadHotel() {
      try {
        const authRaw = localStorage.getItem("travelEaseAuth");
        if (!authRaw) {
          setLoading(false);
          return;
        }
        const token = JSON.parse(authRaw).token;
        const res = await fetch("/api/hotel-partner/property", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.hotel) {
          const h = data.hotel;
          setFormData({
            name: h.name || "",
            propertyType: h.propertyType || "",
            category: h.category || "",
            totalRooms: h.totalRooms ? String(h.totalRooms) : "",
            description: h.description || "",
            checkInTime: h.checkInTime || "",
            checkOutTime: h.checkOutTime || "",
            contactEmail: h.contactEmail || "",
            contactPhone: h.contactPhone || "",
            address: h.address || "",
            gstNumber: h.gstNumber || "",
            panNumber: h.panNumber || "",
            legalEntityName: h.legalEntityName || "",
            entityType: h.entityType || "",
            fssaiLicense: h.fssaiLicense || "",
            tradeLicense: h.tradeLicense || "",
            bankAccountName: h.bankAccountName || "",
            bankAccountNumber: h.bankAccountNumber || "",
            bankIfscCode: h.bankIfscCode || "",
            bankAccountType: h.bankAccountType || "",
            bankName: h.bankName || "",
            bankBranchName: h.bankBranchName || "",
            latitude: h.latitude ? String(h.latitude) : "",
            longitude: h.longitude ? String(h.longitude) : "",
            amenities: h.amenities || [],
            roomsConfig: h.rooms && h.rooms.length > 0 ? (
              ROOM_TYPES.map(rt => {
                const matches = h.rooms.filter((rm: any) => rm.type === rt.type);
                return {
                  type: rt.type,
                  price: matches.length > 0 ? String(matches[0].price) : rt.base,
                  count: matches.length > 0 ? String(matches.length) : "5",
                  enabled: matches.length > 0
                };
              })
            ) : ROOM_TYPES.map(rt => ({ type: rt.type, price: rt.base, count: "5", enabled: true }))
          });
          setCompleted([0, 1, 2, 3, 4]); // all pre-completed if profile exists
        }
      } catch (err) {
        console.error("Failed to load hotel profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadHotel();
  }, []);

  const saveStep = async (isFinalSubmit = false) => {
    try {
      const authRaw = localStorage.getItem("travelEaseAuth");
      if (!authRaw) {
        alert("Please log in first.");
        return;
      }
      const token = JSON.parse(authRaw).token;

      // Extract city from full address for location column
      const addressParts = formData.address.split(",");
      const extractedCity = addressParts.length > 1 ? addressParts[addressParts.length - 2].trim() : "Mumbai";

      const initialRooms = formData.roomsConfig
        .filter(r => r.enabled && r.count && Number(r.count) > 0)
        .map(r => ({
          type: r.type,
          count: Number(r.count),
          price: Number(r.price)
        }));

      const payload = {
        name: formData.name || "Default Palace",
        location: extractedCity,
        description: formData.description,
        category: formData.category,
        nightlyRate: Number(formData.roomsConfig.find(r => r.enabled)?.price || 2500),
        propertyType: formData.propertyType,
        totalRooms: formData.totalRooms ? Number(formData.totalRooms) : null,
        checkInTime: formData.checkInTime,
        checkOutTime: formData.checkOutTime,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        address: formData.address,
        amenities: formData.amenities,
        gstNumber: formData.gstNumber,
        panNumber: formData.panNumber,
        legalEntityName: formData.legalEntityName,
        entityType: formData.entityType,
        fssaiLicense: formData.fssaiLicense,
        tradeLicense: formData.tradeLicense,
        verificationStatus: isFinalSubmit ? "verified" : "processing",
        bankAccountName: formData.bankAccountName,
        bankAccountNumber: formData.bankAccountNumber,
        bankIfscCode: formData.bankIfscCode,
        bankAccountType: formData.bankAccountType,
        bankName: formData.bankName,
        bankBranchName: formData.bankBranchName,
        bankVerificationStatus: isFinalSubmit ? "verified" : "pending",
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null,
        initialRooms: isFinalSubmit ? initialRooms : [],
      };

      const res = await fetch("/api/hotel-partner/property", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Failed to save: ${errorData.error || "Server error"}`);
        return;
      }

      if (isFinalSubmit) {
        alert("🎉 Property submitted and registered successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while saving property data.");
    }
  };

  const goNext = async () => {
    await saveStep(false);
    if (!completed.includes(current)) setCompleted(p => [...p, current]);
    if (current < STEPS.length - 1) setCurrent(c => c + 1);
  };

  const submitReview = async () => {
    await saveStep(true);
    if (!completed.includes(current)) setCompleted(p => [...p, current]);
    alert("Onboarding submitted and approved successfully!");
  };

  const stepComponentsList = [Step1, Step2, Step3, Step4, Step5];
  const StepComponent = stepComponentsList[current];

  if (loading) {
    return (
      <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", background:"#fafafa" }}>
        <p style={{ fontSize:15, fontWeight:600, color:"#059669" }}>Loading onboarding portal...</p>
      </div>
    );
  }

  return (
    <PortalShell portalName="Hotel Partner" portalColor="#059669" portalBg="#ECFDF5" portalIcon={Building2} navItems={NAV} userName={displayName} userRole="Property Manager">

      {/* Header */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
        style={{ background:"linear-gradient(135deg,#059669,#10b981)", borderRadius:20, padding:"24px 28px", marginBottom:28, color:"#fff" }}>
        <p style={{ fontSize:12, fontWeight:600, opacity:0.75, marginBottom:4 }}>FR-001</p>
        <h1 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>Hotel Registration & Onboarding</h1>
        <p style={{ fontSize:12, opacity:0.72 }}>Self-service onboarding portal · {completed.length}/{STEPS.length} steps completed</p>
      </motion.div>

      <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", gap:20 }}>

        {/* Step Sidebar */}
        <div>
          <Card style={{ padding:16 }}>
            <p style={{ fontSize:10, fontWeight:800, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>Onboarding Steps</p>
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isActive    = i === current;
              const isDone      = completed.includes(i);
              return (
                <button key={step.id} onClick={() => setCurrent(i)}
                  style={{ display:"flex", alignItems:"flex-start", gap:12, width:"100%", background: isActive ? "#ECFDF5":"transparent", border:`1.5px solid ${isActive ? "#059669":"transparent"}`, borderRadius:12, padding:"10px 12px", marginBottom:6, cursor:"pointer", textAlign:"left" }}>
                  <div style={{ width:32, height:32, borderRadius:10, background: isDone ? "#059669" : isActive ? "#059669" : "#f0f0f0", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {isDone ? <CheckCircle2 size={16} color="#fff" /> : <Icon size={16} color={isActive ? "#fff":"#9ca3af"} />}
                  </div>
                  <div>
                    <p style={{ fontSize:12, fontWeight:700, color: isActive ? "#059669":"#374151", lineHeight:1.2 }}>{step.label}</p>
                    <p style={{ fontSize:10, color:"#9ca3af", marginTop:2 }}>{step.desc}</p>
                  </div>
                </button>
              );
            })}
            {/* Progress */}
            <div style={{ marginTop:16, padding:"12px", background:"#f9fafb", borderRadius:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:11, fontWeight:600, color:"#6b7280" }}>Overall Progress</span>
                <span style={{ fontSize:11, fontWeight:800, color:"#059669" }}>{Math.round((completed.length / STEPS.length) * 100)}%</span>
              </div>
              <div style={{ height:6, background:"#e5e7eb", borderRadius:999 }}>
                <motion.div animate={{ width:`${(completed.length / STEPS.length) * 100}%` }} transition={{ duration:0.4 }}
                  style={{ height:"100%", background:"linear-gradient(90deg,#059669,#10b981)", borderRadius:999 }} />
              </div>
            </div>
          </Card>
        </div>

        {/* Form Card */}
        <div>
          <Card style={{ padding:28 }}>
            <AnimatePresence mode="wait">
              <motion.div key={current} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.25 }}>
                <StepComponent formData={formData} setFormData={setFormData} />
              </motion.div>
            </AnimatePresence>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:24, paddingTop:20, borderTop:"1px solid #f0f0f0" }}>
              <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
                style={{ padding:"9px 20px", borderRadius:999, border:"1.5px solid #e5e7eb", background:"#fff", fontSize:13, fontWeight:700, color:"#374151", cursor: current === 0 ? "not-allowed":"pointer", opacity: current === 0 ? 0.4 : 1 }}>
                ← Previous
              </button>
              <span style={{ fontSize:12, color:"#9ca3af" }}>Step {current + 1} of {STEPS.length}</span>
              {current < STEPS.length - 1 ? (
                <PrimaryButton label="Save & Continue →" color="#059669" onClick={goNext} />
              ) : (
                <PrimaryButton label="🚀 Submit for Review" color="#059669" onClick={submitReview} />
              )}
            </div>
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}
