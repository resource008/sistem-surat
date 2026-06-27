import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/infrastructure/auth/better-auth"
import { prisma } from "@/infrastructure/databases/prisma-client"

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return new NextResponse(null, { status: 204 })
    }

    const now = new Date()

    await prisma.session.updateMany({
      where: {
        userId: session.user.id,
        expiresAt: { gt: now },
      },
      data: {
        expiresAt: now,
        updatedAt: now,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("POST /api/admin/logout-activity:", message)

    return NextResponse.json(
      { error: "Gagal mencatat aktivitas logout" },
      { status: 500 }
    )
  }
}
