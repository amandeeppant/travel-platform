"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Clock, MapPin, Zap, AlertCircle, Loader } from "lucide-react";
import TrainResultCard from "@/components/TrainResultCard";
import ViewStopsModal from "@/components/ViewStopsModal";
import { TrainSearchResult } from "@/types/train";

function TrainsPageContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");

  const [results, setResults] = useState<TrainSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrain, setSelectedTrain] = useState<string | null>(null);

  useEffect(() => {
    if (!from || !to || !date) {
      setError("Missing search parameters");
      setLoading(false);
      return;
    }

    const searchTrains = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/trains/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ from, to, departureDate: date }),
        });

        const data = await response.json();

        if (!data.success) {
          setError(data.error?.message || "Failed to search trains");
          setResults([]);
          return;
        }

        setResults(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchTrains();
  }, [from, to, date]);

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fb", paddingTop: "24px", paddingBottom: "60px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#111827", marginBottom: "12px" }}>
            Train Search Results
          </h1>
          <p style={{ fontSize: "16px", color: "#6b7280", marginBottom: "24px" }}>
            {from} → {to} on {new Date(date || "").toLocaleDateString("en-IN", { dateStyle: "medium" })}
          </p>

          {/* Filter/Stats Bar */}
          {!loading && results.length > 0 && (
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", fontSize: "14px" }}>
                <Zap size={16} color="#1677FF" />
                <span><strong>{results.length}</strong> trains available</span>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <Loader size={32} color="#1677FF" style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: "18px", fontWeight: 600, color: "#374151" }}>Searching trains...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <AlertCircle size={24} color="#DC2626" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#991B1B", marginBottom: "4px" }}>
                  Search Failed
                </h3>
                <p style={{ color: "#7F1D1D", fontSize: "14px" }}>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && results.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 24px", background: "#fff", borderRadius: "16px" }}>
            <MapPin size={64} color="#D1D5DB" style={{ margin: "0 auto 24px" }} />
            <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#374151", marginBottom: "12px" }}>
              No Trains Found
            </h2>
            <p style={{ fontSize: "16px", color: "#6b7280", marginBottom: "24px" }}>
              Try searching with different stations or dates
            </p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && results.length > 0 && (
          <div style={{ display: "grid", gap: "16px" }}>
            {results.map((train) => (
              <TrainResultCard
                key={`${train.trainNumber}-${train.boardingStopSequence}-${train.destinationStopSequence}`}
                train={train}
                onViewRoute={() => setSelectedTrain(train.trainNumber)}
              />
            ))}
          </div>
        )}
      </div>

      {/* View Stops Modal */}
      {selectedTrain && (
        <ViewStopsModal
          trainNumber={selectedTrain}
          onClose={() => setSelectedTrain(null)}
        />
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function TrainsPage() {
  return (
    <>
      <Navbar forceLight />
      <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f8f9fb" }} />}>
        <TrainsPageContent />
      </Suspense>
      <Footer />
    </>
  );
}
