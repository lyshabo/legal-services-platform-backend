import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL || !process.env.DIRECT_URL) {
  console.error("DATABASE_URL and DIRECT_URL are required for the live database check.");
  process.exitCode = 2;
  process.exit();
}

const prisma = new PrismaClient();

try {
  const rows = await prisma.$queryRaw`SELECT 1 AS ok`;
  if (!Array.isArray(rows) || Number(rows[0]?.ok) !== 1) {
    throw new Error("Database health query returned an unexpected result.");
  }
  console.log("PostgreSQL SELECT 1 succeeded.");
} finally {
  await prisma.$disconnect();
}
