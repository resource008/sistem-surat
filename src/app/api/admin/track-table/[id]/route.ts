import { NextRequest, NextResponse } from "next/server"
import { TrackSheetSchema } from "@/app/validation/track-table"
import { AppError } from "@/lib/errors"
import { requireAdmin } from "@/lib/require-admin"
import { deleteTrackSheet, fetchTrackSheetById, showTrackSheet, updateTrackSheet } from "@/services/track-table-service"

type RouteContext = { params: Promise<{ id: string }> }

function validationResponse(fieldErrors: Record<string, string[] | undefined>) {
  return NextResponse.json(
    {
      message: "Request tidak sesuai",
      errors: fieldErrors,
    },
    { status: 422 }
  )
}

async function updateTrackSheetResponse(req: NextRequest, id: string) {
  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 })
  }

  const parsed = TrackSheetSchema.safeParse(body)
  if (!parsed.success) {
    return validationResponse(parsed.error.flatten().fieldErrors)
  }

  const sheet = await updateTrackSheet(decodeURIComponent(id), parsed.data)
  return NextResponse.json({
    message: "Data sheet lacak berhasil diubah",
    sheet,
  })
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    const { id } = await params

    const sheet = await fetchTrackSheetById(decodeURIComponent(id))
    return NextResponse.json(sheet)
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error("GET /api/admin/track-table/[id]:", error.message)
    return NextResponse.json({ error: "Gagal mengambil sheet lacak" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    const { id } = await params
    const action = req.nextUrl.searchParams.get("action")

    if (action === "show") {
      const sheet = await showTrackSheet(decodeURIComponent(id))
      return NextResponse.json({
        message: "Sheet lacak berhasil ditampilkan",
        sheet,
      })
    }

    return updateTrackSheetResponse(req, id)
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error("PATCH /api/admin/track-table/[id]:", error.message)
    return NextResponse.json({ error: "Gagal mengubah sheet lacak" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    const { id } = await params

    return updateTrackSheetResponse(req, id)
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error("PUT /api/admin/track-table/[id]:", error.message)
    return NextResponse.json({ error: "Gagal mengubah sheet lacak" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    const { id } = await params
    const mode = req.nextUrl.searchParams.get("mode") === "hard" ? "hard" : "hide"

    await deleteTrackSheet(decodeURIComponent(id), mode)
    return NextResponse.json({
      message: "Data sheet lacak berhasil dihapus",
    })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error("DELETE /api/admin/track-table/[id]:", error.message)
    return NextResponse.json({ error: "Gagal memproses sheet lacak" }, { status: 500 })
  }
}
