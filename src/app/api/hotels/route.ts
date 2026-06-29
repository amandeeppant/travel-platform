import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const dest = url.searchParams.get("dest") || "";

    const hotels = await prisma.hotel.findMany({
      where: dest ? {
        OR: [
          { name: { contains: dest, mode: "insensitive" } },
          { location: { contains: dest, mode: "insensitive" } },
          { address: { contains: dest, mode: "insensitive" } },
        ]
      } : undefined,
      include: {
        rooms: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ hotels });
  } catch (error: any) {
    logger.error("Error searching hotels", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
