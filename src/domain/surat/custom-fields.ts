import {
  ASAL_DEFAULT_ID,
  NOMOR_DEFAULT_ID,
  TANGGAL_DEFAULT_ID,
  TUJUAN_DEFAULT_ID,
} from "@/constants/departemen-columns"
import type { DepartemenColumn } from "@/types"

export type SuratBuiltInColumnKey = "perihal" | "noSurat" | "lampiran" | "tanggalSurat"

function normalizeColumnLabel(label: string) {
  return label
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

export function getSuratBuiltInColumnKey(column: DepartemenColumn): SuratBuiltInColumnKey | null {
  const label = normalizeColumnLabel(column.label)

  if (label === "perihal" || label === "perihal surat") return "perihal"
  if (label === "nomor surat" || label === "no surat" || label === "no surat") return "noSurat"
  if (label === "lampiran") return "lampiran"
  if (label === "tanggal surat" || label === "tgl surat") return "tanggalSurat"

  return null
}

export function isSuratBuiltInColumn(column: DepartemenColumn) {
  return getSuratBuiltInColumnKey(column) !== null
}

export function isDetailBuiltInColumn(column: DepartemenColumn) {
  return isSuratBuiltInColumn(column)
}

export function isTujuanColumn(column: Pick<DepartemenColumn, "id">) {
  return String(column.id).includes(TUJUAN_DEFAULT_ID)
}

export function isCetakRowSpanColumn(column: Pick<DepartemenColumn, "id" | "label">) {
  const columnId = String(column.id)
  const label = normalizeColumnLabel(column.label)
  return columnId.includes(NOMOR_DEFAULT_ID)
    || columnId.includes(TANGGAL_DEFAULT_ID)
    || columnId.includes(ASAL_DEFAULT_ID)
    || columnId.includes(TUJUAN_DEFAULT_ID)
    || label === "nomor register"
    || label === "tanggal terima"
    || label === "asal surat"
    || label === "tujuan"
}

function getNumberSuffix(column: DepartemenColumn) {
  if (column.type !== "number") return ""
  return (column.defaultValue ?? "").trim()
}

function stripNumberSuffix(column: DepartemenColumn, value: string) {
  const suffix = getNumberSuffix(column)
  let text = value.trim()

  if (suffix && text.toLowerCase().endsWith(suffix.toLowerCase())) {
    text = text.slice(0, -suffix.length).trim()
  }

  return text
}

export function formatNumberFieldInput(column: DepartemenColumn, value?: string) {
  const text = (value ?? "").trim()
  if (column.type !== "number" || !text) return text

  const suffix = getNumberSuffix(column)
  const numberPart = stripNumberSuffix(column, text).match(/-?\d+(?:[.,]\d*)?/)?.[0] ?? ""

  if (!numberPart) return ""
  return suffix ? `${numberPart} ${suffix}` : numberPart
}

export function validateCustomFieldValue(column: DepartemenColumn, value?: string) {
  const text = (value ?? "").trim()

  if (column.isRequired && !text) {
    return `${column.label} wajib diisi`
  }

  if (!text) return null

  if (column.type === "number") {
    const rawNumberText = stripNumberSuffix(column, text)
    const numberText = rawNumberText.replace(",", ".")
    if (!/^-?\d+(?:[.,]\d+)?$/.test(rawNumberText) || Number.isNaN(Number(numberText))) {
      return `${column.label} harus berupa angka`
    }
  }

  if (column.type === "date" && Number.isNaN(new Date(text).getTime())) {
    return `${column.label} harus berupa tanggal`
  }

  return null
}

export function getCustomFieldInputValue(
  column: DepartemenColumn,
  item: { customFields?: Record<string, string> } & Partial<Record<SuratBuiltInColumnKey, unknown>>
) {
  const customValue = getCustomFieldValue(column, item.customFields)
  if (customValue !== undefined) return customValue

  const builtInKey = getSuratBuiltInColumnKey(column)
  return builtInKey ? String(item[builtInKey] ?? "") : ""
}

export function getCustomFieldValue(column: DepartemenColumn, values?: Record<string, string>) {
  if (!values) return undefined

  const directValue = values[column.id] ?? values[column.label]

  const columnLabel = normalizeColumnLabel(column.label)
  const matchingEntry = Object.entries(values).find(([key]) => {
    const normalizedKey = normalizeColumnLabel(key)
    return normalizedKey === columnLabel || normalizedKey.endsWith(` ${columnLabel}`)
  })

  if (directValue?.trim()) return directValue
  return matchingEntry?.[1] ?? directValue
}

export function formatCustomFieldValue(column: DepartemenColumn, value?: string) {
  const text = (value ?? "").trim()
  if (!text) return "-"

  if (column.type === "date") {
    const date = new Date(text)
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    }
  }

  if (column.type === "number") {
    return formatNumberFieldInput(column, text)
  }

  return text
}

export function getSuratBuiltInFieldValue(column: DepartemenColumn, detail: Record<string, unknown>) {
  const key = getSuratBuiltInColumnKey(column)
  if (!key) return null

  const value = detail[key]
  if (key === "tanggalSurat") {
    return formatCustomFieldValue({ ...column, type: "date" }, value == null ? "" : String(value))
  }

  return value == null ? "-" : String(value).trim() || "-"
}
