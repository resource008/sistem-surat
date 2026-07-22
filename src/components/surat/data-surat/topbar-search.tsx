"use client"

import { Search, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"

export type DataSuratSearchColumn = {
  id: string
  label: string
  type?: string
}

export const DEFAULT_DATA_SURAT_SEARCH_COLUMNS: DataSuratSearchColumn[] = [
  { id: "nomor_register", label: "Nomor Register" },
  { id: "asal_surat", label: "Asal Surat" },
]

const SEARCH_MAX_LENGTH = 50

function normalizeSearchColumnText(value?: string | null) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function getLegacySearchColumnId(column: DataSuratSearchColumn) {
  return `column:${normalizeSearchColumnText(column.label)}`
}

function isDateSearchColumn(column?: DataSuratSearchColumn | null, columnId?: string | null) {
  if (columnId === "tanggal_terima") return true
  if (column?.type === "date") return true

  const label = normalizeSearchColumnText(column?.label ?? columnId)
  return label === "tanggal"
    || label === "tanggal terima"
    || label === "tanggal surat"
    || label === "tgl surat"
    || label.includes(" tanggal ")
    || label.startsWith("tanggal ")
    || label.endsWith(" tanggal")
}

type TopbarDataSuratSearchProps = {
  disabled?: boolean
  requireSearchColumn?: boolean
  includeDefaultSearchColumns?: boolean
  searchColumns?: DataSuratSearchColumn[]
  filterSlot?: ReactNode
  rightSlot?: ReactNode
  onMobileExpandedChange?: (expanded: boolean) => void
}

export function TopbarDataSuratSearch({
  disabled,
  requireSearchColumn: _requireSearchColumn = false,
  includeDefaultSearchColumns = true,
  searchColumns = [],
  filterSlot,
  rightSlot,
  onMobileExpandedChange,
}: TopbarDataSuratSearchProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawUrlQuery = searchParams.get("search") ?? ""
  const urlQuery = rawUrlQuery.slice(0, SEARCH_MAX_LENGTH)
  const selectedColumn = searchParams.get("column")
  const availableColumnList = includeDefaultSearchColumns
    ? [...DEFAULT_DATA_SURAT_SEARCH_COLUMNS, ...searchColumns]
    : searchColumns
  const availableColumns = new Map<string, string>()
  if (includeDefaultSearchColumns) {
    DEFAULT_DATA_SURAT_SEARCH_COLUMNS.forEach((column) => availableColumns.set(column.id, column.label))
  }
  searchColumns.forEach((column) => availableColumns.set(column.id, column.label))
  const selectedColumnOption = selectedColumn
    ? availableColumnList.find((column) =>
        column.id === selectedColumn || getLegacySearchColumnId(column) === selectedColumn
      )
    : undefined
  const selectedColumnLabel = (() => {
    if (!selectedColumn) return null
    return availableColumns.get(selectedColumn) ?? selectedColumnOption?.label ?? null
  })()
  const hasSelectedSearchColumn = Boolean(selectedColumn && selectedColumn !== "all" && selectedColumnLabel)
  const canUseSearch = !isDateSearchColumn(selectedColumnOption, selectedColumn)
  const isDisabled = Boolean(disabled)
  const placeholder = "Cari data"
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
    if (expanded && canUseSearch) {
      window.setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [canUseSearch, expanded])

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
    const hasClearAction = Boolean((query || expanded) && !isDisabled)
    const hasFilterAction = Boolean(filterSlot)

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
        className={[
          "h-full w-full bg-transparent pl-9 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
          hasClearAction && hasFilterAction ? "pr-[72px]" : hasFilterAction ? "pr-10" : hasClearAction ? "pr-10" : "pr-3",
        ].join(" ")}
      />
      {hasClearAction && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Bersihkan pencarian"
          title="Bersihkan pencarian"
          className={[
            "absolute top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md",
            "text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            hasFilterAction ? "right-9" : "right-2",
          ].join(" ")}
        >
          <X className="size-4" />
        </button>
      )}
      {filterSlot ? (
        <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center">
          {filterSlot}
        </div>
      ) : null}
    </div>
    )
  }

  return (
    <div
      className={[
        "flex max-w-xl min-w-0 items-center sm:w-full sm:flex-1",
        expanded || query ? "w-full flex-1" : rightSlot ? "w-auto shrink-0" : "w-9 shrink-0",
        isDisabled ? "opacity-50" : "",
      ].join(" ")}
    >
      <div className="hidden w-full sm:flex">
        <div className="flex w-full min-w-0 items-center gap-2">
          {renderSearchField()}
          {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
        </div>
      </div>
      <div className={(expanded || query ? "flex w-full items-center gap-2" : "flex w-auto items-center gap-2") + " sm:hidden"}>
        {expanded || query ? (
          <>
            {renderSearchField(true)}
            {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setExpanded(true)}
              disabled={isDisabled}
              aria-label="Cari data surat"
              title="Cari data surat"
              className="flex size-9 items-center justify-center rounded-lg border border-border/70 bg-muted/35 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed"
            >
              <Search className="size-4" />
            </button>
            {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
          </>
        )}
      </div>
    </div>
  )
}
