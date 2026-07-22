import type { TrackSheetInput, TrackSheetOrderInput } from "@/app/validation/track-table"
import { prisma } from "@/infrastructure/databases/prisma-client"
import { AppError } from "@/lib/errors"
import { createRandomId } from "@/lib/random-id"
import { DEFAULT_TRACK_CATEGORY_COLOR } from "@/lib/track-category-color"
import { ensureTrackTableSchema } from "./schema"
import type { DbClient } from "./types"

type ExistingNameRow = { id: string }
type RemovedFieldWithDataRow = { columnName: string; valueCount: number | bigint }
type TableExistsRow = { exists: boolean }
const DEFAULT_ID_COLUMN_NAME = "ID"

function createTrackSheetId() {
  return `track_sheet_${createRandomId().replace(/-/g, "").slice(0, 20)}`
}

function createTrackFieldId() {
  return `track_field_${createRandomId().replace(/-/g, "").slice(0, 20)}`
}

function createTrackCategoryId() {
  return `track_category_${createRandomId().replace(/-/g, "").slice(0, 18)}`
}

function normalizeCategoryOptions(options: string[]) {
  const seen = new Set<string>()

  return options
    .map((option) => option.trim())
    .filter((option) => {
      if (!option) return false
      const key = option.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

function isDefaultIdField(field: TrackSheetInput["fields"][number]) {
  return field.columnName.trim().toLowerCase() === DEFAULT_ID_COLUMN_NAME.toLowerCase()
}

function createDefaultIdField(): TrackSheetInput["fields"][number] {
  return {
    categoryId: "",
    category: "",
    categoryColor: DEFAULT_TRACK_CATEGORY_COLOR,
    region: "",
    columnName: DEFAULT_ID_COLUMN_NAME,
    type: "number",
    defaultValue: "",
    categoryOptions: [],
    fillRequired: false,
    addRoleValues: [],
    editRoleValues: [],
    deleteRoleValues: [],
    hiddenAt: null,
    sortOrder: 0,
  }
}

function normalizeInput(input: TrackSheetInput): TrackSheetInput {
  const categories = input.categories.map((category, index) => ({
    ...category,
    id: category.id || createTrackCategoryId(),
    name: category.name.trim(),
    color: category.color || DEFAULT_TRACK_CATEGORY_COLOR,
    fillRequired: category.fillRequired ?? false,
    addRoleValues: category.addRoleValues ?? [],
    editRoleValues: category.editRoleValues ?? [],
    deleteRoleValues: category.deleteRoleValues ?? [],
    sortOrder: index,
  }))
  const fallbackCategory = categories[0]
  const displayCategoryId = categories.some((category) => category.id === input.displayCategoryId)
    ? input.displayCategoryId
    : fallbackCategory?.id ?? ""
  const categoryById = new Map(categories.map((category) => [category.id, category]))
  const defaultIdField = input.fields.find(isDefaultIdField) ?? createDefaultIdField()
  const inputFields = [
    defaultIdField,
    ...input.fields.filter((field) => !isDefaultIdField(field)),
  ]

  return {
    ...input,
    name: input.name.trim(),
    displayCategoryId,
    categories,
    fields: inputFields.map((field, index) => {
      const isDefaultId = isDefaultIdField(field)
      const category = isDefaultId
        ? fallbackCategory
        : categoryById.get(field.categoryId) ?? fallbackCategory
      const regionName = category?.name ?? field.region.trim()

      return {
        ...field,
        categoryId: category?.id ?? "",
        category: category?.name ?? field.category.trim(),
        categoryColor: category?.color ?? field.categoryColor ?? DEFAULT_TRACK_CATEGORY_COLOR,
        region: regionName || "Global",
        columnName: isDefaultId ? DEFAULT_ID_COLUMN_NAME : field.columnName.trim(),
        type: isDefaultId ? "number" : field.type,
        defaultValue: isDefaultId ? "" : (field.defaultValue ?? "").trim(),
        categoryOptions: !isDefaultId && field.type === "category" ? normalizeCategoryOptions(field.categoryOptions ?? []) : [],
        fillRequired: isDefaultId ? false : category?.fillRequired ?? field.fillRequired ?? false,
        addRoleValues: isDefaultId ? [] : category?.addRoleValues ?? field.addRoleValues ?? [],
        editRoleValues: isDefaultId ? [] : category?.editRoleValues ?? field.editRoleValues ?? [],
        deleteRoleValues: isDefaultId ? [] : category?.deleteRoleValues ?? field.deleteRoleValues ?? [],
        hiddenAt: isDefaultId ? null : field.hiddenAt ?? null,
        sortOrder: index,
      }
    }),
  }
}

function ensureUniqueCategories(input: TrackSheetInput) {
  const seen = new Set<string>()

  input.categories.forEach((category) => {
    const key = category.name.trim().toLowerCase()
    if (seen.has(key)) {
      throw new AppError(409, `Kategori "${category.name}" sudah ada di sheet ini`)
    }
    seen.add(key)
  })
}

async function ensureTrackSheetExists(id: string, options: { includeHidden?: boolean } = {}) {
  const rows = await prisma.$queryRaw<ExistingNameRow[]>`
    SELECT id
    FROM track_sheets
    WHERE id = ${id}
      AND (${options.includeHidden ? 1 : 0} = 1 OR hidden_at IS NULL)
    LIMIT 1
  `

  if (!rows[0]) throw new AppError(404, "Sheet lacak tidak ditemukan")
}

async function ensureRemovedFieldsAreEmpty(sheetId: string, input: TrackSheetInput) {
  const [table] = await prisma.$queryRaw<TableExistsRow[]>`
    SELECT to_regclass('track_records') IS NOT NULL AS "exists"
  `
  if (!table?.exists) return

  const keptFieldIds = input.fields
    .map((field) => field.id)
    .filter((id): id is string => Boolean(id))
  const rows = keptFieldIds.length > 0
    ? await prisma.$queryRaw<RemovedFieldWithDataRow[]>`
        SELECT
          f.column_name AS "columnName",
          COUNT(r.id) FILTER (
            WHERE NULLIF(BTRIM(r.values ->> f.id), '') IS NOT NULL
          ) AS "valueCount"
        FROM track_fields f
        LEFT JOIN track_records r ON r.sheet_id = f.sheet_id
        WHERE f.sheet_id = ${sheetId}
          AND NOT (f.id = ANY(${keptFieldIds}))
        GROUP BY f.id, f.column_name
        HAVING COUNT(r.id) FILTER (
          WHERE NULLIF(BTRIM(r.values ->> f.id), '') IS NOT NULL
        ) > 0
        LIMIT 1
      `
    : await prisma.$queryRaw<RemovedFieldWithDataRow[]>`
        SELECT
          f.column_name AS "columnName",
          COUNT(r.id) FILTER (
            WHERE NULLIF(BTRIM(r.values ->> f.id), '') IS NOT NULL
          ) AS "valueCount"
        FROM track_fields f
        LEFT JOIN track_records r ON r.sheet_id = f.sheet_id
        WHERE f.sheet_id = ${sheetId}
        GROUP BY f.id, f.column_name
        HAVING COUNT(r.id) FILTER (
          WHERE NULLIF(BTRIM(r.values ->> f.id), '') IS NOT NULL
        ) > 0
        LIMIT 1
      `
  const removedField = rows[0]

  if (removedField) {
    throw new AppError(
      409,
      `Kolom "${removedField.columnName}" sudah memiliki ${Number(removedField.valueCount)} data. Sembunyikan kolom jika data tetap perlu disimpan.`
    )
  }
}

async function saveTrackCategories(db: DbClient, sheetId: string, input: TrackSheetInput) {
  await db.$executeRaw`
    DELETE FROM track_categories
    WHERE sheet_id = ${sheetId}
  `

  for (const [index, category] of input.categories.entries()) {
    await db.$executeRaw`
      INSERT INTO track_categories (
        id,
        sheet_id,
        name,
        color,
        fill_by_hrd,
        add_role_values,
        edit_role_values,
        delete_role_values,
        sort_order
      )
      VALUES (
        ${category.id || createTrackCategoryId()},
        ${sheetId},
        ${category.name},
        ${category.color},
        ${category.fillRequired},
        ${JSON.stringify(category.addRoleValues ?? [])},
        ${JSON.stringify(category.editRoleValues ?? [])},
        ${JSON.stringify(category.deleteRoleValues ?? [])},
        ${index}
      )
    `
  }
}

async function saveTrackFields(db: DbClient, sheetId: string, input: TrackSheetInput) {
  await db.$executeRaw`
    DELETE FROM track_fields
    WHERE sheet_id = ${sheetId}
  `

  for (const [index, field] of input.fields.entries()) {
    await db.$executeRaw`
      INSERT INTO track_fields (
        id,
        sheet_id,
        category_id,
        category,
        category_color,
        region,
        column_name,
        data_type,
        default_value,
        category_options,
        fill_by_hrd,
        add_role_values,
        edit_role_values,
        delete_role_values,
        hidden_at,
        sort_order
      )
      VALUES (
        ${field.id || createTrackFieldId()},
        ${sheetId},
        ${field.categoryId},
        ${field.category},
        ${field.categoryColor},
        ${field.region},
        ${field.columnName},
        ${field.type},
        ${field.defaultValue},
        ${JSON.stringify(field.categoryOptions ?? [])},
        ${field.fillRequired},
        ${JSON.stringify(field.addRoleValues ?? [])},
        ${JSON.stringify(field.editRoleValues ?? [])},
        ${JSON.stringify(field.deleteRoleValues ?? [])},
        ${field.hiddenAt ? new Date(field.hiddenAt) : null},
        ${index}
      )
    `
  }
}

export async function createTrackSheetMutation(input: TrackSheetInput) {
  await ensureTrackTableSchema()
  const normalized = normalizeInput(input)
  ensureUniqueCategories(normalized)

  const sheetId = createTrackSheetId()
  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`
      INSERT INTO track_sheets (
        id,
        name,
        display_category_id,
        sort_order
      )
      VALUES (
        ${sheetId},
        ${normalized.name},
        ${normalized.displayCategoryId || null},
        ${normalized.sortOrder}
      )
    `

    await saveTrackCategories(tx, sheetId, normalized)
    await saveTrackFields(tx, sheetId, normalized)
  })

  return sheetId
}

export async function updateTrackSheetMutation(id: string, input: TrackSheetInput) {
  await ensureTrackTableSchema()
  const normalized = normalizeInput(input)
  await ensureTrackSheetExists(id, { includeHidden: true })
  ensureUniqueCategories(normalized)
  await ensureRemovedFieldsAreEmpty(id, normalized)

  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`
      UPDATE track_sheets
      SET
        name = ${normalized.name},
        display_category_id = ${normalized.displayCategoryId || null},
        sort_order = ${normalized.sortOrder},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    await saveTrackCategories(tx, id, normalized)
    await saveTrackFields(tx, id, normalized)
  })
}

export async function hideTrackSheetMutation(id: string) {
  await ensureTrackTableSchema()
  await ensureTrackSheetExists(id)

  await prisma.$executeRaw`
    UPDATE track_sheets
    SET
      hidden_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
      AND hidden_at IS NULL
  `
}

export async function showTrackSheetMutation(id: string) {
  await ensureTrackTableSchema()
  await ensureTrackSheetExists(id, { includeHidden: true })

  await prisma.$executeRaw`
    UPDATE track_sheets
    SET
      hidden_at = NULL,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
  `
}

export async function hardDeleteTrackSheetMutation(id: string) {
  await ensureTrackTableSchema()
  await ensureTrackSheetExists(id, { includeHidden: true })

  await prisma.$executeRaw`
    DELETE FROM track_sheets
    WHERE id = ${id}
  `
}

export async function updateTrackSheetOrderMutation(input: TrackSheetOrderInput) {
  await ensureTrackTableSchema()

  await prisma.$transaction(async (tx) => {
    for (const item of input.items) {
      await tx.$executeRaw`
        UPDATE track_sheets
        SET
          sort_order = ${item.sortOrder},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${item.id}
      `
    }
  })
}
