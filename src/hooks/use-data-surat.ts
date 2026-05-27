"use client"

import { fetchAllSurat } from "@/domain/surat/repositories"
import type { RegisterSurat } from "@/types"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

const SESSION_KEY = "datasurat:selectedIds"
const LIMIT = 20

function readSession(): Set<number> {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch { return new Set() }
}

function writeSession(ids: Set<number>) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(Array.from(ids))) } catch {}
}

export function useDataSurat(printPath: string) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const showPI       = searchParams.get("mode") === "pi"
  const filterDate   = searchParams.get("date")
  const filterDepts  = useMemo(
    () => searchParams.get("dept")?.split(",").filter(Boolean) ?? [],
    [searchParams]
  )

  const [data,        setData]        = useState<RegisterSurat[]>([])
  const [loading,     setLoading]     = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore,     setHasMore]     = useState(true)
  const [page,        setPage]        = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  useEffect(() => { setSelectedIds(readSession()) }, [])
  useEffect(() => { writeSession(selectedIds)     }, [selectedIds])

  // Reset saat filter/mode berubah
  const filterKey = `${showPI}|${filterDate}|${filterDepts.join(",")}`
  useEffect(() => {
    setData([])
    setPage(1)
    setHasMore(true)
    setLoading(true)
  }, [filterKey])

  const fetchPage = useCallback(async (pageNum: number, replace = false) => {
    try {
      const type = showPI ? "pi" : undefined
      const result = await fetchAllSurat(type, { page: pageNum, limit: LIMIT })
      const rows = result.data as RegisterSurat[]

      setData(prev => replace ? rows : [...prev, ...rows])
      setHasMore(result.hasMore)
    } catch {
      setHasMore(false)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [showPI])

  // Initial load
  useEffect(() => {
    fetchPage(1, true)
    window.dispatchEvent(new CustomEvent("breadcrumb:sub",    { detail: null }))
    window.dispatchEvent(new CustomEvent("breadcrumb:subsub", { detail: null }))
  }, [fetchPage])

  // Load more saat page bertambah
  useEffect(() => {
    if (page === 1) return
    setLoadingMore(true)
    fetchPage(page)
  }, [page, fetchPage])

  // Filter di client (date & dept — karena API tidak filter ini)
  const filteredData = useMemo(() => data.filter(reg => {
    const matchDate = filterDate
      ? format(new Date(reg.tanggalTerima), "yyyy-MM-dd") === filterDate
      : true
    const matchDept = filterDepts.length > 0
      ? filterDepts.includes(reg.deptId)
      : true
    return matchDate && matchDept
  }), [data, filterDate, filterDepts])

  const groupedData = useMemo(() => filteredData.reduce(
    (acc: Record<string, RegisterSurat[]>, reg) => {
      const dateKey  = reg.tanggalTerima
        ? format(new Date(reg.tanggalTerima), "dd MMMM yyyy", { locale: id }).toUpperCase()
        : "TANPA TANGGAL"
      const groupKey = `${dateKey}|||${reg.deptId}`
      if (!acc[groupKey]) acc[groupKey] = []
      acc[groupKey].push(reg)
      return acc
    }, {}
  ), [filteredData])

  const sortedGroupKeys = useMemo(() =>
    Object.keys(groupedData).sort((a, b) => {
      const dateA = new Date(groupedData[a][0].tanggalTerima)
      const dateB = new Date(groupedData[b][0].tanggalTerima)
      return dateB.getTime() - dateA.getTime()
    }),
  [groupedData])

  const actions = {
    toggleSelect: (itemId: number) => {
      setSelectedIds(prev => {
        const next = new Set(prev)
        next.has(itemId) ? next.delete(itemId) : next.add(itemId)
        return next
      })
    },
    clearSelection: () => {
      setSelectedIds(new Set())
      try { sessionStorage.removeItem(SESSION_KEY) } catch {}
    },
    handlePrint: () => {
      const idsString = Array.from(selectedIds).join(",")
      if (showPI) {
        try { sessionStorage.setItem("cetak:ids:pi",  idsString) } catch {}
      } else {
        try { sessionStorage.setItem("cetak:ids:all", idsString) } catch {}
      }
      router.push(showPI ? `${printPath}/pi` : `${printPath}/all`)
    },
    loadMore: () => {
      if (!loadingMore && hasMore) setPage(p => p + 1)
    },
  }

  return {
    state: {
      loading, loadingMore, hasMore, showPI,
      filterDate, filterDepts,
      filteredData, groupedData, sortedGroupKeys, selectedIds,
    },
    actions,
  }
}