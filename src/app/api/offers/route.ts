import { NextResponse } from "next/server";
import { listOffers } from "@/lib/offers";
import { handleApiError } from "@/lib/apiError";

export async function GET() {
  try {
    const offers = await listOffers();
    return NextResponse.json(offers);
  } catch (error) {
    return handleApiError(error);
  }
}
