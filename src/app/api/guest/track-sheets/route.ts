import { NextResponse } from "next/server"
import { fetchTrackTables } from "@/services/track-table-service"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const data = await fetchTrackTables()
    const sheets = data.sheets
      .filter((sheet) => !sheet.hiddenAt)
      .map((sheet) => ({
        ...sheet,
        fields: sheet.fields.filter((field) => !field.hiddenAt),
      }))

    return NextResponse.json({
      sheets,
      regions: data.regions,
    }, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    })
  } catch (error) {
    if (error instanceof Error) console.error("GET /api/guest/track-sheets:", error.message)
    return NextResponse.json({ error: "Gagal mengambil sheet lacak" }, { status: 500 })
  }
}
