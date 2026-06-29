import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itineraries = await prisma.itinerary.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ itineraries });
  } catch (error: any) {
    logger.error("Error fetching saved itineraries", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

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

    const { place, budget, days, numberOfPeople, interests, pace, accommodation, requirements } = body;
    if (!place || !days) {
      return NextResponse.json({ error: "Place and number of days are required." }, { status: 422 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      logger.error("Gemini API key is not configured.");
      return NextResponse.json({ 
        error: "Gemini API key is not configured in environment variables. Please add GEMINI_API_KEY to your .env file." 
      }, { status: 500 });
    }

    const interestsText = interests && Array.isArray(interests) && interests.length > 0 
      ? interests.join(", ") 
      : "General Sightseeing, Exploration";

    const prompt = `You are a world-class travel guide and professional planner. Generate a highly detailed, personalized day-by-day travel itinerary for a trip to "${place}".

Trip Information:
- Duration: ${days} days
- Budget Category: ${budget || "Moderate"}
- Number of Travelers: ${numberOfPeople || "1"}
- Traveler Interests: ${interestsText}
- Pace of the Trip: ${pace || "Balanced"}
- Accommodation Preference: ${accommodation || "Boutique Hotel"}
- Special Requirements / Diet / Accessibility: ${requirements || "None specified"}

Requirements:
1. Provide a beautiful title and an introductory overview of the destination.
2. For each day, provide a structured plan (Morning, Afternoon, Evening) with specific name recommendations for places to visit, things to do, and dining spots (breakfast, lunch, dinner).
3. Include realistic travel/transit tips between spots.
4. Estimate local daily expenses for food, transport, and admissions based on the budget category.
5. Provide essential local tips (culture, safety, best hours, packing essentials).
6. Return the response in clean, premium GitHub-flavored Markdown. Do not include markdown wraps like \`\`\`markdown, output the raw markdown text directly.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      logger.error("AI service error", { status: response.status, body: errText });
      return NextResponse.json({ error: "Failed to generate itinerary. Please try again." }, { status: response.status });
    }

    const data = await response.json();
    const itinerary = data.candidates?.[0]?.content?.parts?.[0]?.text || "No itinerary generated.";

    return NextResponse.json({ itinerary });
  } catch (error: any) {
    logger.error("Error generating itinerary", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
