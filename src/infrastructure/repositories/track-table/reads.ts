import { prisma } from "@/infrastructure/databases/prisma-client"
import { AppError } from "@/lib/errors"
import type { TrackTableResponse } from "@/types"
import { attachTrackData } from "./mapper"
import { ensureTrackTableSchema } from "./schema"
import type { TrackCategoryRow, TrackFieldRow, TrackSheetRow } from "./types"

async function findTrackSheetRows() {
  return prisma.$queryRaw<TrackSheetRow[]>`
    SELECT
      id,
      name,
      display_category_id AS "displayCategoryId",
      sort_order AS "sortOrder",
      hidden_at AS "hiddenAt"
    FROM track_sheets
    ORDER BY sort_order ASC, name ASC
  `
}

async function findTrackCategoryRows(sheetIds: string[]) {
  if (sheetIds.length === 0) return []

  return prisma.$queryRaw<TrackCategoryRow[]>`
    SELECT
      id,
      sheet_id AS "sheetId",
      name,
      color,
      fill_by_hrd AS "fillRequired",
      add_role_values AS "addRoleValues",
      edit_role_values AS "editRoleValues",
      delete_role_values AS "deleteRoleValues",
      sort_order AS "sortOrder"
    FROM track_categories
    WHERE sheet_id = ANY(${sheetIds})
    ORDER BY sort_order ASC, name ASC
  `
}

async function findTrackFieldRows(sheetIds: string[]) {
  if (sheetIds.length === 0) return []

  return prisma.$queryRaw<TrackFieldRow[]>`
    SELECT
      id,
      sheet_id AS "sheetId",
      category_id AS "categoryId",
      category,
      category_color AS "categoryColor",
      region,
      column_name AS "columnName",
      data_type AS "type",
      default_value AS "defaultValue",
      category_options AS "categoryOptions",
      fill_by_hrd AS "fillRequired",
      add_role_values AS "addRoleValues",
      edit_role_values AS "editRoleValues",
      delete_role_values AS "deleteRoleValues",
      hidden_at AS "hiddenAt",
      sort_order AS "sortOrder"
    FROM track_fields
    WHERE sheet_id = ANY(${sheetIds})
    ORDER BY sort_order ASC, column_name ASC
  `
}

export async function findAllTrackTables(): Promise<TrackTableResponse> {
  await ensureTrackTableSchema()

  const sheets = await findTrackSheetRows()
  const sheetIds = sheets.map((sheet) => sheet.id)
  const [categories, fields] = await Promise.all([
    findTrackCategoryRows(sheetIds),
    findTrackFieldRows(sheetIds),
  ])
  const regions = Array.from(new Set(fields.map((field) => field.region).filter(Boolean))).sort((a, b) => a.localeCompare(b))

  return {
    sheets: attachTrackData(sheets, categories, fields),
    regions,
  }
}

export async function findTrackSheetByIdOrThrow(id: string) {
  await ensureTrackTableSchema()

  const rows = await prisma.$queryRaw<TrackSheetRow[]>`
    SELECT
      id,
      name,
      display_category_id AS "displayCategoryId",
      sort_order AS "sortOrder",
      hidden_at AS "hiddenAt"
    FROM track_sheets
    WHERE id = ${id}
    LIMIT 1
  `

  const sheet = rows[0]
  if (!sheet) throw new AppError(404, "Sheet lacak tidak ditemukan")

  const [categories, fields] = await Promise.all([
    findTrackCategoryRows([sheet.id]),
    findTrackFieldRows([sheet.id]),
  ])
  return attachTrackData([sheet], categories, fields)[0]
}
