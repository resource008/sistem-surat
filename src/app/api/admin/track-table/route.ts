import { NextRequest, NextResponse } from "next/server"
import { TrackSheetSchema } from "@/app/validation/track-table"
import { AppError } from "@/lib/errors"
import { requireAdmin } from "@/lib/require-admin"
import { createTrackSheet, fetchTrackTables } from "@/services/track-table-service"

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
    await requireAdmin()
    const data = await fetchTrackTables()
    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error("GET /api/admin/track-table:", error.message)
    return NextResponse.json({ error: "Gagal mengambil tabel lacak" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Body tidak valid" }, { status: 400 })
    }

    const parsed = TrackSheetSchema.safeParse(body)
    if (!parsed.success) {
      return validationResponse(parsed.error.flatten().fieldErrors)
    }

    const sheet = await createTrackSheet(parsed.data)
    return NextResponse.json(
      {
        message: "Sheet lacak berhasil ditambahkan",
        sheet,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error("POST /api/admin/track-table:", error.message)
    return NextResponse.json({ error: "Gagal membuat sheet lacak" }, { status: 500 })
  }
}
