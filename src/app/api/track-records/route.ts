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
  sequenceNo: number
  values: unknown
  createdById: string | null
  createdAt: Date
  updatedAt: Date
}

type TrackFieldMeta = {
  id: string
  categoryId: string | null
  columnName: string
  type: string
  defaultValue: string
  addRoleValues: string
  editRoleValues: string
  deleteRoleValues: string
  categoryAddRoleValues: string | null
  categoryEditRoleValues: string | null
  categoryDeleteRoleValues: string | null
}

const TrackRecordSchema = z.object({
  sheetId: z.string().min(1, "Sheet wajib dipilih"),
  values: z.record(z.string(), z.string().max(200, "Isian maksimal 200 karakter")).default({}),
})

const TrackRecordUpdateSchema = TrackRecordSchema.extend({
  id: z.string().min(1, "Data track wajib dipilih"),
  action: z.enum(["save", "clear"]).optional(),
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
      sequence_no INTEGER NOT NULL DEFAULT 0,
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

  await prisma.$executeRaw`
    ALTER TABLE track_records
    ADD COLUMN IF NOT EXISTS sequence_no INTEGER NOT NULL DEFAULT 0
  `

  await prisma.$executeRaw`
    WITH numbered AS (
      SELECT
        id,
        ROW_NUMBER() OVER (PARTITION BY sheet_id ORDER BY created_at ASC, id ASC) AS sequence_no
      FROM track_records
      WHERE sequence_no = 0
    )
    UPDATE track_records record
    SET sequence_no = numbered.sequence_no
    FROM numbered
    WHERE record.id = numbered.id
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
      f.id,
      f.category_id AS "categoryId",
      f.column_name AS "columnName",
      f.data_type AS "type",
      f.default_value AS "defaultValue",
      f.add_role_values AS "addRoleValues",
      f.edit_role_values AS "editRoleValues",
      f.delete_role_values AS "deleteRoleValues",
      c.add_role_values AS "categoryAddRoleValues",
      c.edit_role_values AS "categoryEditRoleValues",
      c.delete_role_values AS "categoryDeleteRoleValues"
    FROM track_fields f
    LEFT JOIN track_categories c
      ON c.id = f.category_id
      AND c.sheet_id = f.sheet_id
    WHERE f.sheet_id = ${sheetId}
      AND f.hidden_at IS NULL
  `
}

async function renumberTrackRecords(sheetId: string) {
  await prisma.$executeRaw`
    WITH numbered AS (
      SELECT
        id,
        ROW_NUMBER() OVER (
          ORDER BY sequence_no ASC, created_at ASC, id ASC
        ) AS next_sequence_no
      FROM track_records
      WHERE sheet_id = ${sheetId}
    )
    UPDATE track_records record
    SET
      sequence_no = numbered.next_sequence_no,
      updated_at = CURRENT_TIMESTAMP
    FROM numbered
    WHERE record.id = numbered.id
  `
}

function parseRoleValues(value: string) {
  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is string => typeof item === "string")
  } catch {
    return []
  }
}

function hasRoleAccess(roleValues: string, role?: string | null) {
  if (!role) return false
  if (role === "ADMIN") return true
  return parseRoleValues(roleValues).includes(role)
}

