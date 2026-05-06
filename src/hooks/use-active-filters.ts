import { useState, useEffect } from "react"

type Filters = { date: string | null; departments: string[] }

const STORAGE_KEY = "topbar_filters"
const EMPTY: Filters = { date: null, departments: [] }

function readStorage(): Filters {
  if (typeof window === "undefined") return EMPTY
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : EMPTY
  } catch { return EMPTY }
}

export function useActiveFilters() {
  const [filters, setFilters] = useState<Filters>(EMPTY)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setFilters(readStorage())
    setIsReady(true)

    const handler = (e: Event) => {
      const incoming = (e as CustomEvent<Filters>).detail
      setFilters(incoming)
      // ✅ Sync balik ke localStorage supaya konsisten
      if (incoming.date === null && incoming.departments.length === 0) {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(incoming))
      }
    }

    window.addEventListener("filter:change", handler)
    return () => window.removeEventListener("filter:change", handler)
  }, [])

  return { ...filters, isReady }
}