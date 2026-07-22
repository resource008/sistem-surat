"use client"

import { useEffect, useRef, useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAdminSearch } from "@/components/admin/layout/admin-search-context"

interface AdminTopbarSearchProps {
  isMobile: boolean
  onExpand?: (expanded: boolean) => void
}

export function AdminTopbarSearch({ isMobile, onExpand }: AdminTopbarSearchProps) {
  const { search, setSearch } = useAdminSearch()
  const [expanded, setExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (expanded) setTimeout(() => inputRef.current?.focus(), 50)
  }, [expanded])

  useEffect(() => {
    if (!isMobile) {
      onExpand?.(false)
      return
    }

    if (search.trim().length > 0 && !expanded) {
      setExpanded(true)
      onExpand?.(true)
      return
    }

    onExpand?.(expanded)
  }, [expanded, isMobile, onExpand, search])

  function handleExpand() {
    setExpanded(true)
    onExpand?.(true)
  }

  function handleCancel() {
    setExpanded(false)
    setSearch("")
    onExpand?.(false)
  }

  if (!isMobile) {
    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Cari Nama Pengguna atau Email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-9 w-80 rounded-xl border-border/60 bg-muted/40 pl-9 text-sm xl:w-96"
        />
      </div>
    )
  }

  if (!expanded) {
    return (
      <button
        onClick={handleExpand}
        className="flex size-9 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:bg-muted"
        aria-label="Cari pengguna"
      >
        <Search className="size-4" />
      </button>
    )
  }

  return (
    <div className="flex flex-1 animate-in items-center gap-2 fade-in slide-in-from-right-2 duration-200">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          placeholder="Cari Nama Pengguna atau Email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => event.key === "Escape" && handleCancel()}
          className="h-9 w-full rounded-xl border-border/60 bg-muted/40 pl-9 text-sm"
        />
      </div>
      <button
        onClick={handleCancel}
        className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:bg-muted"
        aria-label="Batal"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
