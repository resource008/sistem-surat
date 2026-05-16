// src/infrastructure/repositories/user-repositories.ts

import { prisma } from "@/infrastructure/databases/prisma-client"
import { scryptAsync } from "@noble/hashes/scrypt.js"
import { randomBytes, bytesToHex } from "@noble/hashes/utils.js"
import type { CreateUserInput } from "@/app/validation/user"

// ─── Password helper ──────────────────────────────────────────────────────────

async function hashPassword(password: string): Promise<string> {
  const salt = bytesToHex(randomBytes(16))
  const key  = await scryptAsync(password.normalize("NFKC"), salt, {
    N:      16384,
    r:      16,
    p:      1,
    dkLen:  64,
    maxmem: 128 * 16384 * 16 * 2,
  })
  return `${salt}:${bytesToHex(key)}`
}

// ─── Repository ───────────────────────────────────────────────────────────────

export class UserRepository {

  async findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } })
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  }

  async create(input: CreateUserInput) {
    const hashedPassword = await hashPassword(input.password)

    const user = await prisma.user.create({
      data: {
        id:            crypto.randomUUID(),
        name:          input.name,
        email:         input.email,
        username:      input.username,
        emailVerified: false,
        role:          input.role,
        accounts: {
          create: {
            id:         crypto.randomUUID(),
            accountId:  crypto.randomUUID(),
            providerId: "credential",
            password:   hashedPassword,
          },
        },
      },
    })

    // Jangan kembalikan password
    return {
      id:       user.id,
      name:     user.name,
      email:    user.email,
      username: user.username,
      role:     user.role,
    }
  }
}