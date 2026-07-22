"use client"

import { useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { FilterPanel } from "./filter-panel"
import type { DataSuratSearchColumn } from "@/components/surat/data-surat/topbar-search"

interface FilterSheetProps {
  mounted: boolean
  visible: boolean
  onClose: () => void
  hasFilter: boolean
  date: Date | undefined
  onSelectDate: (d: Date | undefined) => void
  selectedDepts: string[]
  onToggleDept: (dept: string) => void
  searchColumns?: DataSuratSearchColumn[]
  selectedSearchColumn?: string
  onSelectSearchColumn?: (column: string) => void
  hideDepartments?: boolean
  hideDate?: boolean
}

export function FilterSheet({
  mounted, visible, onClose, hasFilter,
  date, onSelectDate, selectedDepts, onToggleDept,
  searchColumns, selectedSearchColumn, onSelectSearchColumn,
  hideDepartments, hideDate,
}: FilterSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const dragStartY = useRef<number | null>(null)
  const dragCurrentY = useRef<number>(0)

  // Blokir touchmove di luar sheet (iOS Safari)
  useEffect(() => {
    if (!mounted) return
    const prevent = (e: TouchEvent) => {
      if (sheetRef.current?.contains(e.target as Node)) return
      if (e.cancelable) e.preventDefault()
    }
    document.addEventListener("touchmove", prevent, { passive: false })
    return () => document.removeEventListener("touchmove", prevent)
  }, [mounted])

  // Drag to dismiss
  useEffect(() => {
    const el = sheetRef.current
    if (!el || !mounted) return

    function onTouchStart(e: TouchEvent) {
      dragStartY.current = e.touches[0].clientY
      dragCurrentY.current = 0
      el!.style.transition = "none"
    }

    function onTouchMove(e: TouchEvent) {
      if (dragStartY.current === null) return
      const delta = e.touches[0].clientY - dragStartY.current
      if (delta < 0) return
      if (e.cancelable) e.preventDefault()
      dragCurrentY.current = delta
      el!.style.transform = `translateY(${delta}px)`
    }

    function onTouchEnd() {
      el!.style.transition = "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)"
      el!.style.transform = ""
      if (dragCurrentY.current > 120) onClose()
      dragStartY.current = null
      dragCurrentY.current = 0
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true })
    el.addEventListener("touchmove", onTouchMove, { passive: false })
    el.addEventListener("touchend", onTouchEnd)
    return () => {
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchmove", onTouchMove)
      el.removeEventListener("touchend", onTouchEnd)
    }
  }, [mounted])

  if (!mounted) return null

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 998,
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        style={{
          position: "fixed", left: 0, right: 0, bottom: 0,
          zIndex: 999, background: "var(--popover)",
          borderRadius: "20px 20px 0 0",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
          maxHeight: "90dvh", display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px", flexShrink: 0, touchAction: "none" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--border)" }} />
        </div>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 16px 12px", borderBottom: "1px solid var(--border)", flexShrink: 0,
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>Filter</span>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "8px", background: "transparent", border: "none",
              cursor: "pointer", color: "var(--muted-foreground)",
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          <FilterPanel
            date={date} onSelectDate={onSelectDate}
            selectedDepts={selectedDepts} onToggleDept={onToggleDept}
            searchColumns={searchColumns}
            selectedSearchColumn={selectedSearchColumn}
            onSelectSearchColumn={onSelectSearchColumn}
            hideDepartments={hideDepartments}
            hideDate={hideDate}
            isMobile
          />
        </div>

        {/* Footer */}
        {hasFilter && (
          <div style={{
            flexShrink: 0, padding: "12px 16px 16px",
            borderTop: "1px solid var(--border)",
            display: "flex", gap: "8px", background: "var(--popover)",
          }}>
          </div>
        )}
      </div>
    </>,
    document.body
  )
}
