import { NextResponse } from "next/server";
import { searchTrainsBetweenStations } from "@/lib/irctc";

// Sample train data for fallback/development
const SAMPLE_TRAINS = [
  {
    number: "12301",
    name: "Rajdhani Express",
    from: "NDLS", fromCity: "New Delhi",
    to: "MMCT", toCity: "Mumbai Central",
    dep: "16:55", arr: "08:35", duration: "15h 40m",
    days: "Mon Tue Wed Thu Fri Sat Sun",
    classes: [
      { cls: "1A", fare: "₹4,365", status: "AVL 12", avail: true },
      { cls: "2A", fare: "₹2,580", status: "AVL 45", avail: true },
      { cls: "3A", fare: "₹1,740", status: "WL 4", avail: false },
    ],
  },
  {
    number: "12951",
    name: "Mumbai Rajdhani",
    from: "NDLS", fromCity: "New Delhi",
    to: "BCT", toCity: "Mumbai Central",
    dep: "17:00", arr: "08:15", duration: "15h 15m",
    days: "Daily",
    classes: [
      { cls: "1A", fare: "₹4,895", status: "AVL 3", avail: true },
      { cls: "2A", fare: "₹2,840", status: "WL 2", avail: false },
      { cls: "3A", fare: "₹1,950", status: "AVL 22", avail: true },
      { cls: "SL", fare: "₹730", status: "AVL 88", avail: true },
    ],
  },
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const from = url.searchParams.get("from") || "";
  const to = url.searchParams.get("to") || "";
  const date = url.searchParams.get("date") || undefined;
  const train = url.searchParams.get("train") || url.searchParams.get("train_number") || undefined;

  if (!from || !to) {
    return NextResponse.json({ error: "from and to station codes are required" }, { status: 400 });
  }

  try {
    const data = await searchTrainsBetweenStations(from, to, date, train);
    return NextResponse.json({ data });
  } catch (err: any) {
    // Fallback to sample data if API fails (rate limit, invalid params, etc.)
    console.warn("IRCTC API error, returning sample data:", err?.message || err);
    const debug = {
      message: err?.message || String(err),
      status: err?.status || null,
    };

    // Include debug info in development to help troubleshooting
    const payload: any = { data: SAMPLE_TRAINS, fallback: true };
    if (process.env.NODE_ENV !== "production") payload.debug = debug;

    return NextResponse.json(payload, { status: 502 });
  }
}
