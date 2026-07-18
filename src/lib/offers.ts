import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export type OfferInput = {
  percentOff: number | string;
  note: string;
  couponCode: string;
  validity: string;
  lives: number | string;
  isActive?: boolean;
};

export type OfferRecord = {
  id: string;
  percentOff: number;
  note: string;
  couponCode: string;
  validity: string;
  lives: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const storePath = path.resolve(process.cwd(), "data", "offers.json");

async function readStore(): Promise<OfferRecord[]> {
  try {
    const raw = await fs.readFile(storePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeStore(offers: OfferRecord[]) {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(offers, null, 2), "utf8");
}

async function getPrismaClient() {
  try {
    const mod = await import("@/lib/prisma");
    return mod.prisma;
  } catch {
    return null;
  }
}

function normalizeTimestamp(value: Date | string | null | undefined) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "string") {
    return value;
  }
  return new Date().toISOString();
}

export function normalizeOfferInput(input: OfferInput) {
  const percentOff = Number(input.percentOff);
  const lives = Number(input.lives);
  const note = typeof input.note === "string" ? input.note.trim() : "";
  const couponCode = typeof input.couponCode === "string" ? input.couponCode.trim().toUpperCase() : "";
  const validity = typeof input.validity === "string" ? input.validity.trim() : "";

  // Off Type changed from percentage — remove strict 0-100 percent validation.
  // Accept whatever `percentOff` value is provided (caller/UI now controls validity).
  if (!note) {
    throw new Error("A note is required.");
  }
  if (!couponCode) {
    throw new Error("A coupon code is required.");
  }
  if (!validity) {
    throw new Error("Validity is required.");
  }
  if (!Number.isFinite(lives) || lives < 0) {
    throw new Error("Lives must be a non-negative number.");
  }

  return {
    percentOff: Math.round(percentOff),
    note,
    couponCode,
    validity,
    lives: Math.round(lives),
    isActive: input.isActive ?? true,
  };
}

export function isOfferActive(offer: { isActive: boolean; lives: number }) {
  return offer.isActive && offer.lives > 0;
}

export async function listOffers(options: { includeInactive?: boolean } = {}) {
  const prisma = await getPrismaClient();
  const offerModel = (prisma as any)?.offer;
  if (offerModel && typeof offerModel.findMany === "function") {
    const offers = await offerModel.findMany({
      where: options.includeInactive ? {} : { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return offers.map((offer: any) => ({
      ...offer,
      createdAt: normalizeTimestamp(offer.createdAt),
      updatedAt: normalizeTimestamp(offer.updatedAt),
    })) as OfferRecord[];
  }

  const offers = await readStore();
  return offers.filter((offer) => (options.includeInactive ? true : offer.isActive && offer.lives > 0)).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function createOffer(input: OfferInput) {
  const normalized = normalizeOfferInput(input);
  const prisma = await getPrismaClient();
  const offerModel = (prisma as any)?.offer;
  if (offerModel && typeof offerModel.findUnique === "function" && typeof offerModel.create === "function") {
    const existing = await offerModel.findUnique({ where: { couponCode: normalized.couponCode } });
    if (existing) {
      throw new Error("A coupon with this code already exists.");
    }

    const created = await offerModel.create({ data: normalized });
    return {
      ...created,
      createdAt: normalizeTimestamp(created.createdAt),
      updatedAt: normalizeTimestamp(created.updatedAt),
    } as OfferRecord;
  }

  const offers = await readStore();
  if (offers.some((offer) => offer.couponCode.toLowerCase() === normalized.couponCode.toLowerCase())) {
    throw new Error("A coupon with this code already exists.");
  }

  const created = {
    id: randomUUID(),
    ...normalized,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as OfferRecord;
  offers.unshift(created);
  await writeStore(offers);
  return created;
}

export async function updateOffer(id: string, input: OfferInput) {
  const normalized = normalizeOfferInput(input);
  const prisma = await getPrismaClient();
  const offerModel = (prisma as any)?.offer;
  if (offerModel && typeof offerModel.findUnique === "function" && typeof offerModel.update === "function") {
    const existing = await offerModel.findUnique({ where: { couponCode: normalized.couponCode } });
    if (existing && existing.id !== id) {
      throw new Error("A coupon with this code already exists.");
    }

    const updated = await offerModel.update({ where: { id }, data: normalized });
    return {
      ...updated,
      createdAt: normalizeTimestamp(updated.createdAt),
      updatedAt: normalizeTimestamp(updated.updatedAt),
    } as OfferRecord;
  }

  const offers = await readStore();
  const existingIndex = offers.findIndex((offer) => offer.id === id);
  if (existingIndex === -1) {
    throw new Error("Offer not found.");
  }
  const duplicate = offers.find((offer) => offer.id !== id && offer.couponCode.toLowerCase() === normalized.couponCode.toLowerCase());
  if (duplicate) {
    throw new Error("A coupon with this code already exists.");
  }

  const updated = {
    ...offers[existingIndex],
    ...normalized,
    updatedAt: new Date().toISOString(),
  } as OfferRecord;
  offers[existingIndex] = updated;
  await writeStore(offers);
  return updated;
}

export async function deleteOffer(id: string) {
  const prisma = await getPrismaClient();
  const offerModel = (prisma as any)?.offer;
  if (offerModel && typeof offerModel.delete === "function") {
    return offerModel.delete({ where: { id } });
  }

  const offers = await readStore();
  const filtered = offers.filter((offer) => offer.id !== id);
  await writeStore(filtered);
  return null;
}
