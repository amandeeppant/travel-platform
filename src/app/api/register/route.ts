import { NextResponse } from "next/server";
import { findUserByEmail, registerUser } from "@/lib/backend";
import { handleApiError } from "@/lib/apiError";
import { logger } from "@/lib/logger";
import { throttleRequest } from "@/lib/rateLimiter";
import { validateEmail, validatePassword, validatePhone, validatePortal, isNonEmptyString } from "@/lib/validators";

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
    const { allowed, resetAt } = throttleRequest(`register:${ip}`);
    if (!allowed) {
      logger.warn("Registration rate limit exceeded", { ip });
      return NextResponse.json(
        { error: "Too many registration attempts, please wait before retrying." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)) },
        }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      logger.warn("Registration failed: invalid JSON", { ip });
      return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
    }

    const { name, email, phone, password, org, portal } = body as {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
      org?: string;
      portal?: string;
    };

    if (!isNonEmptyString(name) || !validateEmail(email) || !validatePhone(phone) || !validatePassword(password) || !validatePortal(portal)) {
      logger.warn("Registration failed: invalid input", { ip, name, email, portal });
      return NextResponse.json({ error: "Invalid registration data." }, { status: 422 });
    }

    if (await findUserByEmail(email)) {
      logger.warn("Registration failed: duplicate email", { ip, email });
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    }

    const user = await registerUser({
      name,
      email,
      phone,
      password,
      org,
      portal,
    });

    logger.info("Registration successful", { userId: user.id, ip });
    return NextResponse.json(
      { user: { id: user.id, name: user.name, email: user.email, phone: user.phone, portal: user.portal, org: user.org } },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Registration error", error);
    return handleApiError(error);
  }
}
