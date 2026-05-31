import { NextRequest, NextResponse } from "next/server"
import { AppError }                  from "@/lib/errors"
import { requireAdmin }              from "@/lib/require-admin"
import { userService }               from "@/services/user-service"
import { GetUsersQuerySchema }       from "@/app/validation/user"
import { CreateUserSchema }          from "@/app/validation/user"

// ── GET /api/users ────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()

    const rawQuery = Object.fromEntries(req.nextUrl.searchParams.entries())
    const parsed   = GetUsersQuerySchema.safeParse(rawQuery)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const result = await userService.getAll(parsed.data)
    return NextResponse.json(result)

  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("GET /api/users:", error)
    return NextResponse.json({ error: "Gagal mengambil data user" }, { status: 500 })
  }
}

// ── POST /api/users ───────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Body tidak valid" }, { status: 400 })
    }

    const parsed = CreateUserSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const user = await userService.create(parsed.data)
    return NextResponse.json(user, { status: 201 })

  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("POST /api/users:", error)
    return NextResponse.json({ error: "Gagal membuat user" }, { status: 500 })
  }
}