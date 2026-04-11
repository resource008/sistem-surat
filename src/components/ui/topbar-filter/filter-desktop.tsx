"use client"

import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { FilterPanel } from "./filter-panel"

interface FilterDesktopProps {
  mounted: boolean
  visible: boolean
  onClose: () => void
  onReset: () => void
  hasFilter: boolean
  date: Date | undefined
  onSelectDate: (d: Date | undefined) => void
  selectedDepts: string[]
  onToggleDept: (dept: string) => void
}

export function FilterDesktop({
  mounted, visible, onClose, onReset, hasFilter,
  date, onSelectDate, selectedDepts, onToggleDept,
}: FilterDesktopProps) {
  if (!mounted) return null

  return createPortal(
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 51,
          background: "rgba(0,0,0,0.35)", backdropFilter: "blur(1px)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Sidebar panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "360px", zIndex: 52,
        background: "var(--popover)",
        borderLeft: "1px solid var(--border)",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
        display: "flex", flexDirection: "column",
        transform: visible ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", height: "56px",
          borderBottom: "1px solid var(--border)", flexShrink: 0,
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>Filter</span>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "8px", background: "transparent", border: "none",
              cursor: "pointer", color: "var(--muted-foreground)",
              transition: "background 0.15s ease, color 0.15s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#ef4444" }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted-foreground)" }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          <FilterPanel
            date={date} onSelectDate={onSelectDate}
            selectedDepts={selectedDepts} onToggleDept={onToggleDept}
          />
        </div>

        {/* Footer */}
        {hasFilter && (
          <div style={{
            flexShrink: 0, padding: "12px 20px 20px",
            borderTop: "1px solid var(--border)",
            display: "flex", gap: "8px",
            background: "var(--popover)",
          }}>
            <button
              onClick={onReset}
              style={{
                flex: 1, padding: "11px", borderRadius: "8px",
                border: "1px solid #fca5a5", background: "#fff1f2",
                color: "#ef4444", fontFamily: "inherit", fontSize: "13px",
                fontWeight: 600, cursor: "pointer", transition: "background 0.15s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#fee2e2")}
              onMouseLeave={e => (e.currentTarget.style.background = "#fff1f2")}
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </>,
    document.body
  )
}