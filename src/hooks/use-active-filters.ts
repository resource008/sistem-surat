import { useState, useEffect } from "react"

type Filters = { date: string | null; departments: string[] }

const STORAGE_KEY = "topbar_filters"
const EMPTY: Filters = { date: null, departments: [] }

function isValidFilters(value: unknown): value is Filters {
  if (typeof value !== "object" || value === null) return false
  const v = value as Record<string, unknown>
  return (
    (v.date === null || typeof v.date === "string") &&
    Array.isArray(v.departments) &&
    v.departments.every((d) => typeof d === "string")
  )
}

function readStorage(): Filters {
  if (typeof window === "undefined") return EMPTY
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return EMPTY
    const parsed = JSON.parse(saved)
    return isValidFilters(parsed) ? parsed : EMPTY
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