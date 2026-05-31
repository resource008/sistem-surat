import { NextRequest, NextResponse } from "next/server"
import { AppError }                  from "@/lib/errors"
import { requireAdmin }              from "@/lib/require-admin"
import { userService }               from "@/services/user-service"
import { UpdateUserSchema }          from "@/app/validation/user"

type RouteContext = { params: Promise<{ id: string }> }

// ── GET /api/users/[id] ───────────────────────────────────────

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()

    const { id } = await params
    const user   = await userService.getById(id)

    return NextResponse.json(user)

  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("GET /api/users/[id]:", error)
    return NextResponse.json({ error: "Gagal mengambil data user" }, { status: 500 })
  }
}

// ── PATCH /api/users/[id] ─────────────────────────────────────

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await requireAdmin()
    const { id }  = await params

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Body tidak valid" }, { status: 400 })
    }

    const parsed = UpdateUserSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const currentUserId = (session.user as any).id as string
    const user = await userService.update(id, parsed.data, currentUserId)

    return NextResponse.json(user)

  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("PATCH /api/users/[id]:", error)
    return NextResponse.json({ error: "Gagal mengupdate user" }, { status: 500 })
  }
}

// ── DELETE /api/users/[id] ────────────────────────────────────

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const session = await requireAdmin()
    const { id }  = await params

    const currentUserId = (session.user as any).id as string
    await userService.delete(id, currentUserId)

    return NextResponse.json({ message: "User berhasil dihapus" })

  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("DELETE /api/users/[id]:", error)
    return NextResponse.json({ error: "Gagal menghapus user" }, { status: 500 })
  }
}