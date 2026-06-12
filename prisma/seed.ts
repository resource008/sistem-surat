// prisma/seed.ts
import { scryptAsync } from "@noble/hashes/scrypt.js"
import { bytesToHex, randomBytes } from "@noble/hashes/utils.js"
import { PrismaPg } from "@prisma/adapter-pg"
import 'dotenv/config'
import { Pool } from "pg"
import { PrismaClient, Role } from "../src/generated/prisma"

const pool    = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool as any)
const prisma  = new PrismaClient({ adapter })

async function hashPassword(password: string): Promise<string> {
  const salt = bytesToHex(randomBytes(16))
  const key  = await scryptAsync(password.normalize("NFKC"), salt, {
    N: 16384, r: 16, p: 1, dkLen: 64,
    maxmem: 128 * 16384 * 16 * 2,
  })
  return `${salt}:${bytesToHex(key)}`
}

async function main() {

  console.log("Membuat data users...")
  const users = [
    { name: "Admin",      email: "admin@admin.com", username: "admin",  password: "admin123", role: Role.ADMIN },
  ]
  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } })
    if (existing) { console.log(`   ⏩ ${u.email} sudah ada`); continue }

    const user = await prisma.user.create({
      data: {
        id:            crypto.randomUUID(),
        name:          u.name,
        email:         u.email,
        username:      u.username,
        emailVerified: true,
        role:          u.role,
      },
    })
    await prisma.account.create({
      data: {
        id:         crypto.randomUUID(),
        accountId:  user.id,
        providerId: "credential",
        userId:     user.id,
        password:   await hashPassword(u.password),
      },
    })
    console.log(`   ✅ ${u.email} dibuat`)
  }
  console.log("\n✨ Seeding selesai!")
}

main()
  .catch((e) => { console.error("❌ Seeding gagal:", e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect(); await pool.end() })