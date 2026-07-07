import { NextResponse } from "next/server"
import { fetchTrackTables } from "@/services/track-table-service"
import { AppError } from "@/lib/errors"
import { requireUserPermission } from "@/lib/current-user-permissions"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await requireUserPermission("canTrack")

    const data = await fetchTrackTables()
    const sheets = data.sheets
      .filter((sheet) => !sheet.hiddenAt)
      .map((sheet) => ({
        ...sheet,
        fields: sheet.fields.filter((field) => !field.hiddenAt),
      }))
    const regions = Array.from(
      new Set(
        sheets.flatMap((sheet) =>
          sheet.fields.map((field) => field.region).filter(Boolean)
        )
      )
    ).sort((a, b) => a.localeCompare(b))

    return NextResponse.json({ sheets, regions }, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    if (error instanceof Error) console.error("GET /api/track-sheets:", error.message)
    return NextResponse.json({ error: "Gagal mengambil sheet lacak" }, { status: 500 })
  }
}
