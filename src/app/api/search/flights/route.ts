import { NextResponse } from "next/server";
import { listFlights } from "@/lib/backend";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const from = url.searchParams.get("from") || "";
  const to = url.searchParams.get("to") || "";
  const flights = await listFlights({ from, to });
  return NextResponse.json({ flights });
}
