import { NextResponse } from "next/server";
import { listPackages } from "@/lib/backend";

export async function GET() {
  const packages = await listPackages();
  return NextResponse.json({ packages });
}
