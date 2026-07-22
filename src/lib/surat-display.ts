import {
  ASAL_DEFAULT_ID,
  getColumnAutoFill,
  NOMOR_DEFAULT_ID,
  TANGGAL_DEFAULT_ID,
} from "@/constants/departemen-columns"
import {
  formatCustomFieldValue,
  getCustomFieldExactValue,
  getSuratBuiltInFieldValue,
  isTujuanColumn,
} from "@/domain/surat/custom-fields"
import type { DepartemenColumn, DetailSurat, RegisterSurat } from "@/types"

function slugLabel(label: string) {
  return label.trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function getLegacyDraftColumnKey(column: DepartemenColumn, register: RegisterSurat) {
  const columns = (register.dept.columns ?? [])
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
  const index = columns.findIndex((item) => item.id === column.id)

  if (index < 0) return null
  return `draft_${index}_${slugLabel(column.label) || "kolom"}`
}

export function getStoredCustomFieldValue(
  column: DepartemenColumn,
  register: RegisterSurat,
  detail?: DetailSurat | null
) {
  if (!detail) return undefined

  const exactValue = getCustomFieldExactValue(column, detail.customFields)
  if (exactValue?.trim()) return exactValue

  const legacyKey = getLegacyDraftColumnKey(column, register)
  const legacyValue = legacyKey ? detail.customFields?.[legacyKey] : undefined
  if (legacyValue?.trim()) return legacyValue

  const labelValue = detail.customFields?.[column.label]
  if (labelValue?.trim()) return labelValue

  return undefined
}

function getGroupedCustomFieldValues(
  column: DepartemenColumn,
  register: RegisterSurat,
  detail?: DetailSurat | null
) {
  if (!detail) return []

  const customFields = detail.customFields ?? {}
  const directValue = getStoredCustomFieldValue(column, register, detail)
  const groupedValues = Object.entries(customFields)
    .filter(([key, value]) =>
      key.startsWith(`${column.id}_group_`) && String(value ?? "").trim()
    )
    .sort(([a], [b]) => {
      const aIndex = Number(a.match(/_group_(\d+)$/)?.[1] ?? 0)
      const bIndex = Number(b.match(/_group_(\d+)$/)?.[1] ?? 0)
      return aIndex - bIndex
    })
    .map(([, value]) => String(value))

  return [directValue, ...groupedValues]
    .filter((value): value is string => Boolean(value?.trim()))
}

function formatMultipleColumnValues(column: DepartemenColumn, values: string[]) {
  const uniqueValues = values.filter((value, index, list) => list.indexOf(value) === index)
  return uniqueValues.map((value) => formatCustomFieldValue(column, value)).join("\n")
}

function getGroupKey(column: DepartemenColumn, groupIndex: number) {
  return `${column.id}_group_${groupIndex}`
}

export function getSuratDetailGroupCount(detail?: DetailSurat | null) {
  if (!detail) return 1

  return Object.keys(detail.customFields ?? {}).reduce((count, key) => {
    const match = key.match(/_group_(\d+)$/)
    if (!match) return count

    return Math.max(count, Number(match[1]) + 1)
  }, 1)
}

function getCustomStructureColumns(register?: RegisterSurat | null) {
  return (register?.dept.columns ?? [])
    .filter((column) => !column.isDefault)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

function isSameStructureColumn(a: DepartemenColumn, b: DepartemenColumn) {
  return a.id === b.id
    || (
      a.label.trim().toLowerCase() === b.label.trim().toLowerCase()
      && a.type === b.type
    )
}

export function isSuratGroupedColumn(
  column: DepartemenColumn,
  register?: RegisterSurat | null,
  detail?: DetailSurat | null
) {
  if (detail && Object.keys(detail.customFields ?? {}).some((key) => key.startsWith(`${column.id}_group_`))) {
    return true
  }

  const structureIndex = getCustomStructureColumns(register).findIndex((item) =>
    isSameStructureColumn(item, column)
  )

  return structureIndex >= 0 && structureIndex % 2 === 1
}

export function getSuratColumnGroupValue(
  column: DepartemenColumn,
  register: RegisterSurat,
  detail?: DetailSurat | null,
  groupIndex = 0
) {
  if (groupIndex === 0) {
    if (!column.isDefault && detail) {
      const storedValue = getStoredCustomFieldValue(column, register, detail)
      if (storedValue?.trim()) return formatCustomFieldValue(column, storedValue)

      const builtInValue = getSuratBuiltInFieldValue(column, detail as unknown as Record<string, unknown>)
      if (builtInValue !== null) return builtInValue

      return "-"
    }

    return getSuratColumnValue(column, register, detail)
  }

  const value = detail?.customFields?.[getGroupKey(column, groupIndex)]
  if (value?.trim()) return formatCustomFieldValue(column, value)

  return "-"
}

export function getSuratDisplayColumns(register?: RegisterSurat | null) {
  return (register?.dept.displayColumns ?? [])
    .slice()
    .sort((a, b) => (a.displayOrder ?? a.sortOrder) - (b.displayOrder ?? b.sortOrder))
}

export function getSuratColumnValue(
  column: DepartemenColumn,
  register: RegisterSurat,
  detail?: DetailSurat | null
) {
  const firstDetail = detail ?? register.detailSurat?.[0]

  if (!column.isDefault && firstDetail) {
    const groupedValues = getGroupedCustomFieldValues(column, register, firstDetail)
    if (groupedValues.length > 0) return formatMultipleColumnValues(column, groupedValues)

    const manualColumns = (register.dept.columns ?? [])
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .filter((item) => !item.isDefault && getColumnAutoFill(item.defaultValue) === "none")
    const manualColumnIndex = manualColumns.findIndex((item) => item.id === column.id)
    const fallbackValue = Object.entries(firstDetail.customFields ?? {})
      .filter(([key, value]) => !/_group_\d+$/.test(key) && String(value ?? "").trim())
      .map(([, value]) => String(value))[manualColumnIndex]
    if (fallbackValue?.trim()) return formatCustomFieldValue(column, fallbackValue)

    if (getColumnAutoFill(column.defaultValue) === "none") return "-"
  }

  if (String(column.id).includes(NOMOR_DEFAULT_ID)) return register.nomor || "-"
  if (String(column.id).includes(TANGGAL_DEFAULT_ID)) {
    return formatCustomFieldValue({ ...column, type: "date" }, register.tanggalTerima)
  }
  if (String(column.id).includes(ASAL_DEFAULT_ID)) return register.asalSurat || "-"
  if (isTujuanColumn(column)) return firstDetail?.tujuan || register.tujuan || register.dept.shortName || "-"

  if (firstDetail) {
    const builtInValue = getSuratBuiltInFieldValue(column, firstDetail as unknown as Record<string, unknown>)
    if (builtInValue !== null) return builtInValue

    return formatCustomFieldValue(column, getCustomFieldExactValue(column, firstDetail.customFields))
  }

  return "-"
}

export function getSuratDisplayParts(register?: RegisterSurat | null, limit = 2) {
  if (!register) return []

  return getSuratDisplayColumns(register)
    .map((column) => ({
      label: column.label,
      value: getSuratColumnValue(column, register, register.detailSurat?.[0]),
    }))
    .filter((part) => {
      const value = String(part.value ?? "").trim()
      return value.length > 0 && value !== "-"
    })
    .slice(0, limit)
}

export function getSuratDisplayTitle(register?: RegisterSurat | null) {
  const values = getSuratDisplayParts(register)
    .map((part) => part.value.trim())

  return values.length > 0 ? values.join(" / ") : "Data surat"
}
