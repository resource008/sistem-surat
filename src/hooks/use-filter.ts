import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams }                          from "next/navigation"
import { format, isValid }                          from "date-fns"

type Filters = { date: string | null; departments: string[] }

function parseDate(str: string | null): Date | undefined {
  if (!str) return undefined
  const d = new Date(str)
  return isValid(d) ? d : undefined
}

// ── Custom debounce hook ──────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number, skip?: boolean): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    // Skip debounce saat reset agar langsung trigger tanpa tunggu delay
    if (skip) {
      setDebounced(value)
      return
    }
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay, skip])

  return debounced
}

export function useFilter(
  onFilterChange?: (f: Filters) => void,
  initialFilters?: Filters,
) {
  const searchParams = useSearchParams()

  const onFilterChangeRef = useRef(onFilterChange)
  const isMounted         = useRef(false)
  const isResetting       = useRef(false)

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

  // ── Debounce: tunda URL update + API call 400ms setelah user berhenti ──
  // skip=true saat reset agar langsung update tanpa tunggu debounce
  const debouncedDate  = useDebounce(date, 400, isResetting.current)
  const debouncedDepts = useDebounce(selectedDepts, 400, isResetting.current)

  // ── Sync ketika parent clear filter ──────────────────────────────────
  const prevInitialRef = useRef({
    date:  initialFilters?.date,
    depts: initialFilters?.departments,
  })

  useEffect(() => {
    const prev    = prevInitialRef.current
    const isEmpty = !initialFilters?.date && !initialFilters?.departments?.length

    if (isEmpty && (prev.date || prev.depts?.length)) {
      isResetting.current = true
      setDateState(undefined)
      setSelectedDepts([])
    }

    prevInitialRef.current = {
      date:  initialFilters?.date,
      depts: initialFilters?.departments,
    }
  }, [initialFilters?.date, initialFilters?.departments])

  // ── Update URL + notify parent ────────────────────────────────────────
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    const params = new URLSearchParams()
    if (debouncedDate)             params.set("date", format(debouncedDate, "yyyy-MM-dd"))
    if (debouncedDepts.length > 0) params.set("dept", debouncedDepts.join(","))

    // ✅ replaceState: update URL tanpa trigger RSC re-render dari Next.js
    // Sebelumnya router.push() → Next.js kirim request RSC ke server → lambat
    window.history.replaceState(null, "", `?${params.toString()}`)

    onFilterChangeRef.current?.({
      date:        debouncedDate ? format(debouncedDate, "yyyy-MM-dd") : null,
      departments: debouncedDepts,
    })

    // Reset flag setelah URL dan notify selesai
    isResetting.current = false
  }, [debouncedDate, debouncedDepts])

  // ── Actions ───────────────────────────────────────────────────────────
  const setDate = useCallback((val: Date | undefined) => {
    isResetting.current = false
    setDateState(val)
  }, [])

  const toggleDept = useCallback((dept: string) => {
    isResetting.current = false
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    )
  }, [])

  const reset = useCallback((onDone?: () => void) => {
    isResetting.current = true  // bypass debounce → langsung update
    setDateState(undefined)
    setSelectedDepts([])
    onDone?.()
  }, [])

  const hasFilter = !!date || selectedDepts.length > 0

  return { date, setDate, selectedDepts, toggleDept, hasFilter, reset }
}