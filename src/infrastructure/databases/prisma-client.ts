import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Inisialisasi Pool untuk PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const adapter = new PrismaPg(pool as any); // Pastikan tipe yang benar sesuai dengan PrismaPg

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}