import type { CetakGroup, DetailSurat, RegisterSurat } from "@/types/surat-types"
import type { DepartemenColumn } from "@/types/departemen"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { formatCustomFieldValue, getCustomFieldValue, getSuratBuiltInFieldValue } from "@/domain/surat/custom-fields"

const DEFAULT_ORDER = [
  "default_nomor_register",
  "default_tanggal_terima",
  "default_asal_surat",
  "default_tujuan",
]

function getDefaultColumnKey(column: DepartemenColumn) {
  return DEFAULT_ORDER.find((key) => column.id.includes(key)) ?? null
}

function normalizeColumns(columns?: DepartemenColumn[]) {
  return (columns ?? [])
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

function normalizePrintColumns(columns?: DepartemenColumn[]) {
  return normalizeColumns(columns).filter((column) => column.showInPrint !== false)
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
  const columns = normalizeColumns(reg.dept?.columns)

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
  return normalizePrintColumns(reg?.dept?.columns)
}

export function compareRegisterNomor(a: RegisterSurat, b: RegisterSurat) {
  return a.nomor.localeCompare(b.nomor, undefined, { numeric: true, sensitivity: "base" })
    || a.id - b.id
}

export function getColumnStructureSignature(columns?: DepartemenColumn[]) {
  return normalizeColumns(columns).map(columnSignaturePart).join("|")
}

export function getCetakColumnValue(
  groupColumn: DepartemenColumn,
  reg: RegisterSurat,
  detail: DetailSurat
) {
  const column = resolveColumnForRegister(groupColumn, reg)
  const defaultKey = getDefaultColumnKey(column)

  if (defaultKey === "default_nomor_register") return reg.nomor
  if (defaultKey === "default_tanggal_terima") {
    return formatCustomFieldValue({ ...column, type: "date" }, reg.tanggalTerima)
  }
  if (defaultKey === "default_asal_surat") return reg.asalSurat || "-"
  if (defaultKey === "default_tujuan") return detail.tujuan || reg.tujuan || reg.dept?.shortName || "-"

  const builtInValue = getSuratBuiltInFieldValue(column, detail as unknown as Record<string, unknown>)
  if (builtInValue !== null) return builtInValue

  return formatCustomFieldValue(column, getCustomFieldValue(column, detail.customFields))
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
