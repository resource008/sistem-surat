import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"

export function useFilter(onFilterChange?: (f: { date: string | null; departments: string[] }) => void) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [date, setDate] = useState<Date | undefined>(
    searchParams.get("date") ? new Date(searchParams.get("date")!) : undefined
  )
  const [selectedDepts, setSelectedDepts] = useState<string[]>(
    searchParams.get("dept") ? searchParams.get("dept")!.split(",") : []
  )

  const hasFilter = !!date || selectedDepts.length > 0

  useEffect(() => {
    const params = new URLSearchParams()
    if (date) params.set("date", format(date, "yyyy-MM-dd"))
    if (selectedDepts.length > 0) params.set("dept", selectedDepts.join(","))
    router.push(`?${params.toString()}`, { scroll: false })
    onFilterChange?.({
      date: date ? format(date, "yyyy-MM-dd") : null,
      departments: selectedDepts,
    })
  }, [date, selectedDepts])

  function reset(onDone?: () => void) {
    setDate(undefined)
    setSelectedDepts([])
    router.push("?")
    onFilterChange?.({ date: null, departments: [] })
    onDone?.()
  }

  function toggleDept(dept: string) {
    setSelectedDepts(prev =>
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    )
  }

  return { date, setDate, selectedDepts, toggleDept, hasFilter, reset }
}