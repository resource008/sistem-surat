import { NextRequest, NextResponse } from "next/server"
import { TrackSheetOrderSchema } from "@/app/validation/track-table"
import { AppError } from "@/lib/errors"
import { requireAdmin } from "@/lib/require-admin"
import { updateTrackSheetOrder } from "@/services/track-table-service"

function validationResponse(fieldErrors: Record<string, string[] | undefined>) {
  return NextResponse.json(
    {
      message: "Request tidak sesuai",
      errors: fieldErrors,
    },
    { status: 422 }
  )
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin()

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Body tidak valid" }, { status: 400 })
    }

    const parsed = TrackSheetOrderSchema.safeParse(body)
    if (!parsed.success) {
      return validationResponse(parsed.error.flatten().fieldErrors)
    }

    const data = await updateTrackSheetOrder(parsed.data)
    return NextResponse.json({
      message: "Urutan master tabel berhasil diubah",
      data,
    })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error("PATCH /api/admin/track-table/order:", error.message)
    return NextResponse.json({ error: "Gagal mengubah urutan master tabel" }, { status: 500 })
  }
}
