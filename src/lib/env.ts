import path from "path";
import { pathToFileURL } from "url";

function getRequiredEnvVar(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    // Return placeholder during build phase so Next.js static page collection doesn't crash.
    // At runtime, Vercel will load the correct environment variables.
    if (process.env.NODE_ENV === "production" || process.env.NEXT_PHASE === "phase-production-build") {
      return `placeholder-${key.toLowerCase()}`;
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function normalizeEnvValue(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

const rawDatabaseUrl = normalizeEnvValue(getRequiredEnvVar("DATABASE_URL"));
const sqlitePath = rawDatabaseUrl.startsWith("file:") ? rawDatabaseUrl.slice(5) : rawDatabaseUrl;
const absoluteSqlitePath = path.resolve(process.cwd(), sqlitePath).replace(/\\/g, "/");

export const NODE_ENV = process.env.NODE_ENV || "development";
export const IS_PRODUCTION = NODE_ENV === "production";
export const DATABASE_URL = rawDatabaseUrl.startsWith("file:")
  ? `file:${absoluteSqlitePath}`
  : rawDatabaseUrl;
export const JWT_SECRET = getRequiredEnvVar("JWT_SECRET");
export const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";
export const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "";
export const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || "";

if (IS_PRODUCTION) {
  if (!process.env.RAPIDAPI_KEY || !process.env.RAPIDAPI_HOST) {
    console.warn("Warning: Missing required RapidAPI credentials (RAPIDAPI_KEY and RAPIDAPI_HOST).");
  }
}

export { getRequiredEnvVar };
