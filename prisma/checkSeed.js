const { PrismaClient } = require('@prisma/client');
(async () => {
  const p = new PrismaClient();
  try {
    const h = await p.hotel.count();
    const f = await p.flight.count();
    const pkg = await p.package.count();
    const a = await p.activity.count();
    const v = await p.visa.count();
    console.log('counts', { hotels: h, flights: f, packages: pkg, activities: a, visas: v });
  } catch (e) {
    console.error(e);
  } finally {
    await p.$disconnect();
  }
})();
