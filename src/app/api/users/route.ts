import { prisma } from "@/infrastructure/databases/prisma-client"
import { auth } from "@/infrastructure/auth/better-auth"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { scrypt, randomBytes } from "crypto"
import { promisify } from "util"

const scryptAsync = promisify(scrypt)

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex")
  const buf = (await scryptAsync(password, salt, 64)) as Buffer
  return `${buf.toString("hex")}.${salt}`
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { name, email, username, password, role } = await req.json()

  // Cek username sudah ada
  const existingUsername = await prisma.user.findUnique({
    where: { username },
  })

  if (existingUsername) {
    return NextResponse.json(
      { message: "Username sudah dipakai" },
      { status: 400 }
    )
  }

  // Cek email sudah ada
  const existingEmail = await prisma.user.findUnique({
    where: { email },
  })

  if (existingEmail) {
    return NextResponse.json(
      { message: "Email sudah dipakai" },
      { status: 400 }
    )
  }

  const hashedPassword = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      name,
      email,
      username,
      emailVerified: false,
      role,
      accounts: {
        create: {
          id: crypto.randomUUID(),
          accountId: crypto.randomUUID(),
          providerId: "credential",
          password: hashedPassword,
        },
      },
    },
  })

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    role: user.role,
  })
}