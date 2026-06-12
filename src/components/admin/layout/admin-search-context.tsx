"use client"

import { createContext, useContext } from "react"

interface AdminSearchContextValue {
  search: string
  debouncedSearch: string
  setSearch: (value: string) => void
}

export const AdminSearchContext = createContext<AdminSearchContextValue>({
  search: "",
  debouncedSearch: "",
  setSearch: () => {},
})

export function useAdminSearch() {
  return useContext(AdminSearchContext)
}
