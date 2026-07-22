import { NextRequest, NextResponse } from "next/server"
import { TrackSheetSchema } from "@/app/validation/track-table"
import { AppError } from "@/lib/errors"
import { requireAdmin } from "@/lib/require-admin"
import { deleteTrackSheet, fetchTrackSheetById, showTrackSheet, updateTrackSheet } from "@/services/track-table-service"

type RouteContext = { params: Promise<{ id: string }> }
type VisibilityAction = "show" | "hide"

function validationResponse(fieldErrors: Record<string, string[] | undefined>) {
  return NextResponse.json(
    {
      message: "Request tidak sesuai",
      errors: fieldErrors,
    },
    { status: 422 }
  )
}

function parseVisibilityAction(body: unknown): VisibilityAction | null {
  if (!body || typeof body !== "object" || !("action" in body)) return null

  const action = (body as { action?: unknown }).action
  return action === "show" || action === "hide" ? action : null
}

async function visibilityResponse(action: VisibilityAction, id: string) {
  if (action === "show") {
    await showTrackSheet(decodeURIComponent(id))
    return NextResponse.json({
      message: "Sheet lacak berhasil ditampilkan",
    })
  }

  await deleteTrackSheet(decodeURIComponent(id), "hide")
  return NextResponse.json({
    message: "Data sheet lacak berhasil disembunyikan",
  })
}

async function updateTrackSheetResponse(body: unknown, id: string) {
  if (!body) {
    return NextResponse.json({ message: "Body tidak valid" }, { status: 400 })
  }

  const parsed = TrackSheetSchema.safeParse(body)
  if (!parsed.success) {
    return validationResponse(parsed.error.flatten().fieldErrors)
  }

  await updateTrackSheet(decodeURIComponent(id), parsed.data)
  return NextResponse.json({
    message: "Data sheet lacak berhasil diperbarui",
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
    const queryAction = req.nextUrl.searchParams.get("action")

    if (queryAction) {
      return NextResponse.json(
        { message: "Action visibility harus dikirim melalui body request" },
        { status: 400 }
      )
    }

    const body = await req.json().catch(() => null)
    const visibilityAction = parseVisibilityAction(body)

    if (visibilityAction) {
      return await visibilityResponse(visibilityAction, id)
    }

    return await updateTrackSheetResponse(body, id)
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error("PATCH /api/admin/track-table/[id]:", error.message)
    return NextResponse.json({ message: "Gagal mengubah sheet lacak" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    const { id } = await params

    const body = await req.json().catch(() => null)
    return await updateTrackSheetResponse(body, id)
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error("PUT /api/admin/track-table/[id]:", error.message)
    return NextResponse.json({ message: "Gagal mengubah sheet lacak" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    const { id } = await params
    const action = req.nextUrl.searchParams.get("action")

    if (action) {
      return NextResponse.json(
        { message: "Endpoint hapus sheet lacak tidak menerima action visibility" },
        { status: 400 }
      )
    }

    await deleteTrackSheet(decodeURIComponent(id), "hard")
    return NextResponse.json({
      message: "Data sheet lacak berhasil dihapus permanen",
    })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error("DELETE /api/admin/track-table/[id]:", error.message)
    return NextResponse.json({ message: "Gagal memproses sheet lacak" }, { status: 500 })
  }
}
