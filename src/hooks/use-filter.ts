import { useState, useEffect, useRef, useCallback } from "react"
import { usePathname, useRouter, useSearchParams }  from "next/navigation"
import { format, isValid }                          from "date-fns"

export type FilterMode = "surat" | "pi"
export type Filters = { date: string | null; departments: string[] }

function parseDate(str: string | null): Date | undefined {
  if (!str) return undefined
  const d = new Date(str)
  return isValid(d) ? d : undefined
}

function useDebounce<T>(value: T, delay: number, skip?: boolean): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
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
  mode: FilterMode = "surat",
) {
  const pathname     = usePathname()
  const router       = useRouter()
  const searchParams = useSearchParams()

  const onFilterChangeRef = useRef(onFilterChange)
  const searchParamsRef   = useRef(searchParams)
  const isMounted         = useRef(false)
  const isResetting       = useRef(false)

  useEffect(() => {
    onFilterChangeRef.current = onFilterChange
  }, [onFilterChange])

  useEffect(() => {
    searchParamsRef.current = searchParams
  }, [searchParams])

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

  const debouncedDate  = useDebounce(date, 400, isResetting.current)
  const debouncedDepts = useDebounce(selectedDepts, 400, isResetting.current)

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

  useEffect(() => {
    if (mode === "pi") setSelectedDepts([])
  }, [mode])

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    const effectiveDepts = mode === "pi" ? [] : debouncedDepts
    const params = new URLSearchParams(searchParamsRef.current.toString())
    params.delete("date")
    params.delete("dept")
    params.delete("mode")
    if (mode === "pi")              params.set("mode", "pi")
    if (debouncedDate)              params.set("date", format(debouncedDate, "yyyy-MM-dd"))
    if (effectiveDepts.length > 0)  params.set("dept", effectiveDepts.join(","))

    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })

    onFilterChangeRef.current?.({
      date:        debouncedDate ? format(debouncedDate, "yyyy-MM-dd") : null,
      departments: effectiveDepts,
    })

    isResetting.current = false
  }, [debouncedDate, debouncedDepts, mode, pathname, router])

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
    isResetting.current = true
    setDateState(undefined)
    setSelectedDepts([])
    onDone?.()
  }, [])

  const hasFilter = !!date || (mode !== "pi" && selectedDepts.length > 0)

  return { date, setDate, selectedDepts, toggleDept, hasFilter, reset }
}
