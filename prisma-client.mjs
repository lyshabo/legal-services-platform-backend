let clientPromise;

export function prismaEnabled() {
  return process.env.PERSISTENCE_ADAPTER === "prisma" && Boolean(process.env.DATABASE_URL);
}

export async function getPrisma() {
  if (!clientPromise) {
    clientPromise = import("@prisma/client").then(({ PrismaClient }) => new PrismaClient());
  }
  return clientPromise;
}
