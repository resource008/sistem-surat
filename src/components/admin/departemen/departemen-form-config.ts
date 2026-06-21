import type { DepartemenColumnType } from "@/types"

export const TUJUAN_DEFAULT_ID = "default_tujuan"
export const NOMOR_DEFAULT_ID = "default_nomor_register"
export const TANGGAL_DEFAULT_ID = "default_tanggal_terima"
export const DISPLAY_SLOT_COUNT = 4

export const panelClass =
  "overflow-hidden rounded-xl border border-slate-300/70 bg-background dark:border-slate-700/60"

export const innerPanelClass =
  "rounded-xl border border-slate-200/80 bg-background dark:border-slate-800/70"

export const fieldClass =
  "h-10 rounded-xl border border-transparent bg-muted px-5 text-[14px] font-medium text-foreground shadow-none placeholder:text-muted-foreground focus-visible:border-ring/40 focus-visible:ring-0 disabled:opacity-100"

export const TYPE_LABEL: Record<DepartemenColumnType, string> = {
  text: "Teks",
  date: "Tanggal",
  number: "Angka",
}
