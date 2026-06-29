import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/backend";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "";
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }
  const user = await findUserByEmail(email);
  return NextResponse.json({ user: user ?? null });
}
