import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import QuickActions from "@/components/QuickActions";
import PopularDestinations from "@/components/PopularDestinations";
import FeaturedBanner from "@/components/FeaturedBanner";
import HotelCards from "@/components/HotelCards";
import OffersSection from "@/components/OffersSection";
import MobileAppSection from "@/components/MobileAppSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <div style={{ background: "#ffffff" }}><QuickActions /></div>
      <div style={{ background: "#f8f9fb" }}><PopularDestinations /></div>
      <div style={{ background: "#f8f9fb" }}><FeaturedBanner /></div>
      <div style={{ background: "#f8f9fb" }}><HotelCards /></div>
      <div style={{ background: "#ffffff" }}><OffersSection /></div>
      <div style={{ background: "#f8f9fb" }}><MobileAppSection /></div>
      <Footer />
    </>
  );
}
