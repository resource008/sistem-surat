import { NextResponse } from "next/server"
import { AppError } from "@/lib/errors"
import { getCurrentSession, getUserPermissions } from "@/lib/current-user-permissions"
import { prisma } from "@/infrastructure/databases/prisma-client"
import type { UserRole } from "@/domain/user/types"

function getSessionUser(
  session: Awaited<ReturnType<typeof getCurrentSession>>
): { id: string; role: UserRole } {
  const user = session?.user as { id?: string; role?: UserRole } | undefined
  if (!user?.id || !user.role) throw new AppError(401, "Unauthorized")
  return { id: user.id, role: user.role }
}

async function getAccountUser(id: string) {
  const now = new Date()
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      lastLoginAt: true,
      sessions: {
        select: { expiresAt: true },
        where: { expiresAt: { gt: now } },
      },
    },
  })

  if (!user) throw new AppError(404, "User tidak ditemukan")

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLogin: user.lastLoginAt ?? null,
    status: user.sessions.some((session) => new Date(session.expiresAt) > now)
      ? "Online"
      : "Offline",
  }
}

export async function GET() {
  try {
    const session = await getCurrentSession()
    const currentUser = getSessionUser(session)
    const user = await getAccountUser(currentUser.id)

    if (currentUser.role === "ADMIN") {
      return NextResponse.json(user)
    }

    const permissions = await getUserPermissions(currentUser.id, currentUser.role)
    return NextResponse.json({ ...user, permissions })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error("GET /api/me/account:", error)
    return NextResponse.json({ error: "Gagal mengambil data akun" }, { status: 500 })
  }
}

export async function PATCH() {
  try {
    const session = await getCurrentSession()
    getSessionUser(session)
    throw new AppError(403, "Akun pengguna hanya dapat dilihat")
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }

    console.error("PATCH /api/me/account:", error)
    return NextResponse.json({ message: "Gagal menyimpan akun" }, { status: 500 })
  }
}
