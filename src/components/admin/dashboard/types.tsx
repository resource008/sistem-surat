export interface SuratPerDept {
  deptId: string
  deptName: string
  count: number
}

export interface StatsData {
  totalUsers: number
  usersByRole: Record<string, number>
  totalDept: number
  totalSurat: number
  totalPI: number
  suratPerDept: SuratPerDept[]
  daily: {
    hariIni: number
    kemarin: number
    changePercent: number | null
    piChangePercent: number | null // Tambahkan baris ini
  }
  weeklyTrend: Record<string, string | number>[]
  deptKeys: string[]
}

export type Period = "hari_ini" | "minggu_ini" | "bulan_ini" | "tahun_ini"