function canWriteField(field: TrackFieldMeta, role: string | undefined, action: "add" | "edit" | "delete") {
  if (field.columnName.trim().toLowerCase() === "id") return false
  if (role === "ADMIN") return true

  const roleValues = field.categoryId
    ? action === "add"
      ? field.categoryAddRoleValues ?? "[]"
      : action === "edit"
        ? field.categoryEditRoleValues ?? "[]"
        : field.categoryDeleteRoleValues ?? "[]"
    : action === "add"
      ? field.addRoleValues
      : action === "edit"
        ? field.editRoleValues
        : field.deleteRoleValues

  return hasRoleAccess(roleValues, role)
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

function assertWritableTrackValues(
  inputValues: Record<string, string>,
  fields: TrackFieldMeta[],
  role: string | undefined,
  action: "add" | "edit" | "delete"
) {
  const fieldById = new Map(fields.map((field) => [field.id, field]))

  Object.keys(inputValues).forEach((fieldId) => {
    const field = fieldById.get(fieldId)
    if (!field) return
    if (!canWriteField(field, role, action)) {
      throw new AppError(403, action === "delete"
        ? "Role Anda tidak memiliki akses untuk menghapus kolom ini"
        : "Role Anda tidak memiliki akses untuk mengubah kolom ini"
      )
    }
  })
}

function assertCanDeleteTrackRecord(fields: TrackFieldMeta[], role: string | undefined) {
  if (role === "ADMIN") return
  if (fields.some((field) => canWriteField(field, role, "delete"))) return
  throw new AppError(403, "Role Anda tidak memiliki akses untuk menghapus data track surat")
}

function mapTrackRecord(row: TrackRecordRow) {
  const values = row.values && typeof row.values === "object" && !Array.isArray(row.values)
    ? row.values as Record<string, string>
    : {}

  return {
    id: row.id,
    sheetId: row.sheetId,
    sequenceNo: Number(row.sequenceNo),
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
        sequence_no AS "sequenceNo",
        values,
        created_by_id AS "createdById",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM track_records
      WHERE sheet_id = ${sheetId}
      ORDER BY sequence_no ASC, created_at ASC, id ASC
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
      return NextResponse.json({ message: firstError }, { status: 422 })
    }

    await ensureSheetExists(parsed.data.sheetId)

    const id = createTrackRecordId()
    const visibleFields = await getVisibleFields(parsed.data.sheetId)
    const role = (session.user as { role?: string }).role
    assertWritableTrackValues(parsed.data.values, visibleFields, role, "add")
    const payloadValues = normalizeTrackValues(parsed.data.values, visibleFields)
    const values = JSON.stringify(payloadValues)
    const userId = (session.user as { id?: string }).id ?? null
    const sequenceRows = await prisma.$queryRaw<Array<{ nextSequenceNo: number | bigint }>>`
      SELECT COALESCE(MAX(sequence_no), 0) + 1 AS "nextSequenceNo"
      FROM track_records
      WHERE sheet_id = ${parsed.data.sheetId}
    `
    const sequenceNo = Number(sequenceRows[0]?.nextSequenceNo ?? 1)

    await prisma.$queryRaw<TrackRecordRow[]>`
      INSERT INTO track_records (
        id,
        sheet_id,
        sequence_no,
        values,
        created_by_id
      )
      VALUES (
        ${id},
        ${parsed.data.sheetId},
        ${sequenceNo},
        CAST(${values} AS JSONB),
        ${userId}
      )
      RETURNING
        id,
        sheet_id AS "sheetId",
        sequence_no AS "sequenceNo",
        values,
        created_by_id AS "createdById",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `

    return NextResponse.json(
      {
        message: "Data track surat berhasil disimpan",
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }

    if (error instanceof Error) console.error("POST /api/track-records:", error.message)
    return NextResponse.json({ message: "Gagal menyimpan data track surat" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireUserPermission("canTrack")
    await ensureTrackRecordSchema()

    const body = await req.json().catch(() => null)
    const parsed = TrackRecordUpdateSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0]
        ?? parsed.error.flatten().formErrors[0]
        ?? "Data tidak valid"
      return NextResponse.json({ message: firstError }, { status: 422 })
    }

    await ensureSheetExists(parsed.data.sheetId)

    const currentRows = await prisma.$queryRaw<TrackRecordRow[]>`
      SELECT
        id,
        sheet_id AS "sheetId",
        sequence_no AS "sequenceNo",
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
    const role = (session.user as { role?: string }).role
    const isClearAction = parsed.data.action === "clear"
    assertWritableTrackValues(parsed.data.values, visibleFields, role, isClearAction ? "delete" : "edit")
    const visibleFieldIds = new Set(visibleFields.map((field) => field.id))
    const visibleFieldById = new Map(visibleFields.map((field) => [field.id, field]))
    const nextValues = { ...mapTrackRecord(current).values }
    Object.entries(parsed.data.values).forEach(([fieldId, value]) => {
      if (!visibleFieldIds.has(fieldId)) return
      const field = visibleFieldById.get(fieldId)
      nextValues[fieldId] = field ? appendDefaultValue(value, field) : value.trim()
    })
    const values = JSON.stringify(nextValues)
    await prisma.$queryRaw<TrackRecordRow[]>`
      UPDATE track_records
      SET
        values = CAST(${values} AS JSONB),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parsed.data.id}
        AND sheet_id = ${parsed.data.sheetId}
      RETURNING
        id,
        sheet_id AS "sheetId",
        sequence_no AS "sequenceNo",
        values,
        created_by_id AS "createdById",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `

    return NextResponse.json({
      message: "Data track surat berhasil diperbarui",
    })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }

    if (error instanceof Error) console.error("PATCH /api/track-records:", error.message)
    return NextResponse.json({ message: "Gagal memperbarui data track surat" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireUserPermission("canTrack")
    await ensureTrackRecordSchema()

    const sheetId = req.nextUrl.searchParams.get("sheetId")?.trim()
    const id = req.nextUrl.searchParams.get("id")?.trim()
    if (!sheetId || !id) {
      return NextResponse.json({ message: "Data track wajib dipilih" }, { status: 422 })
    }

    await ensureSheetExists(sheetId)

    const currentRows = await prisma.$queryRaw<TrackRecordRow[]>`
      SELECT
        id,
        sheet_id AS "sheetId",
        sequence_no AS "sequenceNo",
        values,
        created_by_id AS "createdById",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM track_records
      WHERE id = ${id}
        AND sheet_id = ${sheetId}
      LIMIT 1
    `
    if (!currentRows[0]) throw new AppError(404, "Data track surat tidak ditemukan")

    const visibleFields = await getVisibleFields(sheetId)
    const role = (session.user as { role?: string }).role
    assertCanDeleteTrackRecord(visibleFields, role)

    await prisma.$executeRaw`
      DELETE FROM track_records
      WHERE id = ${id}
        AND sheet_id = ${sheetId}
    `
    await renumberTrackRecords(sheetId)

    return NextResponse.json({ message: "Data track surat berhasil dihapus" })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }

    if (error instanceof Error) console.error("DELETE /api/track-records:", error.message)
    return NextResponse.json({ message: "Gagal menghapus data track surat" }, { status: 500 })
  }
}
