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

    const url = new URL(request.url);
    const hotelId = url.searchParams.get("hotelId");

    let hotel;
    if (hotelId) {
      hotel = await prisma.hotel.findFirst({
        where: { id: hotelId, ownerId: user.id },
      });
    } else {
      hotel = await prisma.hotel.findFirst({
        where: { ownerId: user.id },
      });
    }

    if (!hotel) {
      return NextResponse.json({ rooms: [] });
    }

    const rooms = await prisma.room.findMany({
      where: { hotelId: hotel.id },
      orderBy: { roomNumber: "asc" },
    });

    return NextResponse.json({ rooms });
  } catch (error: any) {
    logger.error("Error fetching rooms", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.portal !== "hotel_partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { id, hotelId, roomNumber, type, floor, capacity, price, status, occupancy, maintenance } = body;

    let activeHotelId = hotelId;
    if (!activeHotelId) {
      const defaultHotel = await prisma.hotel.findFirst({
        where: { ownerId: user.id },
      });
      activeHotelId = defaultHotel?.id;
    }

    if (!activeHotelId) {
      return NextResponse.json({ error: "Please register your property first." }, { status: 400 });
    }

    const hotel = await prisma.hotel.findFirst({
      where: { id: activeHotelId, ownerId: user.id },
    });

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found or unauthorized." }, { status: 403 });
    }

    if (!roomNumber || !type || !price) {
      return NextResponse.json({ error: "roomNumber, type, and price are required." }, { status: 422 });
    }

    const roomData = {
      roomNumber,
      type,
      floor: floor ? Number(floor) : 1,
      capacity: capacity ? Number(capacity) : 2,
      price: Number(price),
      status: status || "Available",
      occupancy: occupancy ? Number(occupancy) : 0,
      maintenance: maintenance === true || maintenance === "true",
      hotelId: hotel.id,
    };

    let room;
    if (id) {
      // Update
      const existing = await prisma.room.findUnique({
        where: { id },
      });

      if (!existing || existing.hotelId !== hotel.id) {
        return NextResponse.json({ error: "Room not found or unauthorized." }, { status: 404 });
      }

      room = await prisma.room.update({
        where: { id },
        data: roomData,
      });
      logger.info("Updated room", { roomId: room.id, roomNumber: room.roomNumber });
    } else {
      // Create
      room = await prisma.room.create({
        data: roomData,
      });
      logger.info("Created room", { roomId: room.id, roomNumber: room.roomNumber });
    }

    return NextResponse.json({ room });
  } catch (error: any) {
    logger.error("Error saving room", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.portal !== "hotel_partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const hotelId = url.searchParams.get("hotelId");

    if (!id) {
      return NextResponse.json({ error: "Room ID is required" }, { status: 422 });
    }

    let hotel;
    if (hotelId) {
      hotel = await prisma.hotel.findFirst({
        where: { id: hotelId, ownerId: user.id },
      });
    } else {
      hotel = await prisma.hotel.findFirst({
        where: { ownerId: user.id },
      });
    }

    if (!hotel) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.room.findUnique({
      where: { id },
    });

    if (!existing || existing.hotelId !== hotel.id) {
      return NextResponse.json({ error: "Room not found or unauthorized." }, { status: 404 });
    }

    await prisma.room.delete({
      where: { id },
    });

    logger.info("Deleted room", { roomId: id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error("Error deleting room", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
