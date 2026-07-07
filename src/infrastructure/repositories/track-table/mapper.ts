import type { TrackCategory, TrackField, TrackFieldType, TrackSheet } from "@/types"
import type { TrackCategoryRow, TrackFieldRow, TrackSheetRow } from "./types"

const FIELD_TYPES = new Set<TrackFieldType>(["text", "date", "number", "category"])
const DEFAULT_ID_COLUMN_NAME = "ID"

export function normalizeTrackFieldType(value: string): TrackFieldType {
  return FIELD_TYPES.has(value as TrackFieldType) ? value as TrackFieldType : "text"
}

function parseCategoryOptions(value: string) {
  try {
    const options = JSON.parse(value)
    if (!Array.isArray(options)) return []
    return options
      .filter((option): option is string => typeof option === "string")
      .map((option) => option.trim())
      .filter(Boolean)
  } catch {
    return []
  }
}

function mapTrackCategory(row: TrackCategoryRow): TrackCategory {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    fillByHrd: row.fillByHrd,
    sortOrder: row.sortOrder,
  }
}

export function mapTrackField(row: TrackFieldRow): TrackField {
  const isDefaultId = row.columnName.trim().toLowerCase() === DEFAULT_ID_COLUMN_NAME.toLowerCase()

  return {
    id: row.id,
    categoryId: row.categoryId ?? "",
    category: row.category,
    categoryColor: row.categoryColor,
    region: row.region,
    columnName: row.columnName,
    type: isDefaultId ? "number" : normalizeTrackFieldType(row.type),
    defaultValue: isDefaultId ? "" : row.defaultValue,
    categoryOptions: isDefaultId ? [] : parseCategoryOptions(row.categoryOptions),
    fillByHrd: isDefaultId ? false : row.fillByHrd,
    hiddenAt: isDefaultId ? null : row.hiddenAt,
    sortOrder: row.sortOrder,
  }
}

function deriveCategoriesFromFields(fields: TrackField[]) {
  const seen = new Set<string>()
  const categories: TrackCategory[] = []

  fields.forEach((field) => {
    const name = field.category.trim()
    if (!name) return

    const key = name.toLowerCase()
    if (seen.has(key)) return

    seen.add(key)
    categories.push({
      id: field.categoryId || `derived_${key.replace(/[^a-z0-9]+/g, "_")}`,
      name,
      color: field.categoryColor || "#2563eb",
      fillByHrd: field.fillByHrd,
      sortOrder: categories.length,
    })
  })

  return categories
}

export function attachTrackData(
  sheets: TrackSheetRow[],
  categories: TrackCategoryRow[],
  fields: TrackFieldRow[]
): TrackSheet[] {
  const groupedCategories = new Map<string, TrackCategory[]>()
  const groupedFields = new Map<string, TrackField[]>()

  categories.forEach((category) => {
    const current = groupedCategories.get(category.sheetId) ?? []
    current.push(mapTrackCategory(category))
    groupedCategories.set(category.sheetId, current)
  })

  fields.forEach((field) => {
    const current = groupedFields.get(field.sheetId) ?? []
    current.push(mapTrackField(field))
    groupedFields.set(field.sheetId, current)
  })

  return sheets.map((sheet) => {
    const sheetFields = groupedFields.get(sheet.id) ?? []

    return {
      id: sheet.id,
      name: sheet.name,
      description: sheet.description,
      sortOrder: sheet.sortOrder,
      hiddenAt: sheet.hiddenAt,
      categories: groupedCategories.get(sheet.id) ?? deriveCategoriesFromFields(sheetFields),
      fields: sheetFields,
    }
  })
}
