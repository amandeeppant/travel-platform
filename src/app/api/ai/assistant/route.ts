import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
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

    const { messages } = body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required." }, { status: 422 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      logger.error("Gemini API key is not configured.");
      return NextResponse.json({ 
        error: "AI service key is not configured. Please contact administration." 
      }, { status: 500 });
    }

    // Convert messages array to Gemini's expected prompt structure
    // We prefix system instructions to shape the persona
    const systemInstruction = `You are TravelEase's dedicated AI Customer Support Agent.
Your role is to assist users in a friendly, professional, and concise manner with travel questions, hotel/flight search advice, travel policies, booking steps, and destination recommendations.

Guidelines:
1. Keep responses clear, helpful, and under 3-4 paragraphs.
2. Provide support on refund policies (100% refund up to 24h prior to check-in).
3. Do NOT mention that you are powered by Gemini or Google.
4. Output clean plain text or simple markdown formatting.`;

    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    // Inject system instruction in contents or prompt format
    const payload = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      logger.error("Assistant AI service error", { status: response.status, body: errText });
      return NextResponse.json({ error: "Failed to generate support response. Please try again." }, { status: response.status });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I am unable to process that request right now. How else can I assist you?";

    return NextResponse.json({ reply });
  } catch (error: any) {
    logger.error("Error in AI assistant endpoint", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
