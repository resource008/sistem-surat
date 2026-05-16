// src/domain/stats/types.ts

export type Period = "hari_ini" | "minggu_ini" | "bulan_ini" | "tahun_ini"

export const VALID_PERIODS = new Set<Period>([
  "hari_ini",
  "minggu_ini",
  "bulan_ini",
  "tahun_ini",
])

export interface DateRange {
  start: Date
  end:   Date
}

export interface TrendBucket extends DateRange {
  label: string
}

export interface RawSuratTrend {
  tanggalTerima: Date
  deptId:        string
}

export interface DepartmentInfo {
  id:        string
  shortName: string
}

export interface StatsQueryResult {
  totalUsers:   number
  usersByRole:  { role: string; count: number }[]
  totalDept:    number
  totalSurat:   number
  totalPI:      number
  suratPerDept: { deptId: string; count: number }[]
  suratHariIni: number
  suratKemarin: number
  piHariIni:    number
  piKemarin:    number
  suratTrend:   RawSuratTrend[]
  departments:  DepartmentInfo[]
}

export interface DailyChange {
  hariIni:            number
  kemarin:            number
  changePercent:      number | null
  suratChangePercent: number | null
  piChangePercent:    number | null
}

export interface SuratPerDept {
  deptId:   string
  deptName: string
  count:    number
}

export interface AdminStatsResult {
  totalUsers:   number
  usersByRole:  Record<string, number>
  totalDept:    number
  totalSurat:   number
  totalPI:      number
  suratPerDept: SuratPerDept[]
  daily:        DailyChange
  weeklyTrend:  Record<string, string | number>[]
  deptKeys:     string[]
}