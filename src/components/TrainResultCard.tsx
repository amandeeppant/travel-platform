"use client";

import { TrainSearchResult } from "@/types/train";
import { Clock, MapPin, Navigation } from "lucide-react";

interface TrainResultCardProps {
  train: TrainSearchResult;
  onViewRoute: () => void;
}

export default function TrainResultCard({ train, onViewRoute }: TrainResultCardProps) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#111827" }}>
            {train.trainName}
          </h3>
          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
            Train #{train.trainNumber}
          </p>
        </div>
        <div style={{ background: "#DBEAFE", padding: "8px 16px", borderRadius: "20px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e40af" }}>
            {train.day > 1 ? `Day ${train.day}` : "Today"}
          </span>
        </div>
      </div>

      {/* Main Journey */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "16px", alignItems: "center", marginBottom: "24px" }}>
        {/* From Station */}
        <div>
          <p style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 600, marginBottom: "4px", textTransform: "uppercase" }}>
            From
          </p>
          <p style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "2px" }}>
            {train.departureTime}
          </p>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            {train.boardingStation}
          </p>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
            {train.boardingStationCode}
          </p>
        </div>

        {/* Duration */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <Clock size={20} color="#6b7280" />
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
            {train.journeyDuration}
          </span>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>
            {train.totalStopsBetween + 1} stops
          </span>
        </div>

        {/* To Station */}
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 600, marginBottom: "4px", textTransform: "uppercase" }}>
            To
          </p>
          <p style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "2px" }}>
            {train.arrivalTime}
          </p>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            {train.destinationStation}
          </p>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
            {train.destinationStationCode}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={onViewRoute}
          style={{
            flex: 1,
            padding: "12px 16px",
            background: "#FFF",
            border: "2px solid #1677FF",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#1677FF",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#F0F7FF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#FFF";
          }}
        >
          <Navigation size={16} />
          View All Stops
        </button>

        <button
          style={{
            flex: 1,
            padding: "12px 16px",
            background: "#1677FF",
            border: "2px solid #1677FF",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#fff",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1260d6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#1677FF";
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
