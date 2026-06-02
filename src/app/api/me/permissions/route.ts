import { NextResponse } from "next/server"
import { AppError } from "@/lib/errors"
import { getCurrentSession, getUserPermissions } from "@/lib/current-user-permissions"
import type { Role } from "@/types"

export async function GET() {
  try {
    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user as { id?: string; role?: Role }
    if (!user.id || !user.role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const permissions = await getUserPermissions(user.id, user.role)
    return NextResponse.json({ role: user.role, permissions })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error("GET /api/me/permissions:", error)
    return NextResponse.json({ error: "Gagal mengambil hak akses" }, { status: 500 })
  }
}
