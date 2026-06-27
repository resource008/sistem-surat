import type { DepartemenColumn } from "@/types"
import {
  NOMOR_DEFAULT_ID,
  TANGGAL_DEFAULT_ID,
  TUJUAN_DEFAULT_ID,
  TYPE_LABEL,
} from "./departemen-form-config"

export function createColumn(sortOrder: number): DepartemenColumn {
  return {
    id: `draft_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    label: "",
    type: "text",
    defaultValue: "",
    isDefault: false,
    isRequired: false,
    showInDataSurat: false,
    showInPrint: true,
    sortOrder,
  }
}

export function orderColumnsWithTujuanLast(columns: DepartemenColumn[]) {
  const defaultBeforeTujuan = columns.filter((column) =>
    column.isDefault && !column.id.includes(TUJUAN_DEFAULT_ID)
  )
  const custom = columns.filter((column) => !column.isDefault)
  const tujuanColumn = columns.find((column) =>
    column.isDefault && column.id.includes(TUJUAN_DEFAULT_ID)
  )

  return [
    ...defaultBeforeTujuan.map((column, index) => ({ ...column, sortOrder: index })),
    ...custom.map((column, index) => ({ ...column, sortOrder: defaultBeforeTujuan.length + index })),
    ...(tujuanColumn ? [{ ...tujuanColumn, sortOrder: defaultBeforeTujuan.length + custom.length }] : []),
  ]
}

export function getColumnLabel(column?: DepartemenColumn | null) {
  if (!column) return ""
  if (column.id.includes(NOMOR_DEFAULT_ID)) return "Nomor Registrasi"
  return column.label
}

export function getTypeLabel(column: DepartemenColumn) {
  if (column.id.includes(NOMOR_DEFAULT_ID)) return "Angka (otomatis)"
  if (column.id.includes(TANGGAL_DEFAULT_ID)) return "Tanggal (otomatis)"
  if (column.isDefault) return "Teks (otomatis)"
  return TYPE_LABEL[column.type]
}

export function getDefaultValueLabel(column: DepartemenColumn) {
  if (column.isDefault) return column.defaultValue || "N/A"
  return column.defaultValue
}
