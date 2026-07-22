import type { DepartemenColumn } from "@/types"
import { TYPE_LABEL } from "@/constants/departemen-columns"

export function createColumn(sortOrder: number, draftIndex = sortOrder): DepartemenColumn {
  const draftLabel = `Kolom ${draftIndex + 1}`

  return {
    id: `draft_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    draftLabel,
    label: "",
    type: "text",
    defaultValue: "",
    isDefault: false,
    isRequired: false,
    showInDataSurat: false,
    showInPrint: true,
    sortOrder,
    displayOrder: sortOrder,
  }
}

function getDraftLabelIndex(column: DepartemenColumn) {
  const match = column.draftLabel?.trim().match(/^Kolom\s+(\d+)$/i)
  if (!match) return null

  const number = Number(match[1])
  return Number.isInteger(number) && number > 0 ? number - 1 : null
}

export function getNextDraftColumnIndex(columns: DepartemenColumn[]) {
  const indexes = columns
    .filter((column) => !column.isDefault)
    .map(getDraftLabelIndex)
    .filter((index): index is number => index !== null)

  return indexes.length > 0
    ? Math.max(...indexes) + 1
    : columns.filter((column) => !column.isDefault).length
}

export function ensureDraftColumnLabels(columns: DepartemenColumn[]) {
  const usedIndexes = new Set(
    columns
      .filter((column) => !column.isDefault)
      .map(getDraftLabelIndex)
      .filter((index): index is number => index !== null)
  )
  let nextIndex = 0

  return columns.map((column) => {
    if (column.isDefault || column.label.trim() || column.draftLabel) return column

    while (usedIndexes.has(nextIndex)) nextIndex += 1
    usedIndexes.add(nextIndex)

    return {
      ...column,
      draftLabel: `Kolom ${nextIndex + 1}`,
    }
  })
}

export function orderColumnsWithTujuanLast(columns: DepartemenColumn[]) {
  return columns
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((column, index) => ({ ...column, sortOrder: index }))
}

export function renumberColumns(columns: DepartemenColumn[]) {
  return columns.map((column, index) => ({ ...column, sortOrder: index }))
}

export function getColumnLabel(column?: DepartemenColumn | null) {
  if (!column) return ""
  return column.label
}

export function isDisplayColumnHelperLabel(column?: DepartemenColumn | null) {
  const label = getColumnLabel(column).trim().toLowerCase()
  return label === "tampilkan kolom data surat" || label === "tampilan kolom data surat"
}

export function getColumnTitle(column: DepartemenColumn, fallbackIndex: number) {
  return getColumnLabel(column) || column.draftLabel || `Kolom ${fallbackIndex + 1}`
}

export function getTypeLabel(column: DepartemenColumn) {
  return TYPE_LABEL[column.type]
}

export function getDefaultValueLabel(column: DepartemenColumn) {
  return column.defaultValue
}
