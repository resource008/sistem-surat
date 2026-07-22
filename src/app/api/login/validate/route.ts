import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/infrastructure/databases/prisma-client"
import { verifyPassword } from "@/infrastructure/repositories/user/password"

const LoginValidationSchema = z.object({
  username: z.string().trim().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
})

const INVALID_CREDENTIAL_MESSAGE = "Username atau Password salah"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = LoginValidationSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        valid: false,
        field: "credentials",
        message: INVALID_CREDENTIAL_MESSAGE,
      },
      { status: 422 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { username: parsed.data.username },
    select: {
      accounts: {
        where: { providerId: "credential" },
        select: { password: true },
        take: 1,
      },
    },
  })

  if (!user) {
    return NextResponse.json(
      {
        valid: false,
        field: "credentials",
        message: INVALID_CREDENTIAL_MESSAGE,
      },
      { status: 404 }
    )
  }

  const passwordValid = await verifyPassword(parsed.data.password, user.accounts[0]?.password)
  if (!passwordValid) {
    return NextResponse.json(
      {
        valid: false,
        field: "credentials",
        message: INVALID_CREDENTIAL_MESSAGE,
      },
      { status: 401 }
    )
  }

  return NextResponse.json({ valid: true, message: "Login berhasil" })
}
