const fs = require('fs');
const path = require('path');
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
const unixPath = absolute.replace(/\\/g, '/');
const urlFs = `file:${unixPath}`;
const urlTriple = `file:///${encodeURI(unixPath)}`;

console.log({ cwd: process.cwd(), raw, sqlitePath, absolute, exists: fs.existsSync(absolute), urlFs, urlTriple });

async function tryUrl(url) {
  console.log('\nTrying URL:', url);
  const client = new PrismaClient({ datasources: { db: { url } } });
  try {
    await client.$connect();
    console.log('connected for', url);
    await client.$disconnect();
  } catch (err) {
    console.error('error for', url, err.message);
  }
}

(async () => {
  await tryUrl(raw);
  await tryUrl(urlFs);
  await tryUrl(urlTriple);
})();
