import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.portal !== "hotel_partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hotels = await prisma.hotel.findMany({
      where: { ownerId: user.id },
      include: { rooms: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ hotel: hotels[0] || null, hotels });
  } catch (error: any) {
    logger.error("Error fetching hotel profile", error);
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

    const {
      id,
      name,
      location,
      description,
      category,
      nightlyRate,
      propertyType,
      totalRooms,
      checkInTime,
      checkOutTime,
      contactEmail,
      contactPhone,
      address,
      amenities,
      gstNumber,
      panNumber,
      legalEntityName,
      entityType,
      fssaiLicense,
      tradeLicense,
      verificationStatus,
      bankAccountName,
      bankAccountNumber,
      bankIfscCode,
      bankAccountType,
      bankName,
      bankBranchName,
      bankVerificationStatus,
      latitude,
      longitude,
      initialRooms,
    } = body;

    if (!name || !location) {
      return NextResponse.json({ error: "Hotel name and location are required." }, { status: 422 });
    }

    // If ID is provided, update that specific hotel, else search for a matching slug/name
    let hotel = null;
    if (id) {
      hotel = await prisma.hotel.findFirst({
        where: { id, ownerId: user.id },
      });
    } else {
      hotel = await prisma.hotel.findFirst({
        where: { name, ownerId: user.id },
      });
    }

    const hotelData = {
      name,
      slug: hotel?.slug || `${slugify(name)}-${Math.random().toString(36).substring(2, 7)}`,
      location,
      description: description || null,
      category: category || null,
      nightlyRate: nightlyRate ? Number(nightlyRate) : 2500,
      currency: "INR",
      ownerId: user.id,
      propertyType: propertyType || null,
      totalRooms: totalRooms ? Number(totalRooms) : null,
      checkInTime: checkInTime || null,
      checkOutTime: checkOutTime || null,
      contactEmail: contactEmail || null,
      contactPhone: contactPhone || null,
      address: address || null,
      amenities: Array.isArray(amenities) ? amenities : [],
      gstNumber: gstNumber || null,
      panNumber: panNumber || null,
      legalEntityName: legalEntityName || null,
      entityType: entityType || null,
      fssaiLicense: fssaiLicense || null,
      tradeLicense: tradeLicense || null,
      verificationStatus: verificationStatus || "pending",
      bankAccountName: bankAccountName || null,
      bankAccountNumber: bankAccountNumber || null,
      bankIfscCode: bankIfscCode || null,
      bankAccountType: bankAccountType || null,
      bankName: bankName || null,
      bankBranchName: bankBranchName || null,
      bankVerificationStatus: bankVerificationStatus || "pending",
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
    };

    if (hotel) {
      hotel = await prisma.hotel.update({
        where: { id: hotel.id },
        data: hotelData,
      });
      logger.info("Updated hotel profile", { hotelId: hotel.id, userId: user.id });
    } else {
      hotel = await prisma.hotel.create({
        data: hotelData,
      });
      logger.info("Created hotel profile", { hotelId: hotel.id, userId: user.id });
    }

    // Handle initial room configurations if provided in registration Step 5
    if (Array.isArray(initialRooms) && initialRooms.length > 0) {
      // Clear existing rooms and recreate
      await prisma.room.deleteMany({
        where: { hotelId: hotel.id },
      });

      const roomsToCreate = [];
      let roomCounter = 101;
      for (const roomConfig of initialRooms) {
        const count = Number(roomConfig.count);
        const price = Number(roomConfig.price);
        if (isNaN(count) || count <= 0 || isNaN(price) || price <= 0) continue;

        for (let i = 0; i < count; i++) {
          roomsToCreate.push({
            roomNumber: `R-${roomCounter++}`,
            type: roomConfig.type,
            floor: Math.floor(roomCounter / 100),
            capacity: roomConfig.type.includes("Suite") || roomConfig.type.includes("Ocean") ? 3 : roomConfig.type.includes("Penthouse") ? 4 : 2,
            price: price,
            status: "Available",
            occupancy: 0,
            maintenance: false,
            hotelId: hotel.id,
          });
        }
      }

      if (roomsToCreate.length > 0) {
        await prisma.room.createMany({
          data: roomsToCreate,
        });
        logger.info("Created initial rooms", { count: roomsToCreate.length, hotelId: hotel.id });
      }
    }

    return NextResponse.json({ hotel });
  } catch (error: any) {
    logger.error("Error saving hotel profile", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
