import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const visas = await prisma.visa.findMany({ where: { available: true }, orderBy: { country: "asc" } });
  return NextResponse.json({ visas });
}
