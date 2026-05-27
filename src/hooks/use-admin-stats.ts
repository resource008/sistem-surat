import useSWR from "swr"
import type {
  AdminStatsParams,
  DashboardStatsResult,
} from "@/domain/admin-dashboard/types"

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Gagal mengambil data statistik")
    return res.json()
  })

function buildAdminStatsUrl(params: AdminStatsParams) {
  const searchParams = new URLSearchParams({
    deptId: params.deptId,
    tipeWaktu: params.tipeWaktu,
  })

  if (params.bulan) searchParams.set("bulan", String(params.bulan))
  if (params.tahun) searchParams.set("tahun", String(params.tahun))

  return `/api/admin/stats?${searchParams.toString()}`
}

export function useAdminStats(params: AdminStatsParams) {
  const { data, error, isLoading } = useSWR<DashboardStatsResult>(
    buildAdminStatsUrl(params),
    fetcher,
    { refreshInterval: 5000 }
  )
  return { data, error, isLoading }
}