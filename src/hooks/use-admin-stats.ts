import useSWR from "swr"
import type {
  AdminStatsParams,
  DashboardStatsResult,
} from "@/domain/admin-dashboard/types"

const VALID_TIME_TYPES = ["mingguan", "bulanan", "tahunan"] as const

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (res.status === 401) throw new Error("Sesi habis, silakan login ulang")
  if (res.status === 403) throw new Error("Tidak memiliki akses")
  if (!res.ok)            throw new Error("Gagal mengambil data statistik")
  return res.json()
}

function isValidTimeType(value: unknown): value is typeof VALID_TIME_TYPES[number] {
  return VALID_TIME_TYPES.includes(value as any)
}

function buildAdminStatsUrl(params: AdminStatsParams) {
  if (!params.deptId || typeof params.deptId !== "string") {
    throw new Error("Invalid department ID")
  }
  if (!isValidTimeType(params.tipeWaktu)) {
    throw new Error("Invalid time type")
  }

  const searchParams = new URLSearchParams({
    deptId:    params.deptId,
    tipeWaktu: params.tipeWaktu,
  })

  if (params.bulan !== undefined) {
    const bulan = Number(params.bulan)
    if (bulan < 1 || bulan > 12) throw new Error("Invalid month")
    searchParams.set("bulan", String(bulan))
  }
  if (params.tahun !== undefined) {
    const tahun = Number(params.tahun)
    if (tahun < 2000 || tahun > 2100) throw new Error("Invalid year")
    searchParams.set("tahun", String(tahun))
  }

  return `/api/admin/stats?${searchParams.toString()}`
}

export function useAdminStats(params: AdminStatsParams) {
  const { data, error, isLoading } = useSWR<DashboardStatsResult>(
    buildAdminStatsUrl(params),
    fetcher,
    {
      refreshInterval:   60_000,
      revalidateOnFocus: true,
    }
  )

  const validError = error instanceof Error ? error : null

  return { data, error: validError, isLoading }
}