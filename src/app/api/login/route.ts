import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/lib/backend";
import { signToken } from "@/lib/auth";
import { handleApiError } from "@/lib/apiError";
import { logger } from "@/lib/logger";
import { throttleRequest } from "@/lib/rateLimiter";
import { validateEmail, validatePassword, isAdminLoginCredentials, isTravellerTestLoginCredentials } from "@/lib/validators";

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
    const { allowed, resetAt } = throttleRequest(`login:${ip}`);
    if (!allowed) {
      logger.warn("Login rate limit exceeded", { ip });
      return NextResponse.json(
        { error: "Too many login attempts, please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)) },
        }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      logger.warn("Login failed: invalid JSON", { ip });
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { email, password } = body as { email?: string; password?: string };
    if (!validateEmail(email) || !validatePassword(password)) {
      logger.warn("Login failed: invalid credentials format", { ip, email });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (isAdminLoginCredentials(normalizedEmail, password)) {
      const adminUser = {
        id: "admin-1",
        name: "Administrator",
        email: normalizedEmail,
        portal: "admin" as const,
      };
      const token = signToken({ id: adminUser.id, email: adminUser.email, portal: adminUser.portal });
      logger.info("Admin login successful", { ip, email: adminUser.email });
      return NextResponse.json({
        token,
        user: { id: adminUser.id, name: adminUser.name, email: adminUser.email, portal: adminUser.portal },
      });
    }

    if (isTravellerTestLoginCredentials(normalizedEmail, password)) {
      const travelerUser = {
        id: "traveler-test-1",
        name: "Test Traveler",
        email: normalizedEmail,
        portal: "traveler" as const,
      };
      const token = signToken({ id: travelerUser.id, email: travelerUser.email, portal: travelerUser.portal });
      logger.info("Traveller test login successful", { ip, email: travelerUser.email });
      return NextResponse.json({
        token,
        user: { id: travelerUser.id, name: travelerUser.name, email: travelerUser.email, portal: travelerUser.portal },
      });
    }

    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      logger.warn("Login failed: user not found", { ip, email });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      logger.warn("Login failed: wrong password", { ip, email });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ id: user.id, email: user.email, portal: user.portal });
    logger.info("Login successful", { userId: user.id, ip });

    return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email, portal: user.portal } });
  } catch (error) {
    logger.error("Login error", error);
    return handleApiError(error);
  }
}
