import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useSearchParams }               from "next/navigation"
import { format, isValid }                          from "date-fns"

type Filters = { date: string | null; departments: string[] }

function parseDate(str: string | null): Date | undefined {
  if (!str) return undefined
  const d = new Date(str)
  return isValid(d) ? d : undefined
}

export function useFilter(
  onFilterChange?: (f: Filters) => void,
  initialFilters?: Filters,
) {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const isFirstRender    = useRef(true)
  const onFilterChangeRef = useRef(onFilterChange)

  // Selalu update ref tanpa trigger re-render
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange
  }, [onFilterChange])

  // ── Init: URL params > initialFilters > kosong ────────────────────────
  const [date, setDateState] = useState<Date | undefined>(() => {
    const urlDate = searchParams.get("date")
    if (urlDate)              return parseDate(urlDate)
    if (initialFilters?.date) return parseDate(initialFilters.date)
    return undefined
  })

  const [selectedDepts, setSelectedDepts] = useState<string[]>(() => {
    const urlDept = searchParams.get("dept")
    if (urlDept) return urlDept.split(",").filter(Boolean)
    return initialFilters?.departments ?? []
  })

  // ── Sync ketika parent clear filter ───────────────────────────────────
  const initialDate  = initialFilters?.date
  const initialDepts = initialFilters?.departments?.join(",") ?? ""

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const isEmpty = !initialDate && initialDepts === ""
    if (isEmpty) {
      setDateState(undefined)
      setSelectedDepts([])
      router.push("?", { scroll: false })
    }
  }, [initialDate, initialDepts, router])

  // ── Update URL + notify parent ────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams()
    if (date)                     params.set("date", format(date, "yyyy-MM-dd"))
    if (selectedDepts.length > 0) params.set("dept", selectedDepts.join(","))

    router.push(`?${params.toString()}`, { scroll: false })
    onFilterChangeRef.current?.({
      date:        date ? format(date, "yyyy-MM-dd") : null,
      departments: selectedDepts,
    })
  }, [date, selectedDepts, router])

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
    onFilterChangeRef.current?.({ date: null, departments: [] })
    onDone?.()
  }, [router])

  const hasFilter = !!date || selectedDepts.length > 0

  return { date, setDate, selectedDepts, toggleDept, hasFilter, reset }
}