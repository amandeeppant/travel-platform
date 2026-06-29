import { NextResponse } from "next/server";
import { listActivities } from "@/lib/backend";

export async function GET() {
  const activities = await listActivities();
  return NextResponse.json({ activities });
}
