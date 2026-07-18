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
  percentOff: number | string;
  note: string;
  couponCode: string;
  validity: string;
  lives: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const storePath = path.resolve(process.cwd(), "data", "offers.json");
const tmpStorePath = path.resolve(process.platform === "win32" ? process.cwd() : "/tmp", "data", "offers.json");
let inMemoryOffers: OfferRecord[] | null = null;

async function readStore(): Promise<OfferRecord[]> {
  // Prefer tmp store (writable in many serverless environments) or in-memory when available.
  if (inMemoryOffers) {
    return [...inMemoryOffers];
  }

  try {
    const rawTmp = await fs.readFile(tmpStorePath, "utf8");
    const parsedTmp = JSON.parse(rawTmp);
    return Array.isArray(parsedTmp) ? parsedTmp : [];
  } catch {
    // fall through to project file
  }

  try {
    const raw = await fs.readFile(storePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeStore(offers: OfferRecord[]) {
  // Try writing to project data folder. If filesystem is read-only (EROFS),
  // attempt to write to /tmp (serverless), else keep data in-memory as a fallback.
  const payload = JSON.stringify(offers, null, 2);
  try {
    await fs.mkdir(path.dirname(storePath), { recursive: true });
    await fs.writeFile(storePath, payload, "utf8");
    // keep in-memory in sync
    inMemoryOffers = [...offers];
    return;
  } catch (err: any) {
    console.warn("writeStore: failed to write to storePath, attempting tmp or in-memory fallback:", err && err.code);
  }

  try {
    await fs.mkdir(path.dirname(tmpStorePath), { recursive: true });
    await fs.writeFile(tmpStorePath, payload, "utf8");
    inMemoryOffers = [...offers];
    return;
  } catch (err: any) {
    console.warn("writeStore: failed to write to tmpStorePath, falling back to in-memory store:", err && err.code);
    inMemoryOffers = [...offers];
    return;
  }
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
  const rawPercent = input.percentOff;
  const percentNum = Number(rawPercent);
  const lives = Number(input.lives);
  const note = typeof input.note === "string" ? input.note.trim() : "";
  const couponCode = typeof input.couponCode === "string" ? input.couponCode.trim().toUpperCase() : "";
  const validity = typeof input.validity === "string" ? input.validity.trim() : "";
  // Off Type changed from percentage — accept either numeric percent or free-text off type.
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

  const percentOffValue: number | string = Number.isFinite(percentNum) ? Math.round(percentNum) : (typeof rawPercent === "string" ? rawPercent.trim() : "");

  return {
    percentOff: percentOffValue,
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
    try {
      const offers = await offerModel.findMany({
        where: options.includeInactive ? {} : { isActive: true },
        orderBy: { createdAt: "desc" },
      });
      return offers.map((offer: any) => ({
        ...offer,
        createdAt: normalizeTimestamp(offer.createdAt),
        updatedAt: normalizeTimestamp(offer.updatedAt),
      })) as OfferRecord[];
    } catch (err) {
      console.error("Prisma listOffers failed, falling back to file store:", err);
    }
  }

  const offers = await readStore();
  return offers.filter((offer) => (options.includeInactive ? true : offer.isActive && offer.lives > 0)).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function createOffer(input: OfferInput) {
  const normalized = normalizeOfferInput(input);
  const prisma = await getPrismaClient();
  const offerModel = (prisma as any)?.offer;
  if (offerModel && typeof offerModel.findUnique === "function" && typeof offerModel.create === "function") {
    try {
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
    } catch (err) {
      console.error("Prisma createOffer failed, falling back to file store:", err);
    }
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
    try {
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
    } catch (err) {
      console.error("Prisma updateOffer failed, falling back to file store:", err);
    }
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
    try {
      return await offerModel.delete({ where: { id } });
    } catch (err) {
      console.error("Prisma deleteOffer failed, falling back to file store:", err);
    }
  }

  const offers = await readStore();
  const filtered = offers.filter((offer) => offer.id !== id);
  await writeStore(filtered);
  return null;
}
