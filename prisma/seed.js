// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// The Clerk ID of the existing user you want to make Admin (from your screenshot)
const EXISTING_ADMIN_CLERK_ID = "user_2yDZcGFB6HKOqSL02lmETs5bR8m";

async function main() {
  console.log("🌱 Starting database seed linked to existing user...");

  // 1. FIND the existing user in the database
  const existingAdminUser = await prisma.user.findUnique({
    where: {
      clerkUserId: EXISTING_ADMIN_CLERK_ID,
    },
  });

  // Safety Check: Stop if user doesn't exist
  if (!existingAdminUser) {
    console.error(
      `❌ Error: User with Clerk ID '${EXISTING_ADMIN_CLERK_ID}' not found in MySQL.`
    );
    console.error(
      "Please run the app and log in once to create this user first."
    );
    process.exit(1);
  }
  console.log(
    `✅ Found existing Admin User: ${existingAdminUser.firstName} (${existingAdminUser.email})`
  );

  // 2. Create Society and link to the FINDING user's ID
  // We use a unique name to avoid conflicts if you run seed multiple times
  const societyName = `Seeded Residency ${new Date()
    .getTime()
    .toString()
    .slice(-4)}`;

  const society = await prisma.society.create({
    data: {
      name: societyName,
      address: "Tech Park Sector 45, Gwalior",
      registrationNumber: `REG-${new Date().getFullYear()}-SEED`,
      // Connect the existing user as the admin
      societyAdmins: {
        create: {
          userId: existingAdminUser.id, // <--- Using the REAL existing ID
          societyName: societyName,
          totalFlats: 50,
        },
      },
    },
  });
  console.log(`✅ Created Society linked to you: ${society.name}`);

  // 3. Create a Building
  const building = await prisma.building.create({
    data: {
      name: "Alpha Tower",
      numberOfFloors: 5,
      societyId: society.id,
    },
  });
  console.log(`✅ Created Building: ${building.name}`);

  // 4. Create some Flats
  await prisma.flat.createMany({
    data: [
      {
        flatNumber: "A-101",
        areaSqFt: 1200,
        bedrooms: 2,
        buildingId: building.id,
      },
      {
        flatNumber: "A-102",
        areaSqFt: 1500,
        bedrooms: 3,
        buildingId: building.id,
      },
      {
        flatNumber: "A-201",
        areaSqFt: 1200,
        bedrooms: 2,
        buildingId: building.id,
      },
    ],
  });
  console.log(`✅ Created 3 Flats in ${building.name}`);

  console.log("🚀 Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
