"use client"

import type { RegisterSurat } from "@/types"
import { format, isValid } from "date-fns"
import { id }             from "date-fns/locale"
import { compareRegisterNomor } from "@/lib/surat-helpers"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

const SESSION_KEY = "datasurat:selectedIds"
const LIMIT = 20

function isClient() { return typeof window !== "undefined" }

function readSession(): Set<number> {
  if (!isClient()) return new Set()
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((id): id is number => typeof id === "number"))
  } catch { return new Set() }
}

function writeSession(ids: Set<number>) {
  if (!isClient()) return
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(Array.from(ids))) } catch {}
}

function safeFormat(date: string | Date | null | undefined, fmt: string): string | null {
  if (!date) return null
  const d = new Date(date)
  return isValid(d) ? format(d, fmt, { locale: id }) : null
}

function hasVisibleDetails(register: RegisterSurat) {
  return (register.detailSurat ?? []).length > 0
}

export function useDataSurat(printPath: string) {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const filterDate     = searchParams.get("date")
  const filterDeptsRaw = searchParams.get("dept") ?? ""
  const filterDepts    = useMemo(
    () => filterDeptsRaw.split(",").filter(Boolean),
    [filterDeptsRaw]
  )

  const [data,        setData]        = useState<RegisterSurat[]>([])
  const [loading,     setLoading]     = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore,     setHasMore]     = useState(true)
  const [page,        setPage]        = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  useEffect(() => { setSelectedIds(readSession()) }, [])
  useEffect(() => { writeSession(selectedIds)     }, [selectedIds])

  // ✅ Gunakan ref untuk track filter aktif — hindari stale closure di fetchPage
  const filterRef = useRef({ filterDate, filterDeptsRaw })
  useEffect(() => {
    filterRef.current = { filterDate, filterDeptsRaw }
  }, [filterDate, filterDeptsRaw])

  // ✅ fetchPage sekarang kirim filter ke API — bukan filter di client
  const fetchPage = useCallback(async (pageNum: number, replace = false) => {
    try {
      const { filterDate, filterDeptsRaw } = filterRef.current

      const params = new URLSearchParams()
      if (filterDate)    params.set("date",  filterDate)           // ✅ kirim ke API
      if (filterDeptsRaw) params.set("dept", filterDeptsRaw)      // ✅ kirim ke API
      params.set("page",  String(pageNum))
      params.set("limit", String(LIMIT))

      const res = await fetch(`/api/surat?${params.toString()}`)
      if (!res.ok) throw new Error("Gagal mengambil data")
      const result = await res.json()

      if (
        typeof result === "object" &&
        result !== null &&
        "data" in result &&
        Array.isArray(result.data)
      ) {
        const rows = result.data as RegisterSurat[]
        setData(prev => replace ? rows : [...prev, ...rows])
        setHasMore("hasMore" in result ? Boolean(result.hasMore) : false)
      } else {
        setData([])
        setHasMore(false)
      }
    } catch {
      setHasMore(false)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, []) // ✅ tidak ada dependency — pakai ref agar tidak re-create

  // ✅ Reset + fetch ulang dari page 1 setiap kali filter berubah
  // Digabung dalam satu effect agar tidak ada race condition
  useEffect(() => {
    setData([])
    setPage(1)
    setHasMore(true)
    setLoading(true)
    fetchPage(1, true)

    window.dispatchEvent(new CustomEvent("breadcrumb:sub",    { detail: null }))
    window.dispatchEvent(new CustomEvent("breadcrumb:subsub", { detail: null }))
  }, [filterDate, filterDeptsRaw, fetchPage])

  // Load more saat page bertambah (bukan page 1 — sudah ditangani effect atas)
  useEffect(() => {
    if (page === 1) return
    setLoadingMore(true)
    fetchPage(page)
  }, [page, fetchPage])

  // ✅ groupedData & sortedGroupKeys langsung dari data (tidak perlu filteredData lagi
  //    karena filter sudah dilakukan di server/API)
  const visibleData = useMemo(
    () => data.filter(hasVisibleDetails),
    [data]
  )

  const groupedData = useMemo(() => {
    const grouped = visibleData.reduce((acc: Record<string, RegisterSurat[]>, reg) => {
      const formatted = safeFormat(reg.tanggalTerima, "dd MMMM yyyy")
      const dateKey   = formatted ? formatted.toUpperCase() : "TANPA TANGGAL"
      const groupKey  = `${dateKey}|||${reg.deptId}|||${reg.dept.shortName}`
      if (!acc[groupKey]) acc[groupKey] = []
      acc[groupKey].push(reg)
      return acc
    }, {})

    Object.values(grouped).forEach((registers) => registers.sort(compareRegisterNomor))
    return grouped
  }, [visibleData])

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
      if (isClient()) {
        try { sessionStorage.removeItem(SESSION_KEY) } catch {}
      }
    },
    handlePrint: () => {
      const idsString = Array.from(selectedIds).join(",")
      if (!isClient()) return
      try { sessionStorage.setItem("cetak:ids:all", idsString) } catch {}
      router.push(`${printPath}/all`)
    },
    loadMore: () => {
      if (!loadingMore && hasMore) setPage(p => p + 1)
    },
  }

  return {
    state: {
      loading, loadingMore, hasMore,
      filterDate, filterDepts,
      filteredData: visibleData,   // ✅ tidak perlu filteredData terpisah lagi
      groupedData, sortedGroupKeys, selectedIds,
    },
    actions,
  }
}
