import { useEffect, useState } from "react"
import { Period, StatsData } from "../components/admin/dashboard/types"

export function useAdminStats(period: Period) {
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetch(`/api/admin/stats?period=${period}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data statistik")
        return res.json()
      })
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [period])

  return { data, loading, error }
}