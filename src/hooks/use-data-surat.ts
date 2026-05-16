// src/hooks/use-data-surat.ts
// No logic changes — fetchAllSurat is now exported from @/domain/surat/repositories.

import { fetchAllSurat } from "@/domain/surat/repositories"
import type { RegisterSurat } from "@/types"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"

const SESSION_KEY = "datasurat:selectedIds"

function readSession(): Set<number> {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set()
  }
}

function writeSession(ids: Set<number>) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(Array.from(ids)))
  } catch {}
}

export function useDataSurat(printPath: string) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const showPI       = searchParams.get("mode") === "pi"

  // ── States ────────────────────────────────────────────────────────────────
  const [data,        setData]        = useState<RegisterSurat[]>([])
  const [loading,     setLoading]     = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  // ── Session Sync ──────────────────────────────────────────────────────────
  useEffect(() => { setSelectedIds(readSession()) }, [])
  useEffect(() => { writeSession(selectedIds)     }, [selectedIds])

  // ── Data Fetching ─────────────────────────────────────────────────────────
  const loadData = useCallback(() => {
    setLoading(true)
    fetchAllSurat(showPI ? "pi" : undefined)
      .then(rows => setData(rows as RegisterSurat[]))
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [showPI])

  useEffect(() => {
    loadData()
    window.dispatchEvent(new CustomEvent("breadcrumb:sub",    { detail: null }))
    window.dispatchEvent(new CustomEvent("breadcrumb:subsub", { detail: null }))
  }, [loadData])

  // ── Filtering & Grouping ──────────────────────────────────────────────────
  const filterDate  = searchParams.get("date")
  const filterDepts = searchParams.get("dept")?.split(",") ?? []

  const filteredData = useMemo(() => data.filter(reg => {
    const matchDate = filterDate
      ? format(new Date(reg.tanggalTerima), "yyyy-MM-dd") === filterDate
      : true
    const matchDept = filterDepts.length > 0 ? filterDepts.includes(reg.deptId) : true
    const matchPI   = showPI ? reg.deptId === "PI" : reg.deptId !== "PI"
    return matchDate && matchDept && matchPI
  }), [data, filterDate, filterDepts, showPI])

  const groupedData = useMemo(() => filteredData.reduce(
    (acc: Record<string, RegisterSurat[]>, reg) => {
      const dateKey  = reg.tanggalTerima
        ? format(new Date(reg.tanggalTerima), "dd MMMM yyyy", { locale: id }).toUpperCase()
        : "TANPA TANGGAL"
      const groupKey = `${dateKey}|||${reg.deptId}`
      if (!acc[groupKey]) acc[groupKey] = []
      acc[groupKey].push(reg)
      return acc
    },
    {},
  ), [filteredData])

  const sortedGroupKeys = useMemo(() =>
    Object.keys(groupedData).sort((a, b) => {
      const dateA = new Date(groupedData[a][0].tanggalTerima)
      const dateB = new Date(groupedData[b][0].tanggalTerima)
      return dateB.getTime() - dateA.getTime()
    }),
  [groupedData])

  // ── Handlers ──────────────────────────────────────────────────────────────
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
  }

  return {
    state: {
      loading, showPI, filterDate, filterDepts,
      filteredData, groupedData, sortedGroupKeys, selectedIds,
    },
    actions,
  }
}