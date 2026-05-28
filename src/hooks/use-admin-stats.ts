import useSWR from "swr"
import type {
  AdminStatsParams,
  DashboardStatsResult,
} from "@/domain/admin-dashboard/types"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (res.status === 401) throw new Error("Sesi habis, silakan login ulang")
  if (res.status === 403) throw new Error("Tidak memiliki akses")
  if (!res.ok)            throw new Error("Gagal mengambil data statistik")
  return res.json()
}

function buildAdminStatsUrl(params: AdminStatsParams) {
  const searchParams = new URLSearchParams({
    deptId:    params.deptId,
    tipeWaktu: params.tipeWaktu,
  })

  if (params.bulan !== undefined) searchParams.set("bulan", String(params.bulan))
  if (params.tahun !== undefined) searchParams.set("tahun", String(params.tahun))

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
  return { data, error, isLoading }
}