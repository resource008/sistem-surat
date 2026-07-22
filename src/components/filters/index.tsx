// components/filters/index.tsx
"use client"

import { Suspense, useEffect, type CSSProperties } from "react"
import { SlidersHorizontal } from "lucide-react"
import { type FilterMode, type Filters, useFilter } from "@/hooks/use-filter"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { usePanel }          from "@/hooks/use-panel"
import { FilterDesktop }     from "./filter-desktop"
import { FilterPanel }       from "./filter-panel"
import { FilterSheet }       from "./filter-sheet"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
  includeDefaultSearchColumns?: boolean
  hideDate?: boolean
  presentation?: "panel" | "popover"
  embedded?: boolean
}

function normalizeSearchColumnText(value?: string | null) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function getLegacySearchColumnId(column: DataSuratSearchColumn) {
  return `column:${normalizeSearchColumnText(column.label)}`
}

function findRequestedSearchColumn(
  columns: DataSuratSearchColumn[],
  requestedColumn?: string | null
) {
  if (!requestedColumn) return undefined

  return columns.find((column) =>
    column.id === requestedColumn || getLegacySearchColumnId(column) === requestedColumn
  )
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

// ── Inner component (yang pakai useSearchParams via useFilter) ────────────
function TopbarFilterInner({
  initialFilters,
  onFilterChange,
  mode = "surat",
  hideDepartments,
  disabled,
  searchColumns = [],
  showSearchColumnFilter = false,
  includeDefaultSearchColumns = true,
  hideDate,
  presentation = "panel",
  embedded,
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
    const options = new Map<string, DataSuratSearchColumn>()
    if (includeDefaultSearchColumns) {
      DEFAULT_DATA_SURAT_SEARCH_COLUMNS.forEach((column) => options.set(column.id, column))
    }
    searchColumns.forEach((column) => options.set(column.id, column))
    return Array.from(options.values())
  })()
  const requestedSearchColumn = searchParams.get("column")
  const requestedColumnOption = findRequestedSearchColumn(availableSearchColumns, requestedSearchColumn)
  const selectedSearchColumn = requestedColumnOption?.id
  const shouldShowDateFilter = !showSearchColumnFilter || isDateSearchColumn(requestedColumnOption, requestedSearchColumn)
  const effectiveHideDate = hideDate || !shouldShowDateFilter
  const hasColumnFilter = showSearchColumnFilter && Boolean(selectedSearchColumn)
  const visibleDateFilter = !effectiveHideDate && Boolean(date)
  const visibleDepartmentFilterCount = hideDepartments ? 0 : selectedDepts.length
  const hasAnyFilter = visibleDateFilter || visibleDepartmentFilterCount > 0 || hasColumnFilter
  const activeFilterCount = (visibleDateFilter ? 1 : 0) + visibleDepartmentFilterCount + (hasColumnFilter ? 1 : 0)

  useEffect(() => {
    if (!effectiveHideDate || !date) return
    setDate(undefined)
  }, [date, effectiveHideDate, setDate])

  useEffect(() => {
    if (!requestedSearchColumn || !selectedSearchColumn || requestedSearchColumn === selectedSearchColumn) return

    const params = new URLSearchParams(searchParams.toString())
    params.set("column", selectedSearchColumn)
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [pathname, requestedSearchColumn, router, searchParams, selectedSearchColumn])

  function handleSelectSearchColumn(column: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (!showSearchColumnFilter || column === "all") params.delete("column")
    else params.set("column", column)
    const nextColumn = availableSearchColumns.find((item) => item.id === column)
    if (!isDateSearchColumn(nextColumn, column)) {
      params.delete("date")
      setDate(undefined)
    }
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const {
    isMobile,
    desktopMounted, desktopVisible, closeDesktop,
    sheetMounted,   sheetVisible,   closeSheet,
    handleTriggerClick,
  } = usePanel()

  const triggerStyle: CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 0,
    padding: 0,
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: `1px solid ${hasAnyFilter && !embedded ? "#2563eb" : "var(--border)"}`,
    background: hasAnyFilter && !embedded ? "#2563eb" : embedded ? "transparent" : "transparent",
    color: hasAnyFilter && !embedded ? "#ffffff" : "var(--muted-foreground)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    fontSize: "13px", fontFamily: "inherit",
    position: "relative",
    fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0,
    transition: "all 0.2s ease",
  }
  if (embedded && hasAnyFilter) {
    triggerStyle.width = "32px"
  }
  if (embedded) {
    triggerStyle.height = "32px"
    triggerStyle.border = "1px solid transparent"
  }

  const triggerContent = (
    <>
      <SlidersHorizontal size={14} />
      {hasAnyFilter && embedded ? (
        <span style={{
          position: "absolute",
          top: "-5px",
          right: "-5px",
          minWidth: "15px",
          height: "15px",
          padding: "0 3px",
          borderRadius: "999px",
          background: "#ef4444",
          color: "#fff",
          border: "2px solid var(--background)",
          fontSize: "10px",
          fontWeight: 700,
          lineHeight: "11px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {activeFilterCount}
        </span>
      ) : hasAnyFilter ? (
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
      ) : null}
    </>
  )

  if (presentation === "popover") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            disabled={disabled}
            style={triggerStyle}
            className={embedded ? "hover:bg-muted hover:text-foreground dark:hover:bg-muted/60" : undefined}
            aria-label="Filter"
            title="Filter"
          >
            {triggerContent}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={8}
          className="w-[min(360px,calc(100vw-32px))] gap-0 p-0"
        >
          <FilterPanel
            date={date}
            onSelectDate={setDate}
            selectedDepts={selectedDepts}
            onToggleDept={toggleDept}
            searchColumns={availableSearchColumns}
            selectedSearchColumn={selectedSearchColumn}
            onSelectSearchColumn={showSearchColumnFilter ? handleSelectSearchColumn : undefined}
            hideDepartments={hideDepartments}
            hideDate={effectiveHideDate}
          />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <>
      <button
        onClick={disabled ? undefined : handleTriggerClick}
        style={triggerStyle}
        aria-label="Filter"
        title="Filter"
      >
        {triggerContent}
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
        hideDate={effectiveHideDate}
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
        hideDate={effectiveHideDate}
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
