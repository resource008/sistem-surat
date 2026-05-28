import { headers }      from "next/headers"
import { NextResponse } from "next/server"
import { auth }         from "@/infrastructure/auth/better-auth"
import { prisma }       from "@/infrastructure/databases/prisma-client"

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()

    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data : { lastLoginAt: now },
      }),
      prisma.session.update({
        where: { token: session.session.token },
        data : { updatedAt: now },
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("POST /api/login-activity:", message)

    return NextResponse.json(
      { error: "Gagal mencatat aktivitas login" },
      { status: 500 }
    )
  }
}