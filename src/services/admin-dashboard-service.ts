import { getAdminDashboardStats } from "@/domain/admin-dashboard/use-cases"
import {
  StatistikFilter,
  TipeWaktuStatistik,
} from "@/domain/admin-dashboard/types"
import { PrismaAdminDashboardRepository } from "@/infrastructure/repositories/admin-dashboard-repositories"
import { AppError } from "@/lib/errors"

const repository = new PrismaAdminDashboardRepository()

function normalizeTipeWaktu(value: string | null): TipeWaktuStatistik {
  if (value === "bulanan") return "bulanan"
  if (value === "tahunan") return "tahunan"

  return "mingguan"
}

function toNumber(value: string | null) {
  if (!value) return undefined

  const numberValue = Number(value)
  return Number.isNaN(numberValue) ? undefined : numberValue
}

function buildStatistikFilter(searchParams: URLSearchParams): StatistikFilter {
  const deptId = searchParams.get("deptId")

  if (!deptId) {
    throw new AppError(400, "deptId wajib diisi")
  }

  return {
    deptId,
    tipeWaktu: normalizeTipeWaktu(searchParams.get("tipeWaktu")),
    bulan: toNumber(searchParams.get("bulan")),
    tahun: toNumber(searchParams.get("tahun")),
  }
}

export function fetchAdminDashboardStats(searchParams: URLSearchParams) {
  const filter = buildStatistikFilter(searchParams)

  return getAdminDashboardStats(repository, filter)
}