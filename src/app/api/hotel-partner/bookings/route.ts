import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.portal !== "hotel_partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hotel = await prisma.hotel.findFirst({
      where: { ownerId: user.id },
    });

    if (!hotel) {
      return NextResponse.json({ bookings: [] });
    }

    const rooms = await prisma.room.findMany({
      where: { hotelId: hotel.id },
      select: { id: true },
    });

    const roomIds = rooms.map((r) => r.id);

    // Get bookings where itemId is the hotelId or is one of the roomIds of this hotel
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { itemType: "hotel", itemId: hotel.id },
          { itemType: "room", itemId: { in: roomIds } },
        ],
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error: any) {
    logger.error("Error fetching hotel bookings", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.portal !== "hotel_partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hotel = await prisma.hotel.findFirst({
      where: { ownerId: user.id },
    });

    if (!hotel) {
      return NextResponse.json({ error: "No hotel registered for user." }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: "Booking ID and status are required." }, { status: 422 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const rooms = await prisma.room.findMany({
      where: { hotelId: hotel.id },
      select: { id: true },
    });
    const roomIds = rooms.map((r) => r.id);

    const isMatch =
      (booking.itemType === "hotel" && booking.itemId === hotel.id) ||
      (booking.itemType === "room" && roomIds.includes(booking.itemId));

    if (!isMatch) {
      return NextResponse.json({ error: "Unauthorized update attempt." }, { status: 403 });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    logger.info("Updated booking status by hotel partner", { bookingId: id, status, userId: user.id });
    return NextResponse.json({ booking: updated });
  } catch (error: any) {
    logger.error("Error updating hotel booking status", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
