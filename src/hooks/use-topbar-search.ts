// src/hooks/use-topbar-search.ts
"use client"

import { useState, useCallback } from "react"

export function useTopbarSearch() {
  const [search, setSearchRaw] = useState("")
  const setSearch = useCallback((v: string) => setSearchRaw(v), [])
  return { search, setSearch }
}