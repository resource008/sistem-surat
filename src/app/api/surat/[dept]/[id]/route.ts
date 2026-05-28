import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/infrastructure/auth/better-auth"
import { fetchSuratById, editSurat, removeSurat } from "@/services/surat-service"
import { isPIDept } from "@/domain/surat/entities"
import { UpdatePISchema, UpdateSuratSchema } from "@/app/validation/surat"
import { Prisma } from "@/generated/prisma"

type Params = { params: Promise<{ dept: string; id: string }> }

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

// ─── Parse & validate id ──────────────────────────────────────────────────────

function parseId(raw: string): number | null {
  const n = parseInt(raw, 10)
  return isNaN(n) ? null : n
}

// ─── GET /api/surat/[dept]/[id] ───────────────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { dept, id } = await params
    const numId = parseId(id)
    if (numId === null) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 })
    }

    const data = await fetchSuratById(numId, dept)
    if (!data) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof Error) console.error("GET /api/surat/[dept]/[id]:", error.message)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// ─── PATCH /api/surat/[dept]/[id] ────────────────────────────────────────────

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { dept, id } = await params
    const numId = parseId(id)
    if (numId === null) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 })
    }

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Body tidak valid" }, { status: 400 })
    }

    const schema = isPIDept(dept) ? UpdatePISchema : UpdateSuratSchema
    const result = schema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 422 })
    }

    const updated = await editSurat(numId, dept, result.data)
    return NextResponse.json(updated)

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 })
      }
    }
    if (error instanceof Error) {
      console.error("PATCH /api/surat/[dept]/[id]:", error.message)
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// ─── DELETE /api/surat/[dept]/[id] ───────────────────────────────────────────

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { dept, id } = await params
    const numId = parseId(id)
    if (numId === null) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 })
    }

    await removeSurat(numId, dept)
    return NextResponse.json({ success: true })

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 })
      }
    }
    if (error instanceof Error) {
      console.error("DELETE /api/surat/[dept]/[id]:", error.message)
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}