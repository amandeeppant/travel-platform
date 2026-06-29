import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { place, budget, days, numberOfPeople, interests, pace, accommodation, requirements, content } = body;
    if (!place || !days || !content) {
      return NextResponse.json({ error: "Place, duration and content are required to save an itinerary." }, { status: 422 });
    }

    const itinerary = await prisma.itinerary.create({
      data: {
        userId: user.id,
        destination: place,
        duration: Number(days),
        budget: budget || "Moderate",
        headcount: Number(numberOfPeople) || 1,
        interests: interests && Array.isArray(interests) ? interests : [],
        pace: pace || "Balanced",
        accommodation: accommodation || "Boutique Hotel",
        requirements: requirements || "",
        content: content,
      },
    });

    return NextResponse.json({ success: true, itinerary });
  } catch (error: any) {
    logger.error("Error saving itinerary", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
