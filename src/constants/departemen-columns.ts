import type { DepartemenColumnType } from "@/types/departemen"

export const NOMOR_DEFAULT_ID = "default_nomor_register"
export const TANGGAL_DEFAULT_ID = "default_tanggal_terima"
export const ASAL_DEFAULT_ID = "default_asal_surat"
export const TUJUAN_DEFAULT_ID = "default_tujuan"
export const DISPLAY_SLOT_COUNT = 5

export const TYPE_LABEL: Record<DepartemenColumnType, string> = {
  text: "Teks",
  date: "Tanggal",
  number: "Angka",
}
