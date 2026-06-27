import type { DepartemenColumnType } from "@/types"

export const TUJUAN_DEFAULT_ID = "default_tujuan"
export const NOMOR_DEFAULT_ID = "default_nomor_register"
export const TANGGAL_DEFAULT_ID = "default_tanggal_terima"
export const DISPLAY_SLOT_COUNT = 5

export const panelClass =
  "overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm"

export const innerPanelClass =
  "rounded-lg border bg-muted/25"

export const fieldClass =
  "h-10 rounded-lg bg-background text-sm shadow-none"

export const readonlyFieldClass =
  "h-10 rounded-lg border bg-muted/40 px-3.5 text-sm font-medium text-muted-foreground shadow-none"

export const TYPE_LABEL: Record<DepartemenColumnType, string> = {
  text: "Teks",
  date: "Tanggal",
  number: "Angka",
}
