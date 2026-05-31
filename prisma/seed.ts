import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = "admin@admin.com";
  const password = "admin123456";

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      name: "Admin",
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created:", email, password);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });