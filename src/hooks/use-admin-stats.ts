import useSWR from "swr"
import type { Period, StatsData } from "@/components/admin/dashboard/types"

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Gagal mengambil data statistik")
    return res.json()
  })

export function useAdminStats(period: Period) {
  const { data, error, isLoading } = useSWR<StatsData>(
    `/api/admin/stats?period=${period}`,
    fetcher
  )
  return { data, error, isLoading }
}