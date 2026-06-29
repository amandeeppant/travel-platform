const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { PrismaClient } = require('@prisma/client');

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = envContent.split(/\r?\n/).reduce((acc, line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) acc[match[1].trim()] = match[2].trim();
  return acc;
}, {});

const raw = (env.DATABASE_URL || '').replace(/^"|"$/g, '');
const sqlitePath = raw.startsWith('file:') ? raw.slice(5) : raw;
const absolute = path.resolve(process.cwd(), sqlitePath);
const fileUrl = pathToFileURL(absolute).toString();

console.log({
  cwd: process.cwd(),
  rawDatabaseUrl: env.DATABASE_URL,
  normalizedDatabaseUrl: raw,
  sqlitePath,
  absolute,
  exists: fs.existsSync(absolute),
  stats: fs.existsSync(absolute) ? fs.statSync(absolute) : null,
  fileUrl,
});

const prisma = new PrismaClient({ datasources: { db: { url: fileUrl } } });
prisma
  .$connect()
  .then(() => {
    console.log('prisma connected');
    return prisma.$disconnect();
  })
  .catch((err) => {
    console.error('prisma error', err);
    process.exit(1);
  });
