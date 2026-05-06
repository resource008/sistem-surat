// components/filters/index.tsx
"use client"

import { Suspense }          from "react"
import { SlidersHorizontal } from "lucide-react"
import { useFilter }         from "@/hooks/use-filter"
import { usePanel }          from "@/hooks/use-panel"
import { FilterDesktop }     from "./filter-desktop"
import { FilterSheet }       from "./filter-sheet"

type Props = {
  initialFilters?: { date: string | null; departments: string[] }
  onFilterChange?: (f: { date: string | null; departments: string[] }) => void
  disabled?: boolean
}

// ── Inner component (yang pakai useSearchParams via useFilter) ────────────
function TopbarFilterInner({ initialFilters, onFilterChange, disabled }: Props) {
  const {
    date, setDate,
    selectedDepts, toggleDept,
    hasFilter, reset,
  } = useFilter(onFilterChange, initialFilters)

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
          display: "flex", alignItems: "center", gap: "6px",
          padding: "0 12px", height: "34px", borderRadius: "8px",
          border: `1px solid ${hasFilter ? "#2563eb" : "var(--border)"}`,
          background: hasFilter ? "#2563eb" : "transparent",
          color: hasFilter ? "#ffffff" : "var(--muted-foreground)",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.4 : 1,
          fontSize: "13px", fontFamily: "inherit",
          fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0,
          transition: "all 0.2s ease",
        }}
      >
        <SlidersHorizontal size={14} />
        Filter
        {hasFilter && (
          <span style={{
            background: "rgba(255,255,255,0.25)", color: "#fff",
            fontSize: "10px", fontWeight: 700,
            padding: "1px 6px", borderRadius: "10px",
          }}>
            {(date ? 1 : 0) + selectedDepts.length}
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
          display: "flex", alignItems: "center", gap: "6px",
          padding: "0 12px", height: "34px", borderRadius: "8px",
          border: "1px solid var(--border)",
          background: "transparent",
          color: "var(--muted-foreground)",
          opacity: 0.4, fontSize: "13px",
          fontFamily: "inherit", fontWeight: 500,
          cursor: "not-allowed", flexShrink: 0,
        }}
      >
        <SlidersHorizontal size={14} />
        Filter
      </button>
    }>
      <TopbarFilterInner {...props} />
    </Suspense>
  )
}