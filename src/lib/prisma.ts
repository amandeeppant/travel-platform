import { PrismaClient } from "@prisma/client";
import { DATABASE_URL } from "@/lib/env";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Prisma client singleton. In development we attach the client to the global
// object to avoid creating multiple instances during HMR.
//
// Production notes:
// - For Postgres in production, prefer a connection pooler (PgBouncer) or
//   Prisma Data Proxy to avoid exhausting database connections when scaling.
// - Keep the `DATABASE_URL` in your host/secret manager (do not commit it).
// - Example connection string (Postgres):
//   postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
export const prisma = global.prisma ?? new PrismaClient({
  datasources: { db: { url: DATABASE_URL } },
});
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
