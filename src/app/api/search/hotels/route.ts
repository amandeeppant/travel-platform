import { NextResponse } from "next/server";
import { searchHotels } from "@/lib/backend";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const dest = url.searchParams.get("dest") || "";
  const hotels = await searchHotels({ dest });
  return NextResponse.json({ hotels });
}
