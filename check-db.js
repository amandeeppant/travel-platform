const { PrismaClient } = require("@prisma/client");
const prismaClient = new PrismaClient();

async function main() {
  const hotels = await prismaClient.hotel.findMany({
    include: { rooms: true }
  });
  console.log("Found hotels in database:", JSON.stringify(hotels.map(h => ({
    id: h.id,
    name: h.name,
    location: h.location,
    nightlyRate: h.nightlyRate,
    roomCount: h.rooms.length,
    rooms: h.rooms.map(r => ({ id: r.id, roomNumber: r.roomNumber, price: r.price }))
  })), null, 2));
}

main()
  .catch(console.error)
  .finally(() => prismaClient.$disconnect());
