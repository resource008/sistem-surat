import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/infrastructure/databases/prisma-client"
import { ensureTrackTableSchema } from "@/infrastructure/repositories/track-table/schema"
import { AppError } from "@/lib/errors"
import { requireAdmin } from "@/lib/require-admin"

type RouteContext = { params: Promise<{ id: string }> }
type FieldUsageRow = {
  fieldId: string
  valueCount: number | bigint
}

async function ensureTrackRecordSchema() {
  await ensureTrackTableSchema()

  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS track_records (
      id TEXT PRIMARY KEY,
      sheet_id TEXT NOT NULL REFERENCES track_sheets(id) ON DELETE CASCADE,
      values JSONB NOT NULL DEFAULT '{}',
      created_by_id TEXT,
      created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `

  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS track_records_sheet_id_idx
    ON track_records(sheet_id)
  `
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    await ensureTrackRecordSchema()

    const { id } = await params
    const sheetId = decodeURIComponent(id)
    const rows = await prisma.$queryRaw<FieldUsageRow[]>`
      SELECT
        f.id AS "fieldId",
        COUNT(r.id) FILTER (
          WHERE NULLIF(BTRIM(r.values ->> f.id), '') IS NOT NULL
        ) AS "valueCount"
      FROM track_fields f
      LEFT JOIN track_records r ON r.sheet_id = f.sheet_id
      WHERE f.sheet_id = ${sheetId}
      GROUP BY f.id
    `

    return NextResponse.json({
      usage: Object.fromEntries(
        rows.map((row) => [row.fieldId, Number(row.valueCount)])
      ),
    })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error("GET /api/admin/track-table/[id]/field-usage:", error.message)
    return NextResponse.json({ error: "Gagal mengambil penggunaan kolom" }, { status: 500 })
  }
}
