import { AdminDashboardRepository } from "./repositories"
import {
  DashboardStatsResult,
  StatistikFilter,
  TipeWaktuStatistik,
} from "./types"

const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
const ACTIVE_USER_WINDOW_MS = 45 * 1_000

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
]

function getPercent(value: number, total: number) {
  if (total === 0) return 0
  return Number(((value / total) * 100).toFixed(1))
}

function getChangePercent(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : null
  return Number((((current - previous) / previous) * 100).toFixed(1))
}

function getPreviousRange(range: { start: Date; end: Date }) {
  const duration = range.end.getTime() - range.start.getTime()
  return {
    start: new Date(range.start.getTime() - duration),
    end:   new Date(range.start.getTime() - 1),
  }
}

function getStatisticRange(filter: StatistikFilter) {
  const now   = new Date()
  const tahun = filter.tahun ?? now.getFullYear()
  const bulan = filter.bulan ?? now.getMonth() + 1

  if (filter.tipeWaktu === "mingguan") {
    const currentDay   = now.getDay()
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay

    const start = new Date(now)
    start.setDate(now.getDate() + diffToMonday)
    start.setHours(0, 0, 0, 0)

    const end = new Date(start)
    end.setDate(start.getDate() + 5)
    end.setHours(23, 59, 59, 999)

    return { start, end }
  }

  if (filter.tipeWaktu === "bulanan") {
    const start = new Date(tahun, bulan - 1, 1)
    const end   = new Date(tahun, bulan, 0)
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
    return { start, end }
  }

  const start = new Date(tahun, 0, 1)
  const end   = new Date(tahun, 11, 31)
  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

function buildStatisticLabels(filter: StatistikFilter) {
  const now   = new Date()
  const tahun = filter.tahun ?? now.getFullYear()
  const bulan = filter.bulan ?? now.getMonth() + 1

  if (filter.tipeWaktu === "mingguan") return DAY_LABELS

  if (filter.tipeWaktu === "bulanan") {
    const lastDate  = new Date(tahun, bulan, 0).getDate()
    const totalWeeks = Math.ceil(lastDate / 7)
    return Array.from({ length: totalWeeks }, (_, i) => `Minggu ${i + 1}`)
  }

  return MONTH_LABELS
}

function getStatisticIndex(date: Date, tipeWaktu: TipeWaktuStatistik) {
  if (tipeWaktu === "mingguan") {
    const day = date.getDay()
    if (day === 0) return -1
    return day - 1
  }

  if (tipeWaktu === "bulanan") {
    return Math.floor((date.getDate() - 1) / 7)
  }

  return date.getMonth()
}

export async function getAdminDashboardStats(
  repository: AdminDashboardRepository,
  filter: StatistikFilter
): Promise<DashboardStatsResult> {
  const statisticRange         = getStatisticRange(filter)
  const previousStatisticRange = getPreviousRange(statisticRange)
  const labels                 = buildStatisticLabels(filter)

  const [
    jumlahAkun,
    totalDepartemen,
    totalSuratMasuk,
    departments,
    suratPerDeptRaw,
    currentSuratMasuk,
    previousSuratMasuk,
    users,
    requestedDepartment,
  ] = await Promise.all([
    repository.countUsers(),
    repository.countActiveDepartments(),
    repository.countSurat(),
    repository.findDepartments(),
    repository.countSuratByDepartment(),
    repository.countSurat(statisticRange),
    repository.countSurat(previousStatisticRange),
    repository.findUserActivities(),
    repository.findDepartmentById(filter.deptId),
  ])

  const selectedDepartment = requestedDepartment ?? departments[0]

  if (!selectedDepartment) {
    throw new Error("NOT_FOUND: Tidak ada departemen aktif")
  }

  const statistikRaw = await repository.findSuratStatistics(
    statisticRange,
    selectedDepartment.id
  )

  const countByDept = new Map(
    suratPerDeptRaw.map((item) => [item.deptId, item.count])
  )

  const suratPerDepartemen = departments.map((dept) => {
    const jumlah = countByDept.get(dept.id) ?? 0
    return {
      departemenId: dept.id,
      departemen:   dept.shortName,
      jumlah,
      persen: getPercent(jumlah, totalSuratMasuk),
    }
  })

  const statistikData = labels.map(() => 0)

  for (const item of statistikRaw) {
    const index = getStatisticIndex(item.tanggalTerima, filter.tipeWaktu)
    if (index >= 0 && index < statistikData.length) {
      statistikData[index] += 1
    }
  }

  const riwayatAktivitasPengguna = users.map((user) => {
    const lastSession   = user.sessions[0]
    const terakhirAktif = lastSession?.updatedAt ?? user.lastLoginAt
    const isRecentlySeen = lastSession
      ? Date.now() - lastSession.updatedAt.getTime() <= ACTIVE_USER_WINDOW_MS
      : false
    const isActive = Boolean(lastSession) && isRecentlySeen

    return {
      id:           user.id,
      nama:         user.name,
      terakhirMasuk: terakhirAktif,
      status:       isActive ? "Sedang aktif" : "Tidak aktif",
    } as const
  })

  return {
    aktivitas: {
      jumlahAkun,
      totalDepartemen,
      totalSuratMasuk,
      perubahanSuratMasuk: getChangePercent(currentSuratMasuk, previousSuratMasuk),
    },
    suratPerDepartemen,
    statistikSurat: {
      departemenId: selectedDepartment?.id ?? "",
      departemen:   selectedDepartment?.shortName ?? "Belum ada departemen",
      tipeWaktu:    filter.tipeWaktu,
      labels,
      data:  statistikData,
      total: statistikData.reduce((sum, value) => sum + value, 0),
    },
    riwayatAktivitasPengguna,
  }
}
