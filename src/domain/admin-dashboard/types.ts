export type TipeWaktuStatistik = "mingguan" | "bulanan" | "tahunan"

export interface DateRange {
  start: Date
  end: Date
}

export interface StatistikFilter {
  deptId: string
  tipeWaktu: TipeWaktuStatistik
  bulan?: number
  tahun?: number
}

export type AdminStatsParams = StatistikFilter

export interface SuratPerDepartemen {
  departemenId: string
  departemen: string
  jumlah: number
  persen: number
}

export interface StatistikSurat {
  departemenId: string
  departemen: string
  tipeWaktu: TipeWaktuStatistik
  labels: string[]
  data: number[]
  total: number
}

export interface RiwayatAktivitasPengguna {
  id: string
  nama: string
  terakhirMasuk: Date | null
  status: "Sedang aktif" | "Tidak aktif"
}

export interface SuratPerDept {
  deptId: string
  deptName: string
  count: number
}

export interface DashboardStatsResult {
  aktivitas: {
    jumlahAkun: number
    totalDepartemen: number
    totalSuratMasuk: number
    perubahanSuratMasuk: number | null
  }
  suratPerDepartemen: SuratPerDepartemen[]
  statistikSurat: StatistikSurat
  riwayatAktivitasPengguna: RiwayatAktivitasPengguna[]
}
