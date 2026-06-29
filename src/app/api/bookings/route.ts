import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { handleApiError } from "@/lib/apiError";
import { logger } from "@/lib/logger";
import { validateItemId, validateItemType } from "@/lib/validators";

function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const user = await getUserFromRequest(request);
    if (!user) {
      logger.warn("Booking create attempt unauthorized", { ip });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      logger.warn("Booking create failed: invalid JSON", { ip, userId: user.id });
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const {
      itemType,
      itemId,
      checkInDate,
      checkOutDate,
      guestName,
      roomType,
      amount,
      paymentStatus,
    } = body as {
      itemType?: string;
      itemId?: string;
      checkInDate?: string;
      checkOutDate?: string;
      guestName?: string;
      roomType?: string;
      amount?: number;
      paymentStatus?: string;
    };

    if (!validateItemType(itemType) || !validateItemId(itemId)) {
      logger.warn("Booking create failed: invalid input", { ip, userId: user.id, itemType, itemId });
      return NextResponse.json({ error: "itemType and itemId are required and must be valid." }, { status: 422 });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        itemType,
        itemId,
        checkInDate: checkInDate ? new Date(checkInDate) : null,
        checkOutDate: checkOutDate ? new Date(checkOutDate) : null,
        guestName: guestName || null,
        roomType: roomType || null,
        amount: amount ? Number(amount) : null,
        paymentStatus: paymentStatus || "pending",
        status: "Confirmed", // auto-confirm for search bookings to simulate booking engine
      },
    });

    logger.info("Booking created", { userId: user.id, bookingId: booking.id, ip });
    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    logger.error("Booking create error", error);
    return handleApiError(error);
  }
}

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const userIdParam = url.searchParams.get("userId");

    if (user.portal === "admin") {
      const bookings = userIdParam
        ? await prisma.booking.findMany({ where: { userId: userIdParam }, orderBy: { createdAt: "desc" } })
        : await prisma.booking.findMany({ orderBy: { createdAt: "desc" } });
      return NextResponse.json({ bookings });
    }

    const bookings = await prisma.booking.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ bookings });
  } catch (error) {
    logger.error("Booking list error", error);
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 422 });

    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (existing.userId !== user.id && user.portal !== "admin") {
      logger.warn("Unauthorized booking delete attempt", { userId: user.id, bookingId: id });
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.booking.delete({ where: { id } });
    logger.info("Booking deleted", { bookingId: id, userId: user.id });
    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("Booking delete error", error);
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

    const { id, status } = body as { id?: string; status?: string };
    if (!id || !status) return NextResponse.json({ error: "id and status required" }, { status: 422 });

    if (user.portal !== "admin") {
      logger.warn("Unauthorized booking update attempt", { userId: user.id, bookingId: id });
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const booking = await prisma.booking.update({ where: { id }, data: { status } });
    logger.info("Booking status updated", { bookingId: id, status, userId: user.id });
    return NextResponse.json({ booking });
  } catch (error) {
    logger.error("Booking update error", error);
    return handleApiError(error);
  }
}
