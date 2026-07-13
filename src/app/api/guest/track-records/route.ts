import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/infrastructure/databases/prisma-client"
import { ensureTrackTableSchema } from "@/infrastructure/repositories/track-table/schema"
import { createRandomId } from "@/lib/random-id"

export const dynamic = "force-dynamic"

type TrackRecordRow = {
  id: string
  sheetId: string
  values: unknown
  createdById: string | null
  createdAt: Date
  updatedAt: Date
}

type TrackFieldMeta = {
  id: string
  type: string
  defaultValue: string
}

const TrackRecordSchema = z.object({
  sheetId: z.string().min(1, "Sheet wajib dipilih"),
  values: z.record(z.string(), z.string().max(200, "Isian maksimal 200 karakter")).default({}),
})

const TrackRecordUpdateSchema = TrackRecordSchema.extend({
  id: z.string().min(1, "Data lacak wajib dipilih"),
})

function createTrackRecordId() {
  return `track_record_${createRandomId().replace(/-/g, "").slice(0, 20)}`
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

async function visibleSheetExists(sheetId: string) {
  const rows = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id
    FROM track_sheets
    WHERE id = ${sheetId}
      AND hidden_at IS NULL
    LIMIT 1
  `

  return Boolean(rows[0])
}

async function findRecord(id: string, sheetId: string) {
  const rows = await prisma.$queryRaw<TrackRecordRow[]>`
    SELECT
      id,
      sheet_id AS "sheetId",
      values,
      created_by_id AS "createdById",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM track_records
    WHERE id = ${id}
      AND sheet_id = ${sheetId}
    LIMIT 1
  `

  return rows[0] ?? null
}

async function findVisibleRecordById(id: string) {
  const rows = await prisma.$queryRaw<TrackRecordRow[]>`
    SELECT
      r.id,
      r.sheet_id AS "sheetId",
      r.values,
      r.created_by_id AS "createdById",
      r.created_at AS "createdAt",
      r.updated_at AS "updatedAt"
    FROM track_records r
    INNER JOIN track_sheets s ON s.id = r.sheet_id
    WHERE r.id = ${id}
      AND s.hidden_at IS NULL
    LIMIT 1
  `

  return rows[0] ?? null
}

async function getGuestEditableFields(sheetId: string) {
  return prisma.$queryRaw<TrackFieldMeta[]>`
    SELECT
      f.id,
      f.data_type AS "type",
      f.default_value AS "defaultValue"
    FROM track_fields f
    LEFT JOIN track_categories c ON c.id = f.category_id
    WHERE f.sheet_id = ${sheetId}
      AND LOWER(f.column_name) <> 'id'
      AND f.hidden_at IS NULL
      AND f.fill_by_hrd = false
      AND COALESCE(c.fill_by_hrd, false) = false
  `
}

function appendDefaultValue(value: string, field: TrackFieldMeta) {
  const trimmedValue = value.trim()
  const suffix = field.defaultValue.trim()

  if (!trimmedValue || !suffix || field.type === "date" || field.type === "category") {
    return trimmedValue
  }

  if (trimmedValue.toLowerCase().endsWith(suffix.toLowerCase())) {
    return trimmedValue
  }

  return `${trimmedValue} ${suffix}`
}

function normalizeTrackValues(inputValues: Record<string, string>, fields: TrackFieldMeta[]) {
  const fieldById = new Map(fields.map((field) => [field.id, field]))
  const nextValues: Record<string, string> = {}

  Object.entries(inputValues).forEach(([fieldId, value]) => {
    const field = fieldById.get(fieldId)
    if (!field) return

    nextValues[fieldId] = appendDefaultValue(value, field)
  })

  return nextValues
}

function mapTrackRecord(row: TrackRecordRow) {
  const values = row.values && typeof row.values === "object" && !Array.isArray(row.values)
    ? row.values as Record<string, string>
    : {}

  return {
    id: row.id,
    sheetId: row.sheetId,
    values,
    createdById: row.createdById,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function GET(req: NextRequest) {
  try {
    await ensureTrackRecordSchema()

    const recordId = req.nextUrl.searchParams.get("recordId")?.trim()
    if (recordId) {
      const record = await findVisibleRecordById(recordId)
      return NextResponse.json({ records: record ? [mapTrackRecord(record)] : [] }, {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      })
    }

    const sheetId = req.nextUrl.searchParams.get("sheetId")?.trim()
    if (!sheetId || !(await visibleSheetExists(sheetId))) {
      return NextResponse.json({ records: [] }, {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      })
    }

    const rows = await prisma.$queryRaw<TrackRecordRow[]>`
      SELECT
        id,
        sheet_id AS "sheetId",
        values,
        created_by_id AS "createdById",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM track_records
      WHERE sheet_id = ${sheetId}
      ORDER BY created_at DESC, id DESC
    `

    return NextResponse.json({ records: rows.map(mapTrackRecord) }, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    })
  } catch (error) {
    if (error instanceof Error) console.error("GET /api/guest/track-records:", error.message)
    return NextResponse.json({ error: "Gagal mengambil data lacak surat" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTrackRecordSchema()

    const body = await req.json().catch(() => null)
    const parsed = TrackRecordSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0]
        ?? parsed.error.flatten().formErrors[0]
        ?? "Data tidak valid"
      return NextResponse.json({ error: firstError }, { status: 422 })
    }

    if (!(await visibleSheetExists(parsed.data.sheetId))) {
      return NextResponse.json({ error: "Sheet lacak tidak ditemukan" }, { status: 404 })
    }

    const id = createTrackRecordId()
    const editableFields = await getGuestEditableFields(parsed.data.sheetId)
    const payloadValues = normalizeTrackValues(parsed.data.values, editableFields)
    const values = JSON.stringify(payloadValues)
    const rows = await prisma.$queryRaw<TrackRecordRow[]>`
      INSERT INTO track_records (
        id,
        sheet_id,
        values,
        created_by_id
      )
      VALUES (
        ${id},
        ${parsed.data.sheetId},
        CAST(${values} AS JSONB),
        ${null}
      )
      RETURNING
        id,
        sheet_id AS "sheetId",
        values,
        created_by_id AS "createdById",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `

    return NextResponse.json(
      {
        message: "Data lacak surat berhasil ditambahkan",
        record: mapTrackRecord(rows[0]),
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Error) console.error("POST /api/guest/track-records:", error.message)
    return NextResponse.json({ error: "Gagal menambahkan data lacak surat" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await ensureTrackRecordSchema()

    const body = await req.json().catch(() => null)
    const parsed = TrackRecordUpdateSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0]
        ?? parsed.error.flatten().formErrors[0]
        ?? "Data tidak valid"
      return NextResponse.json({ error: firstError }, { status: 422 })
    }

    if (!(await visibleSheetExists(parsed.data.sheetId))) {
      return NextResponse.json({ error: "Sheet lacak tidak ditemukan" }, { status: 404 })
    }

    const current = await findRecord(parsed.data.id, parsed.data.sheetId)
    if (!current) {
      return NextResponse.json({ error: "Data lacak surat tidak ditemukan" }, { status: 404 })
    }

    const currentValues = mapTrackRecord(current).values
    const editableFields = await getGuestEditableFields(parsed.data.sheetId)
    const editableFieldIds = new Set(editableFields.map((field) => field.id))
    const editableFieldById = new Map(editableFields.map((field) => [field.id, field]))
    const nextValues = { ...currentValues }

    Object.entries(parsed.data.values).forEach(([fieldId, value]) => {
      if (!editableFieldIds.has(fieldId)) return
      const field = editableFieldById.get(fieldId)
      nextValues[fieldId] = field ? appendDefaultValue(value, field) : value.trim()
    })

    const values = JSON.stringify(nextValues)
    const rows = await prisma.$queryRaw<TrackRecordRow[]>`
      UPDATE track_records
      SET
        values = CAST(${values} AS JSONB),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parsed.data.id}
        AND sheet_id = ${parsed.data.sheetId}
      RETURNING
        id,
        sheet_id AS "sheetId",
        values,
        created_by_id AS "createdById",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `

    return NextResponse.json({
      message: "Data lacak surat berhasil diperbarui",
      record: mapTrackRecord(rows[0]),
    })
  } catch (error) {
    if (error instanceof Error) console.error("PATCH /api/guest/track-records:", error.message)
    return NextResponse.json({ error: "Gagal memperbarui data lacak surat" }, { status: 500 })
  }
}
