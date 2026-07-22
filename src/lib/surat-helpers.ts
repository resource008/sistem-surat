import type { CetakGroup, DetailSurat, RegisterSurat } from "@/types/surat"
import type { DepartemenColumn } from "@/types/departemen"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
  ASAL_DEFAULT_ID,
  NOMOR_DEFAULT_ID,
  TANGGAL_DEFAULT_ID,
  TUJUAN_DEFAULT_ID,
} from "@/constants/departemen-columns"
import { getSuratColumnValue } from "@/lib/surat-display"

const DEFAULT_ORDER = [
  NOMOR_DEFAULT_ID,
  TANGGAL_DEFAULT_ID,
  ASAL_DEFAULT_ID,
  TUJUAN_DEFAULT_ID,
]

function getDefaultColumnKey(column: DepartemenColumn) {
  return DEFAULT_ORDER.find((key) => column.id.includes(key)) ?? null
}

function normalizeColumns(columns?: DepartemenColumn[]) {
  return (columns ?? [])
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

function normalizeDisplayColumns(columns?: DepartemenColumn[]) {
  return (columns ?? [])
    .slice()
    .sort((a, b) => (a.displayOrder ?? a.sortOrder) - (b.displayOrder ?? b.sortOrder))
}

function orderColumnsBySplitSide(columns: DepartemenColumn[]) {
  const defaultColumns = columns.filter((column) => column.isDefault)
  const customColumns = columns.filter((column) => !column.isDefault)
  const leftColumns = customColumns.filter((_, index) => index % 2 === 0)
  const rightColumns = customColumns.filter((_, index) => index % 2 === 1)

  return [...defaultColumns, ...leftColumns, ...rightColumns]
}

function orderColumnSubsetBySplitSide(
  allColumns: DepartemenColumn[] = [],
  subsetColumns: DepartemenColumn[] = []
) {
  if (allColumns.length === 0) return orderColumnsBySplitSide(normalizeDisplayColumns(subsetColumns))

  const subsetIds = new Set(subsetColumns.map((column) => column.id))
  const orderedColumns = orderColumnsBySplitSide(normalizeColumns(allColumns))

  return orderedColumns.filter((column) => subsetIds.has(column.id))
}

function getPrintGroupLabel(reg: RegisterSurat) {
  const label = reg.dept?.printSheetName?.trim()
  return label || reg.dept?.shortName || ""
}

function columnSignaturePart(column: DepartemenColumn) {
  const defaultKey = getDefaultColumnKey(column)
  if (defaultKey) return `default:${defaultKey}`

  return [
    "custom",
    column.label.trim().toLowerCase(),
    column.type,
    column.isRequired ? "required" : "optional",
  ].join(":")
}

function resolveColumnForRegister(groupColumn: DepartemenColumn, reg: RegisterSurat) {
  const defaultKey = getDefaultColumnKey(groupColumn)
  const displayColumns = normalizeDisplayColumns(reg.dept?.displayColumns)
  const columns = displayColumns.length > 0 ? displayColumns : normalizeColumns(reg.dept?.columns)
  const exactColumn = columns.find((column) => column.id === groupColumn.id)

  if (exactColumn) return exactColumn

  if (defaultKey) {
    return columns.find((column) => column.id.includes(defaultKey)) ?? groupColumn
  }

  return columns.find((column) =>
    !column.isDefault &&
    column.label.trim().toLowerCase() === groupColumn.label.trim().toLowerCase() &&
    column.type === groupColumn.type
  ) ?? groupColumn
}

export function getCetakColumns(reg?: RegisterSurat): DepartemenColumn[] {
  const allColumns = reg?.dept?.columns ?? []
  if (reg?.dept?.displayColumns) return orderColumnSubsetBySplitSide(allColumns, reg.dept.displayColumns)
  return orderColumnSubsetBySplitSide(allColumns, allColumns.filter((column) => column.showInDataSurat))
}

export function getCetakPrintColumns(reg?: RegisterSurat): DepartemenColumn[] {
  const columns = reg?.dept?.columns ?? []
  return orderColumnSubsetBySplitSide(columns, columns.filter((column) => !column.isDefault && column.showInPrint))
}

export function compareRegisterNomor(a: RegisterSurat, b: RegisterSurat) {
  return a.nomor.localeCompare(b.nomor, undefined, { numeric: true, sensitivity: "base" })
    || a.id - b.id
}

export function getColumnStructureSignature(columns?: DepartemenColumn[]) {
  return normalizeDisplayColumns(columns).map(columnSignaturePart).join("|")
}

export function getCetakColumnValue(
  groupColumn: DepartemenColumn,
  reg: RegisterSurat,
  detail: DetailSurat
) {
  const column = resolveColumnForRegister(groupColumn, reg)
  return getSuratColumnValue(column, reg, detail)
}

export function groupCetakData(data: RegisterSurat[]): CetakGroup[] {
  const map = new Map<string, CetakGroup>()

  for (const reg of data) {
    const columns = getCetakColumns(reg)
    const label = getPrintGroupLabel(reg)
    const dateKey = format(new Date(reg.tanggalTerima), "yyyy-MM-dd")
    const departmentKey = reg.deptId || reg.dept?.id || reg.dept.shortName
    const key = [
      label.toLowerCase(),
      getColumnStructureSignature(columns) || "default",
      dateKey,
      departmentKey,
    ].join("|")

    if (!map.has(key)) {
      map.set(key, {
        key,
        label,
        date: reg.tanggalTerima,
        dept: reg.dept.shortName,
        columns,
        registers: [],
      })
    }
    const group = map.get(key)!
    group.registers.push(reg)
  }

  const groups = Array.from(map.values())
  groups.forEach((group) => group.registers.sort(compareRegisterNomor))

  return groups.sort((a, b) => {
    const diff = new Date(a.date).getTime() - new Date(b.date).getTime()
    return diff !== 0 ? diff : a.dept.localeCompare(b.dept)
  })
}

export function calcTotalSurat(data: RegisterSurat[]): number {
  return data.reduce((sum, r) => {
    return sum + (r.detailSurat ?? []).length
  }, 0)
}

// --- Helper Format Tanggal ---
export function formatTanggalCetak(dateStr?: string | Date | null): string {
  if (!dateStr) return "-"
  try {
    return format(new Date(dateStr), "dd MMMM yyyy", { locale: id }).toUpperCase()
  } catch {
    return "-"
  }
}

export function formatTanggalShort(dateStr?: string | Date | null): string {
  if (!dateStr) return "-"
  try {
    return format(new Date(dateStr), "dd MMM yyyy", { locale: id })
  } catch {
    return "-"
  }
}

// --- Helper Resolusi Label Detail ---
export function getDetailLabel(detail: any, field: "perihal" | "lampiran" | "noSurat") {
  if (field === "perihal")  return detail.perihal  ?? "-"
  if (field === "lampiran") return detail.lampiran ?? "-"
  if (field === "noSurat")  return detail.noSurat  ?? "-"
  return "-"
}

export function getSuratTujuan(reg: RegisterSurat, detail?: { tujuan?: string | null }): string {
  return reg.dept?.shortName ?? detail?.tujuan ?? reg.tujuan ?? "-"
}
