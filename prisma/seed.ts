import 'dotenv/config'
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma"
import { scryptAsync } from "@noble/hashes/scrypt"
import { randomBytes, bytesToHex } from "@noble/hashes/utils"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function hashPassword(password: string): Promise<string> {
  const salt = bytesToHex(randomBytes(16))
  const key = await scryptAsync(password.normalize("NFKC"), salt, {
    N: 16384,
    r: 16,
    p: 1,
    dkLen: 64,
    maxmem: 128 * 16384 * 16 * 2,
  })
  return `${salt}:${bytesToHex(key)}`
}

async function main() {
  await prisma.user.deleteMany({
    where: { email: "admin@admin.com" },
  })

  const user = await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      name: "Admin",
      email: "admin@admin.com",
      username: "admin",
      emailVerified: true,
      role: "ADMIN",
    },
  })

  await prisma.account.create({
    data: {
      id: crypto.randomUUID(),
      accountId: user.id,
      providerId: "credential",
      userId: user.id,
      password: await hashPassword("admin123"),
    },
  })

  console.log("✅ Admin berhasil dibuat")
  console.log("   Username: admin")
  console.log("   Password: admin123")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())