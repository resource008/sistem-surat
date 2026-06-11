import { NextResponse } from "next/server"
import { AppError } from "@/lib/errors"
import { getCurrentSession, getUserPermissions } from "@/lib/current-user-permissions"
import { userService } from "@/services/user-service"
import type { Role } from "@/types"

function getSessionUser(
  session: Awaited<ReturnType<typeof getCurrentSession>>
): { id: string; role: Extract<Role, "STAFF" | "PKL"> } {
  const user = session?.user as { id?: string; role?: Role } | undefined
  if (!user?.id || !user.role) throw new AppError(401, "Unauthorized")
  if (user.role !== "STAFF" && user.role !== "PKL") {
    throw new AppError(403, "Halaman akun hanya untuk Staff dan PKL")
  }
  return { id: user.id, role: user.role }
}

export async function GET() {
  try {
    const session = await getCurrentSession()
    const currentUser = getSessionUser(session)
    const user = await userService.getById(currentUser.id)
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
    throw new AppError(403, "Akun Staff dan PKL hanya dapat dilihat")
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error("PATCH /api/me/account:", error)
    return NextResponse.json({ error: "Gagal menyimpan akun" }, { status: 500 })
  }
}
