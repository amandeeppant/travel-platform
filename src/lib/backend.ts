import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const PORTAL_MAP = {
  traveler: "traveler",
  "hotel-partner": "hotel_partner",
  corporate: "corporate",
  "travel-agent": "travel_agent",
  admin: "admin",
} as const;

type PortalInput = keyof typeof PORTAL_MAP;

export type PortalUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  portal: typeof PORTAL_MAP[PortalInput];
  org?: string | null;
  password: string;
  createdAt: Date;
};

export type HotelItem = {
  id: string;
  name: string;
  location: string;
  description?: string | null;
  category?: string | null;
  rating: number;
  nightlyRate: number;
  currency: string;
  available: boolean;
};

export type FlightItem = {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  available: boolean;
};

export type PackageItem = {
  id: string;
  name: string;
  durationDays: number;
  price: number;
  currency: string;
  perks: string;
  available: boolean;
};

export type ActivityItem = {
  id: string;
  name: string;
  location: string;
  price: number;
  duration: string;
  currency: string;
  available: boolean;
};

export type VisaItem = {
  id: string;
  country: string;
  type: string;
  duration: string;
  fee: number;
  currency: string;
  available: boolean;
};

function normalizePortal(portal: string): typeof PORTAL_MAP[PortalInput] | null {
  if (portal in PORTAL_MAP) {
    return PORTAL_MAP[portal as PortalInput];
  }
  return null;
}

export async function findUserByEmail(email: string) {
  if (!email) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });
}

export type RegisterUserInput = Omit<PortalUser, "id" | "createdAt" | "portal"> & {
  portal: string;
};

export async function registerUser(data: RegisterUserInput) {
  const portalValue = normalizePortal(data.portal);
  if (!portalValue) {
    throw new Error("Invalid portal type.");
  }

  const normalizedEmail = data.email.toLowerCase();
  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      name: data.name,
      email: normalizedEmail,
      phone: data.phone,
      password: hashedPassword,
      portal: portalValue,
      org: data.org,
    },
  });
}

export async function searchHotels(query: { dest?: string }) {
  const dest = query.dest?.trim();
  const where: any = {
    available: true,
    ...(dest
      ? {
          OR: [
            { name: { contains: dest, mode: "insensitive" } },
            { location: { contains: dest, mode: "insensitive" } },
            { category: { contains: dest, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  return prisma.hotel.findMany({
    where,
    orderBy: { rating: "desc" },
  });
}

export async function listFlights(query: { from?: string; to?: string }) {
  const from = query.from?.trim();
  const to = query.to?.trim();
  const where: any = { available: true };
  if (from) where.origin = { contains: from, mode: "insensitive" };
  if (to) where.destination = { contains: to, mode: "insensitive" };

  return prisma.flight.findMany({
    where,
    orderBy: { price: "asc" },
  });
}

export async function listPackages() {
  return prisma.package.findMany({
    where: { available: true },
    orderBy: { price: "asc" },
  });
}

export async function listActivities() {
  return prisma.activity.findMany({
    where: { available: true },
    orderBy: { location: "asc" },
  });
}

export async function listVisas() {
  return prisma.visa.findMany({
    where: { available: true },
    orderBy: { country: "asc" },
  });
}
