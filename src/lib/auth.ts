import { sign, verify } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { JWT_EXPIRES, JWT_SECRET } from "@/lib/env";

export function signToken(payload: Record<string, any>) {
  return sign(payload, JWT_SECRET as string, { expiresIn: JWT_EXPIRES as string } as any);
}

export function verifyToken(token: string) {
  try {
    return verify(token, JWT_SECRET as string) as Record<string, any>;
  } catch (e) {
    return null;
  }
}

export async function getUserFromRequest(req: Request) {
  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded === "string") return null;
  const id = decoded.id as string | undefined;
  if (!id) return null;
  const user = await prisma.user.findUnique({ where: { id } });
  return user;
}

export async function getUserFromToken(token: string) {
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded === "string") return null;
  const id = decoded.id as string | undefined;
  if (!id) return null;
  return prisma.user.findUnique({ where: { id } });
}
