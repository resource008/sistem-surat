import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/infrastructure/databases/prisma-client"
import { ensureTrackTableSchema } from "@/infrastructure/repositories/track-table/schema"
import { AppError } from "@/lib/errors"
import { createRandomId } from "@/lib/random-id"
import { requireUserPermission } from "@/lib/current-user-permissions"

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
  id: z.string().min(1, "Data track wajib dipilih"),
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

async function ensureSheetExists(sheetId: string) {
  const rows = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id
    FROM track_sheets
    WHERE id = ${sheetId}
      AND hidden_at IS NULL
    LIMIT 1
  `

  if (!rows[0]) throw new AppError(404, "Sheet lacak tidak ditemukan")
}

async function getVisibleFields(sheetId: string) {
  return prisma.$queryRaw<TrackFieldMeta[]>`
    SELECT
      id,
      data_type AS "type",
      default_value AS "defaultValue"
    FROM track_fields
    WHERE sheet_id = ${sheetId}
      AND hidden_at IS NULL
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
    await requireUserPermission("canTrack")
    await ensureTrackRecordSchema()

    const sheetId = req.nextUrl.searchParams.get("sheetId")?.trim()
    if (!sheetId) {
      return NextResponse.json({ records: [] })
    }

    await ensureSheetExists(sheetId)

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

    return NextResponse.json({ records: rows.map(mapTrackRecord) })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    if (error instanceof Error) console.error("GET /api/track-records:", error.message)
    return NextResponse.json({ error: "Gagal mengambil data track surat" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireUserPermission("canTrack")
    await ensureTrackRecordSchema()

    const body = await req.json().catch(() => null)
    const parsed = TrackRecordSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0]
        ?? parsed.error.flatten().formErrors[0]
        ?? "Data tidak valid"
      return NextResponse.json({ error: firstError }, { status: 422 })
    }

    await ensureSheetExists(parsed.data.sheetId)

    const id = createTrackRecordId()
    const visibleFields = await getVisibleFields(parsed.data.sheetId)
    const payloadValues = normalizeTrackValues(parsed.data.values, visibleFields)
    const values = JSON.stringify(payloadValues)
    const userId = (session.user as { id?: string }).id ?? null

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
        ${userId}
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
        message: "Data track surat berhasil disimpan",
        record: mapTrackRecord(rows[0]),
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    if (error instanceof Error) console.error("POST /api/track-records:", error.message)
    return NextResponse.json({ error: "Gagal menyimpan data track surat" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireUserPermission("canTrack")
    await ensureTrackRecordSchema()

    const body = await req.json().catch(() => null)
    const parsed = TrackRecordUpdateSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0]
        ?? parsed.error.flatten().formErrors[0]
        ?? "Data tidak valid"
      return NextResponse.json({ error: firstError }, { status: 422 })
    }

    await ensureSheetExists(parsed.data.sheetId)

    const currentRows = await prisma.$queryRaw<TrackRecordRow[]>`
      SELECT
        id,
        sheet_id AS "sheetId",
        values,
        created_by_id AS "createdById",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM track_records
      WHERE id = ${parsed.data.id}
        AND sheet_id = ${parsed.data.sheetId}
      LIMIT 1
    `
    const current = currentRows[0]
    if (!current) throw new AppError(404, "Data track surat tidak ditemukan")

    const visibleFields = await getVisibleFields(parsed.data.sheetId)
    const visibleFieldIds = new Set(visibleFields.map((field) => field.id))
    const visibleFieldById = new Map(visibleFields.map((field) => [field.id, field]))
    const nextValues = { ...mapTrackRecord(current).values }
    Object.entries(parsed.data.values).forEach(([fieldId, value]) => {
      if (!visibleFieldIds.has(fieldId)) return
      const field = visibleFieldById.get(fieldId)
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
      message: "Data track surat berhasil diperbarui",
      record: mapTrackRecord(rows[0]),
    })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    if (error instanceof Error) console.error("PATCH /api/track-records:", error.message)
    return NextResponse.json({ error: "Gagal memperbarui data track surat" }, { status: 500 })
  }
}
