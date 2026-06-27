import type {
  CreateDepartemenInput,
  UpdateDepartemenInput,
} from "@/app/validation/departemen"
import { TUJUAN_DEFAULT_ID } from "@/constants/departemen-columns"
import { createRandomId } from "@/lib/random-id"
import { DEFAULT_DEPARTEMEN_COLUMNS } from "@/types"
import type { DepartemenColumn, DepartemenColumnType } from "@/types"
import type { DepartmentColumnRow } from "./types"

const DATA_TYPES = new Set<DepartemenColumnType>(["text", "date", "number"])

export function createDepartmentColumnId() {
  return `dept_col_${createRandomId().replace(/-/g, "").slice(0, 24)}`
}

export function normalizeDepartemenColumnType(type?: string): DepartemenColumnType {
  return DATA_TYPES.has(type as DepartemenColumnType)
    ? type as DepartemenColumnType
    : "text"
}

export function normalizeInputColumns(
  input: CreateDepartemenInput | UpdateDepartemenInput
): DepartemenColumn[] {
  const custom = (input.columns ?? [])
    .filter((column) => !column.isDefault)
    .map((column, index) => ({
      id: column.id || createDepartmentColumnId(),
      label: column.label.trim(),
      type: normalizeDepartemenColumnType(column.type),
      defaultValue: (column.defaultValue ?? "").trim(),
      isDefault: false,
      isRequired: !!column.isRequired && column.label.trim().length > 0,
      showInDataSurat: !!column.showInDataSurat,
      showInPrint: column.showInPrint !== false,
      sortOrder: index + DEFAULT_DEPARTEMEN_COLUMNS.length,
    }))
    .filter((column) => column.label.length > 0)

  const defaultBeforeTujuan = DEFAULT_DEPARTEMEN_COLUMNS.filter((column) => column.id !== TUJUAN_DEFAULT_ID)
  const tujuanColumn = DEFAULT_DEPARTEMEN_COLUMNS.find((column) => column.id === TUJUAN_DEFAULT_ID)

  return [
    ...defaultBeforeTujuan.map((column, index) => ({ ...column, sortOrder: index })),
    ...custom.map((column, index) => ({ ...column, sortOrder: defaultBeforeTujuan.length + index })),
    ...(tujuanColumn ? [{ ...tujuanColumn, sortOrder: defaultBeforeTujuan.length + custom.length }] : []),
  ]
}

export function normalizePrintColumns(columns: DepartemenColumn[]) {
  return columns
    .filter((column) => column.showInPrint !== false)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getDefaultColumnTemplate(column: DepartemenColumn) {
  if (!column.isDefault) return null
  return DEFAULT_DEPARTEMEN_COLUMNS.find((defaultColumn) => column.id.includes(defaultColumn.id)) ?? null
}

function getColumnSignaturePart(column: DepartemenColumn) {
  const defaultColumn = getDefaultColumnTemplate(column)
  if (defaultColumn) return `default:${defaultColumn.id}`

  return [
    "custom",
    column.label.trim().toLowerCase(),
    column.type,
    column.isRequired ? "required" : "optional",
  ].join(":")
}

export function getPrintStructureSignature(columns: DepartemenColumn[]) {
  return normalizePrintColumns(columns).map((column) => getColumnSignaturePart(column)).join("|")
}

export function mapDepartmentColumn(row: DepartmentColumnRow): DepartemenColumn {
  return {
    id: row.id,
    label: row.label,
    type: row.type,
    defaultValue: row.defaultValue,
    isDefault: row.isDefault,
    isRequired: row.isRequired,
    showInDataSurat: row.showInDataSurat,
    showInPrint: row.showInPrint,
    sortOrder: row.sortOrder,
  }
}

export function normalizeStoredColumns(departmentId: string, columns: DepartemenColumn[]) {
  const normalized = columns.map((column) => {
    const defaultColumn = getDefaultColumnTemplate(column)
    return defaultColumn
      ? {
          ...defaultColumn,
          id: column.id,
        }
      : { ...column }
  })

  DEFAULT_DEPARTEMEN_COLUMNS.forEach((defaultColumn) => {
    const hasDefaultColumn = normalized.some((column) =>
      column.isDefault && column.id.includes(defaultColumn.id)
    )

    if (!hasDefaultColumn) {
      normalized.push({
        ...defaultColumn,
        id: `${departmentId}_${defaultColumn.id}`,
      })
    }
  })

  const defaults = DEFAULT_DEPARTEMEN_COLUMNS
    .map((defaultColumn) =>
      normalized.find((column) => column.isDefault && column.id.includes(defaultColumn.id))
    )
    .filter((column): column is DepartemenColumn => !!column)
  const defaultBeforeTujuan = defaults.filter((column) => !column.id.includes(TUJUAN_DEFAULT_ID))
  const tujuanColumn = defaults.find((column) => column.id.includes(TUJUAN_DEFAULT_ID))

  const custom = normalized
    .filter((column) => !column.isDefault)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((column, index) => {
      return {
        ...column,
        sortOrder: defaultBeforeTujuan.length + index,
      }
    })

  return [
    ...defaultBeforeTujuan.map((column, index) => ({ ...column, sortOrder: index })),
    ...custom,
    ...(tujuanColumn ? [{ ...tujuanColumn, sortOrder: defaultBeforeTujuan.length + custom.length }] : []),
  ]
}
