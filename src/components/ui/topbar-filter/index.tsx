"use client"

import { SlidersHorizontal } from "lucide-react"
import { useFilter } from "./use-filter"
import { usePanel } from "./use-panel"
import { FilterDesktop } from "./filter-desktop"
import { FilterSheet } from "./filter-sheet"

export default function TopbarFilter({ onFilterChange }: { onFilterChange?: any }) {
  const {
    date, setDate,
    selectedDepts, toggleDept,
    hasFilter, reset,
  } = useFilter(onFilterChange)

  const {
    isMobile,
    desktopMounted, desktopVisible, closeDesktop,
    sheetMounted, sheetVisible, closeSheet,
    handleTriggerClick,
  } = usePanel()

  function handleReset() {
    reset(isMobile ? closeSheet : closeDesktop)
  }

  return (
    <>
      {/* Tombol trigger */}
      <button
        onClick={handleTriggerClick}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "0 12px", height: "34px", borderRadius: "8px",
          border: `1px solid ${hasFilter ? "#2563eb" : "var(--border)"}`,
          background: hasFilter ? "#2563eb" : "transparent",
          color: hasFilter ? "#ffffff" : "var(--muted-foreground)",
          cursor: "pointer", fontSize: "13px", fontFamily: "inherit",
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

      {/* Desktop sidebar */}
      <FilterDesktop
        mounted={desktopMounted}
        visible={desktopVisible}
        onClose={closeDesktop}
        onReset={handleReset}
        hasFilter={hasFilter}
        date={date}
        onSelectDate={setDate}
        selectedDepts={selectedDepts}
        onToggleDept={toggleDept}
      />

      {/* Mobile bottom sheet */}
      <FilterSheet
        mounted={sheetMounted}
        visible={sheetVisible}
        onClose={closeSheet}
        onReset={handleReset}
        hasFilter={hasFilter}
        date={date}
        onSelectDate={setDate}
        selectedDepts={selectedDepts}
        onToggleDept={toggleDept}
      />
    </>
  )
}