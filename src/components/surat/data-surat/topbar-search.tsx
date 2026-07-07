"use client"

import { Search, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

export type DataSuratSearchColumn = {
  id: string
  label: string
}

export const DEFAULT_DATA_SURAT_SEARCH_COLUMNS: DataSuratSearchColumn[] = [
  { id: "nomor_register", label: "Nomor Register" },
  { id: "asal_surat", label: "Asal Surat" },
]

const SEARCH_MAX_LENGTH = 50

type TopbarDataSuratSearchProps = {
  disabled?: boolean
  requireSearchColumn?: boolean
  searchColumns?: DataSuratSearchColumn[]
  onMobileExpandedChange?: (expanded: boolean) => void
}

export function TopbarDataSuratSearch({
  disabled,
  requireSearchColumn = false,
  searchColumns = [],
  onMobileExpandedChange,
}: TopbarDataSuratSearchProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawUrlQuery = searchParams.get("search") ?? ""
  const urlQuery = rawUrlQuery.slice(0, SEARCH_MAX_LENGTH)
  const selectedColumn = searchParams.get("column")
  const hasSelectedSearchColumn = Boolean(selectedColumn && selectedColumn !== "all")
  const selectedColumnLabel = (() => {
    if (!selectedColumn) return null
    const columns = new Map<string, string>()
    DEFAULT_DATA_SURAT_SEARCH_COLUMNS.forEach((column) => columns.set(column.id, column.label))
    searchColumns.forEach((column) => columns.set(column.id, column.label))
    return columns.get(selectedColumn) ?? null
  })()
  const canUseSearch = !requireSearchColumn || hasSelectedSearchColumn
  const isDisabled = disabled || !canUseSearch
  const placeholder = !canUseSearch
    ? "Pilih kolom pencarian dulu"
    : selectedColumnLabel
      ? `Cari berdasarkan ${selectedColumnLabel}...`
      : "Cari berdasarkan kolom terpilih..."
  const [query, setQuery] = useState(urlQuery)
  const [expanded, setExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const replaceSearch = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const normalizedValue = value.slice(0, SEARCH_MAX_LENGTH).trim()

    if (!normalizedValue || !canUseSearch) {
      params.delete("search")
    } else {
      params.set("search", normalizedValue)
    }

    const nextQuery = params.toString()
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
  }, [canUseSearch, pathname, router, searchParams])

  useEffect(() => {
    setQuery(urlQuery)
  }, [urlQuery])

  useEffect(() => {
    if (rawUrlQuery.length <= SEARCH_MAX_LENGTH) return
    replaceSearch(rawUrlQuery)
  }, [rawUrlQuery, replaceSearch])

  useEffect(() => {
    if (canUseSearch || !urlQuery) return
    setQuery("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("search")
    const nextQuery = params.toString()
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
  }, [canUseSearch, pathname, router, searchParams, urlQuery])

  useEffect(() => {
    if (expanded) {
      window.setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [expanded])

  useEffect(() => {
    onMobileExpandedChange?.(canUseSearch && (expanded || query.trim().length > 0))
  }, [canUseSearch, expanded, onMobileExpandedChange, query])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (query !== urlQuery) replaceSearch(query)
    }, 250)

    return () => window.clearTimeout(timer)
  }, [query, replaceSearch, urlQuery])

  function handleClear() {
    setQuery("")
    setExpanded(false)
    const params = new URLSearchParams(searchParams.toString())
    params.delete("search")
    const nextQuery = params.toString()
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
  }

  function renderSearchField(useMobileFocusRef = false) {
    return (
    <div
      className={[
        "relative h-9 min-w-0 flex-1 rounded-lg border border-border/70 bg-muted/35",
        "transition-colors focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-500/15",
      ].join(" ")}
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={useMobileFocusRef ? inputRef : undefined}
        value={query}
        onChange={(event) => setQuery(event.target.value.slice(0, SEARCH_MAX_LENGTH))}
        onKeyDown={(event) => event.key === "Escape" && handleClear()}
        disabled={isDisabled}
        placeholder={placeholder}
        maxLength={SEARCH_MAX_LENGTH}
        className="h-full w-full bg-transparent pl-9 pr-9 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
      />
      {(query || expanded) && !isDisabled && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Bersihkan pencarian"
          title="Bersihkan pencarian"
          className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
    )
  }

  return (
    <div
      className={[
        "flex max-w-xl min-w-0 items-center sm:w-full sm:flex-1",
        expanded || query ? "w-full flex-1" : "w-9 shrink-0",
        isDisabled ? "opacity-50" : "",
      ].join(" ")}
    >
      <div className="hidden w-full sm:flex">
        {renderSearchField()}
      </div>
      <div className={(expanded || query ? "flex w-full" : "flex w-9 justify-center") + " sm:hidden"}>
        {expanded || query ? (
          renderSearchField(true)
        ) : (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            disabled={isDisabled}
            aria-label="Cari data surat"
            title={canUseSearch ? "Cari data surat" : "Pilih kolom pencarian dulu"}
            className="flex size-9 items-center justify-center rounded-lg border border-border/70 bg-muted/35 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed"
          >
            <Search className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}
