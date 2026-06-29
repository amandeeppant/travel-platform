import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrainsResultsPage from "@/components/TrainsResultsPage";

export default function TrainsPage() {
  return (
    <>
      <Navbar forceLight />
      <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f8f9fb" }} />}>
        <TrainsResultsPage />
      </Suspense>
      <Footer />
    </>
  );
}
