// src/hooks/use-topbar-search.ts
"use client"

import { useState, useCallback, useEffect } from "react"

export function useTopbarSearch() {
  const [search,        setSearchRaw]    = useState("")
  const [debouncedSearch, setDebounced] = useState("")

  // Debounce 800ms — request baru dikirim 800ms setelah berhenti mengetik
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 800)
    return () => clearTimeout(t)
  }, [search])

  const setSearch = useCallback((v: string) => setSearchRaw(v), [])

  return { search, debouncedSearch, setSearch }
}