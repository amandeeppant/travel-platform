This document explains how to migrate the project's Prisma schema and data from SQLite (development) to PostgreSQL (production).

Prerequisites
- Docker (optional) or access to a Postgres instance
- Node.js/npm and project dependencies installed
- A copy of your current SQLite database (if you want to copy data)

1) Start a local Postgres (optional, Docker)

```bash
# starts Postgres with user `dev`, password `secret`, db `travel`
docker run --name travel-db -e POSTGRES_PASSWORD=secret -e POSTGRES_USER=dev -e POSTGRES_DB=travel -p 5432:5432 -d postgres:15
```

2) Set environment variables

Create a `.env` in project root (do NOT commit it). Example values are in `.env.example`.

PowerShell example:

```powershell
$Env:DATABASE_URL = "postgresql://dev:secret@localhost:5432/travel?schema=public"
$Env:SHADOW_DATABASE_URL = "postgresql://dev:secret@localhost:5432/travel_shadow?schema=public"
```

Linux/macOS:

```bash
export DATABASE_URL="postgresql://dev:secret@localhost:5432/travel?schema=public"
export SHADOW_DATABASE_URL="postgresql://dev:secret@localhost:5432/travel_shadow?schema=public"
```

3) Update Prisma provider (schema)

Open `prisma/schema.prisma` and change the datasource provider from `sqlite` to `postgresql`:

```diff
-datasource db {
-  provider = "sqlite"
-  url      = env("DATABASE_URL")
-}
+datasource db {
+  provider = "postgresql"
+  url      = env("DATABASE_URL")
+}
```

(You can also keep the SQLite schema for local development and maintain a separate `schema.postgres.prisma` if you prefer.)

4) Generate client & run migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Notes:
- `prisma migrate dev` will create the migration files and apply them to the target database.
- If you already have data in SQLite you want to move to Postgres, consider using `pgloader` or `prisma db pull` + a manual data copy process.

5) Seed the database

If you have `prisma/seed.js` or similar, run:

```bash
npm run prisma:seed
```

6) Production considerations
- Use a managed Postgres (AWS RDS, Azure Database for PostgreSQL, Supabase, Railway, etc.).
- Store `DATABASE_URL` and `JWT_SECRET` in your hosting provider's secret manager (Vercel/Netlify/GCP/Azure).
- Use a connection pooler (PgBouncer) or Prisma Data Proxy to manage connections when scaling.
- Run migrations in CI/CD or during deploy steps (example: `npx prisma migrate deploy`).

7) Rollback & safety
- Keep database backups before migrating production data.
- Test the migration on a staging database before running in production.

If you want, I can create a branch with the `schema.prisma` provider changed and a sample `.env` for Postgres (no secrets committed). Tell me whether you want me to switch the schema file in the repo now or only add documentation and scripts.