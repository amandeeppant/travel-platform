import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TravelEase – Trains, Flights, Hotels & More",
  description: "Book trains, flights, buses and hotels at the best prices. Your journey, just a tap away.",
  keywords: "train booking, flight booking, hotel booking, travel india",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} overflow-x-hidden`}>
      <body className="antialiased overflow-x-hidden">{children}</body>
    </html>
  );
}
