import type {
  CreateDepartemenInput,
  UpdateDepartemenInput,
} from "@/app/validation/departemen"
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
  return (input.columns ?? [])
    .map((column, index) => {
      const defaultTemplate = column.isDefault
        ? DEFAULT_DEPARTEMEN_COLUMNS.find((defaultColumn) =>
            column.id?.includes(defaultColumn.id)
            || defaultColumn.label.trim().toLowerCase() === column.label.trim().toLowerCase()
          )
        : null

      if (defaultTemplate) {
        return {
          ...defaultTemplate,
          id: column.id || defaultTemplate.id,
          isRequired: true,
          showInDataSurat: !!column.showInDataSurat,
          showInPrint: column.showInPrint !== false,
          sortOrder: index,
          displayOrder: column.displayOrder ?? index,
        }
      }

      return {
        id: column.id || createDepartmentColumnId(),
        label: column.label.trim(),
        type: normalizeDepartemenColumnType(column.type),
        defaultValue: (column.defaultValue ?? "").trim(),
        isDefault: false,
        isRequired: !!column.isRequired && column.label.trim().length > 0,
        showInDataSurat: !!column.showInDataSurat,
        showInPrint: column.showInPrint !== false,
        sortOrder: index,
        displayOrder: column.displayOrder ?? index,
      }
    })
    .filter((column) => column.label.length > 0)
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
    displayOrder: row.displayOrder ?? row.sortOrder,
  }
}

export function normalizeStoredColumns(departmentId: string, columns: DepartemenColumn[]) {
  const normalized = columns.map((column) => {
    const defaultColumn = getDefaultColumnTemplate(column)
    return defaultColumn
      ? {
          ...defaultColumn,
          id: column.id,
          showInDataSurat: column.showInDataSurat,
          showInPrint: column.showInPrint,
          displayOrder: column.displayOrder ?? column.sortOrder,
        }
      : { ...column, displayOrder: column.displayOrder ?? column.sortOrder }
  })

  return normalized
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((column, index) => ({ ...column, sortOrder: index }))
}
