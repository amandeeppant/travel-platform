const { PrismaClient } = require('@prisma/client');
(async () => {
  const pClient = new PrismaClient();
  try {
    const h = await pClient.hotel.count();
    const f = await pClient.flight.count();
    const pkg = await pClient.package.count();
    const a = await pClient.activity.count();
    const v = await pClient.visa.count();
    console.log('counts', { hotels: h, flights: f, packages: pkg, activities: a, visas: v });
  } catch (e) {
    console.error(e);
  } finally {
    await pClient.$disconnect();
  }
})();
