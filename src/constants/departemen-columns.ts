import type { DepartemenColumnType } from "@/types/departemen"

export const NOMOR_DEFAULT_ID = "default_nomor_register"
export const TANGGAL_DEFAULT_ID = "default_tanggal_terima"
export const ASAL_DEFAULT_ID = "default_asal_surat"
export const TUJUAN_DEFAULT_ID = "default_tujuan"
export const DISPLAY_SLOT_COUNT = 5

export const COLUMN_AUTO_FILL_TOKENS = {
  sequence: "__AUTO_SEQUENCE__",
  currentDate: "__AUTO_CURRENT_DATE__",
  department: "__AUTO_DEPARTMENT__",
} as const

export type ColumnAutoFill = "none" | keyof typeof COLUMN_AUTO_FILL_TOKENS

export const COLUMN_AUTO_FILL_LABEL: Record<ColumnAutoFill, string> = {
  none: "Manual",
  sequence: "Nomor sequential",
  currentDate: "Tanggal hari ini",
  department: "Departemen tujuan",
}

export function getColumnAutoFill(defaultValue?: string): ColumnAutoFill {
  const value = (defaultValue ?? "").trim()
  const matched = Object.entries(COLUMN_AUTO_FILL_TOKENS)
    .find(([, token]) => token === value)?.[0]

  return (matched as ColumnAutoFill | undefined) ?? "none"
}

export const TYPE_LABEL: Record<DepartemenColumnType, string> = {
  text: "Teks",
  date: "Tanggal",
  number: "Angka",
}
