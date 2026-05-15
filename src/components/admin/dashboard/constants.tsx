import { Period } from "./types"

export const DEPT_COLORS = [
  "#185FA5", "#3B6D11", "#A32D2D", "#854F0B", "#534AB7",
  "#0F6E56", "#993556", "#5F5E5A", "#ea580c", "#4f46e5",
]

export const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "hari_ini",   label: "Hari Ini" },
  { value: "minggu_ini", label: "Minggu Ini" },
  { value: "bulan_ini",  label: "Bulan Ini" },
  { value: "tahun_ini",  label: "Tahun Ini" },
]