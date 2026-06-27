// components/filters/index.tsx
"use client"

import { Suspense }          from "react"
import { SlidersHorizontal } from "lucide-react"
import { type FilterMode, type Filters, useFilter } from "@/hooks/use-filter"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { usePanel }          from "@/hooks/use-panel"
import { FilterDesktop }     from "./filter-desktop"
import { FilterSheet }       from "./filter-sheet"
import {
  DEFAULT_DATA_SURAT_SEARCH_COLUMNS,
  type DataSuratSearchColumn,
} from "@/components/surat/data-surat/topbar-search"

type Props = {
  initialFilters?: Filters
  onFilterChange?: (f: Filters) => void
  mode?: FilterMode
  hideDepartments?: boolean
  disabled?: boolean
  searchColumns?: DataSuratSearchColumn[]
  showSearchColumnFilter?: boolean
}

// ── Inner component (yang pakai useSearchParams via useFilter) ────────────
function TopbarFilterInner({
  initialFilters,
  onFilterChange,
  mode = "surat",
  hideDepartments,
  disabled,
  searchColumns = [],
  showSearchColumnFilter = false,
}: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    date, setDate,
    selectedDepts, toggleDept,
    hasFilter,
  } = useFilter(onFilterChange, initialFilters, mode)

  const availableSearchColumns = (() => {
    if (!showSearchColumnFilter) return []
    const options = new Map<string, string>()
    DEFAULT_DATA_SURAT_SEARCH_COLUMNS.forEach((column) => options.set(column.id, column.label))
    searchColumns.forEach((column) => options.set(column.id, column.label))
    return Array.from(options, ([id, label]) => ({ id, label }))
  })()
  const requestedSearchColumn = searchParams.get("column")
  const selectedSearchColumn = requestedSearchColumn && availableSearchColumns.some((column) => column.id === requestedSearchColumn)
    ? requestedSearchColumn
    : undefined
  const hasColumnFilter = showSearchColumnFilter && Boolean(selectedSearchColumn)
  const hasAnyFilter = hasFilter || hasColumnFilter
  const activeFilterCount = (date ? 1 : 0) + selectedDepts.length + (hasColumnFilter ? 1 : 0)

  function handleSelectSearchColumn(column: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (!showSearchColumnFilter) params.delete("column")
    else params.set("column", column)
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const {
    isMobile,
    desktopMounted, desktopVisible, closeDesktop,
    sheetMounted,   sheetVisible,   closeSheet,
    handleTriggerClick,
  } = usePanel()

  return (
    <>
      <button
        onClick={disabled ? undefined : handleTriggerClick}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 0,
          padding: 0,
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          border: `1px solid ${hasAnyFilter ? "#2563eb" : "var(--border)"}`,
          background: hasAnyFilter ? "#2563eb" : "transparent",
          color: hasAnyFilter ? "#ffffff" : "var(--muted-foreground)",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.4 : 1,
          fontSize: "13px", fontFamily: "inherit",
          position: "relative",
          fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0,
          transition: "all 0.2s ease",
        }}
        aria-label="Filter"
        title="Filter"
      >
        <SlidersHorizontal size={14} />
        {hasAnyFilter && (
          <span style={{
            position: "absolute",
            top: "-6px",
            right: "-6px",
            minWidth: "16px",
            height: "16px",
            padding: "0 4px",
            borderRadius: "999px",
            background: "#ef4444",
            color: "#fff",
            border: "2px solid var(--background)",
            fontSize: "10px",
            fontWeight: 700,
            lineHeight: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {activeFilterCount}
          </span>
        )}
      </button>

      <FilterDesktop
        mounted={desktopMounted}
        visible={desktopVisible}
        onClose={closeDesktop}
        hasFilter={hasFilter}
        date={date}
        onSelectDate={setDate}
        selectedDepts={selectedDepts}
        onToggleDept={toggleDept}
        searchColumns={availableSearchColumns}
        selectedSearchColumn={selectedSearchColumn}
        onSelectSearchColumn={showSearchColumnFilter ? handleSelectSearchColumn : undefined}
        hideDepartments={hideDepartments}
      />

      <FilterSheet
        mounted={sheetMounted}
        visible={sheetVisible}
        onClose={closeSheet}
        hasFilter={hasFilter}
        date={date}
        onSelectDate={setDate}
        selectedDepts={selectedDepts}
        onToggleDept={toggleDept}
        searchColumns={availableSearchColumns}
        selectedSearchColumn={selectedSearchColumn}
        onSelectSearchColumn={showSearchColumnFilter ? handleSelectSearchColumn : undefined}
        hideDepartments={hideDepartments}
      />
    </>
  )
}

// ── Default export dibungkus Suspense ─────────────────────────────────────
export default function TopbarFilter(props: Props) {
  return (
    <Suspense fallback={
      <button
        disabled
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 0, width: "36px", height: "36px", borderRadius: "8px",
          border: "1px solid var(--border)",
          background: "transparent",
          color: "var(--muted-foreground)",
          opacity: 0.4, fontSize: "13px",
          fontFamily: "inherit", fontWeight: 500,
          cursor: "not-allowed", flexShrink: 0,
        }}
        aria-label="Filter"
        title="Filter"
      >
        <SlidersHorizontal size={14} />
      </button>
    }>
      <TopbarFilterInner {...props} />
    </Suspense>
  )
}
