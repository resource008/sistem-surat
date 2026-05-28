import { prisma }                     from "@/infrastructure/databases/prisma-client"
import { auth }                       from "@/infrastructure/auth/better-auth"
import { NextRequest, NextResponse }  from "next/server"
import { headers }                    from "next/headers"
import { scryptAsync }                from "@noble/hashes/scrypt.js"
import { randomBytes, bytesToHex }    from "@noble/hashes/utils.js"
import { AppError }                   from "@/lib/errors"
import { RoleSchema }                 from "@/types/auth"
import { CreateUserSchema }           from "@/app/validation/user"

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

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validasi role ADMIN di runtime
    const parsed = RoleSchema.safeParse((session.user as any).role)
    if (!parsed.success || parsed.data !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Body tidak valid" }, { status: 400 })
    }

    // Validasi input
    const result = CreateUserSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const { name, email, username, password, role } = result.data

    const [existingUsername, existingEmail] = await Promise.all([
      prisma.user.findUnique({ where: { username } }),
      prisma.user.findUnique({ where: { email } }),
    ])

    if (existingUsername) throw new AppError(400, "Username sudah dipakai")
    if (existingEmail)    throw new AppError(400, "Email sudah dipakai")

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        id:            crypto.randomUUID(),
        name,
        email,
        username,
        emailVerified: false,
        role,
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

    return NextResponse.json({
      id:       user.id,
      name:     user.name,
      email:    user.email,
      username: user.username,
      role:     user.role,
    }, { status: 201 })

  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error) {
      console.error("POST /api/users:", error.message)
    }
    return NextResponse.json({ error: "Gagal membuat user" }, { status: 500 })
  }
}