import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useSearchParams }               from "next/navigation"
import { format }                                   from "date-fns"

type Filters = { date: string | null; departments: string[] }

export function useFilter(
  onFilterChange?: (f: Filters) => void,
  initialFilters?: Filters,
) {
  const router        = useRouter()
  const searchParams  = useSearchParams()
  const isFirstRender = useRef(true)

  // ── Init: URL params > initialFilters > kosong ────────────────────────
  const [date, setDateState] = useState<Date | undefined>(() => {
    const urlDate = searchParams.get("date")
    if (urlDate)                return new Date(urlDate)
    if (initialFilters?.date)   return new Date(initialFilters.date)
    return undefined
  })

  const [selectedDepts, setSelectedDepts] = useState<string[]>(() => {
    const urlDept = searchParams.get("dept")
    if (urlDept) return urlDept.split(",")
    return initialFilters?.departments ?? []
  })

  // ── Sync ketika parent clear filter (tombol Bersihkan) ────────────────
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const isEmpty =
      !initialFilters?.date &&
      (initialFilters?.departments?.length ?? 0) === 0

    if (isEmpty) {
      setDateState(undefined)
      setSelectedDepts([])
      router.push("?", { scroll: false })
    }
  }, [
    initialFilters?.date,
    initialFilters?.departments?.join(","),
  ])

  // ── Update URL + notify parent ────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams()
    if (date)                   params.set("date", format(date, "yyyy-MM-dd"))
    if (selectedDepts.length > 0) params.set("dept", selectedDepts.join(","))

    router.push(`?${params.toString()}`, { scroll: false })
    onFilterChange?.({
      date        : date ? format(date, "yyyy-MM-dd") : null,
      departments : selectedDepts,
    })
  }, [date, selectedDepts])

  // ── Actions ───────────────────────────────────────────────────────────
  const setDate = useCallback((val: Date | undefined) => {
    setDateState(val)
  }, [])

  const toggleDept = useCallback((dept: string) => {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    )
  }, [])

  const reset = useCallback((onDone?: () => void) => {
    setDateState(undefined)
    setSelectedDepts([])
    router.push("?", { scroll: false })
    onFilterChange?.({ date: null, departments: [] })
    onDone?.()
  }, [])

  const hasFilter = !!date || selectedDepts.length > 0

  return { date, setDate, selectedDepts, toggleDept, hasFilter, reset }
}