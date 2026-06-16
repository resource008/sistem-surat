import { NextRequest, NextResponse } from "next/server"
import { headers }             from "next/headers"
import { auth }                from "@/infrastructure/auth/better-auth"
import { createDepartemen, fetchDepartemen } from "@/services/departemen-service"
import { CreateDepartemenSchema } from "@/app/validation/departemen"
import { AppError }            from "@/lib/errors"
import { requireAdmin }        from "@/lib/require-admin"
import type { ExtendedSession } from "@/types/auth"

function validationResponse(fieldErrors: Record<string, string[] | undefined>) {
  return NextResponse.json(
    {
      message: "Request tidak sesuai",
      errors: fieldErrors,
    },
    { status: 422 }
  )
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    }) as ExtendedSession | null

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await fetchDepartemen()
    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof Error) console.error("GET /api/dept:", error.message)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Body tidak valid" }, { status: 400 })
    }

    const parsed = CreateDepartemenSchema.safeParse(body)
    if (!parsed.success) {
      return validationResponse(parsed.error.flatten().fieldErrors)
    }

    const departemen = await createDepartemen(parsed.data)
    return NextResponse.json(
      {
        message: "Departemen berhasil ditambahkan",
        id: departemen.id,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error("POST /api/dept:", error.message)
    return NextResponse.json({ error: "Gagal membuat departemen" }, { status: 500 })
  }
}
