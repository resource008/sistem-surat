import { Period } from "./types"

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 4 && hour < 11) return "Selamat Pagi"
  if (hour >= 11 && hour < 15) return "Selamat Siang"
  if (hour >= 15 && hour < 18) return "Selamat Sore"
  return "Selamat Malam"
}

export function getPeriodLabel(period: Period): string {
  const labels: Record<Period, string> = {
    hari_ini:   "Hari Ini",
    minggu_ini: "Minggu Ini",
    bulan_ini:  "Bulan Ini",
    tahun_ini:  "Tahun Ini",
  }
  return labels[period]
}