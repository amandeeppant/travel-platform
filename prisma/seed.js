const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prismaClient = new PrismaClient();

async function main() {
  await prismaClient.hotel.createMany({
    data: [
      {
        name: "The Leela Goa",
        slug: "the-leela-goa",
        location: "Goa",
        description: "Luxury beachfront resort on Cavelossim Beach with wellness, dining and poolside living.",
        category: "Luxury Resort",
        rating: 4.7,
        nightlyRate: 28000,
      },
      {
        name: "Taj Lake Palace",
        slug: "taj-lake-palace-udaipur",
        location: "Udaipur",
        description: "Iconic floating palace hotel on Lake Pichola with private boat access.",
        category: "Luxury Hotel",
        rating: 4.9,
        nightlyRate: 38000,
      },
      {
        name: "ITC Grand Chola",
        slug: "itc-grand-chola-chennai",
        location: "Chennai",
        description: "Palatial city resort with Michelin-style restaurants and business event spaces.",
        category: "Luxury Hotel",
        rating: 4.8,
        nightlyRate: 21000,
      },
    ],
  });

  await prismaClient.flight.createMany({
    data: [
      {
        airline: "Air India",
        flightNumber: "AI 145",
        origin: "BOM",
        destination: "DXB",
        departureTime: "06:30",
        arrivalTime: "09:45",
        duration: "3h 15m",
        price: 18200,
      },
      {
        airline: "IndiGo",
        flightNumber: "6E 293",
        origin: "DEL",
        destination: "SIN",
        departureTime: "21:10",
        arrivalTime: "03:40",
        duration: "5h 30m",
        price: 22400,
      },
      {
        airline: "British Airways",
        flightNumber: "BA 147",
        origin: "BLR",
        destination: "LHR",
        departureTime: "14:30",
        arrivalTime: "20:50",
        duration: "10h 20m",
        price: 55000,
      },
    ],
  });

  await prismaClient.package.createMany({
    data: [
      {
        name: "Goa Beach Escape",
        durationDays: 5,
        price: 24000,
        perks: "Flight + Hotel + Beach dinner",
      },
      {
        name: "Rajasthan Royal Tour",
        durationDays: 7,
        price: 38500,
        perks: "Guided sightseeing + heritage stay",
      },
      {
        name: "Kerala Backwaters",
        durationDays: 6,
        price: 31200,
        perks: "Houseboat stay + Ayurvedic spa",
      },
    ],
  });

  await prismaClient.activity.createMany({
    data: [
      {
        name: "Scuba Diving",
        location: "Goa",
        price: 3200,
        duration: "2h",
      },
      {
        name: "Hot Air Balloon Ride",
        location: "Jaipur",
        price: 8500,
        duration: "1h",
      },
      {
        name: "Trekking Adventure",
        location: "Manali",
        price: 1800,
        duration: "4h",
      },
    ],
  });

  await prismaClient.visa.createMany({
    data: [
      {
        country: "Canada",
        type: "Tourist Visa",
        duration: "6 months",
        fee: 8000,
      },
      {
        country: "Australia",
        type: "Visitor Visa",
        duration: "12 months",
        fee: 12500,
      },
      {
        country: "Singapore",
        type: "E-Visa",
        duration: "30 days",
        fee: 4200,
      },
    ],
  });

  // Create admin user from environment variables when provided.
  // Do NOT commit real secrets; set the following env vars locally or in CI:
  // SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_ADMIN_NAME, SEED_ADMIN_PHONE, SEED_ADMIN_PORTAL
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (adminPassword) {
    const hashed = bcrypt.hashSync(adminPassword, 10);
    const existing = await prismaClient.user.findUnique({ where: { email: adminEmail } });
    if (!existing) {
      await prisma.user.create({
        data: {
          name: process.env.SEED_ADMIN_NAME || "Admin",
          email: adminEmail,
          phone: process.env.SEED_ADMIN_PHONE || "9999999999",
          portal: process.env.SEED_ADMIN_PORTAL || "admin",
          org: null,
          password: hashed,
        },
      });
      console.log("Created admin user:", adminEmail);
    } else {
      console.log("Admin user already exists:", adminEmail);
    }
  } else {
    console.log("SEED_ADMIN_PASSWORD not set — skipping admin creation.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
