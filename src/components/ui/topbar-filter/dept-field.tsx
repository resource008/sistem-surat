"use client"

import { Check } from "lucide-react"

// ← Sesuaikan dengan DEPT_LIST di _types.ts
const DEPARTMENTS = [
  "HRD", "ENG", "IAD", "BPA", "GIS", "SND",
  "MD", "PS", "FAD", "ITD", "ESD", "LCA",
  "SMD", "ERP", "CID", "Medical",
]

interface DeptFieldProps {
  selected: string[]
  onToggle: (dept: string) => void
  maxHeight?: number
}

export function DeptField({ selected, onToggle, maxHeight = 200 }: DeptFieldProps) {
  const allSelected = DEPARTMENTS.every(d => selected.includes(d))

  function handleToggleAll() {
    if (allSelected) {
      // deselect semua
      DEPARTMENTS.forEach(d => {
        if (selected.includes(d)) onToggle(d)
      })
    } else {
      // select semua yang belum terpilih
      DEPARTMENTS.forEach(d => {
        if (!selected.includes(d)) onToggle(d)
      })
    }
  }

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: `
        .dept-scroll-tf::-webkit-scrollbar { width: 4px; }
        .dept-scroll-tf::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
        .dept-item-tf {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 9px 12px; border: none; cursor: pointer;
          font-size: 13px; font-family: inherit; border-radius: 8px;
          background: transparent; color: var(--foreground);
          transition: background-color 0.15s ease;
          text-align: left;
        }
        .dept-item-tf:hover { background: var(--muted); }
        .dept-item-tf.sel { font-weight: 600; }
      ` }} />

      <label style={{
        display: "block", fontSize: 11, fontWeight: 700,
        color: "var(--muted-foreground)", letterSpacing: "0.06em",
        textTransform: "uppercase", marginBottom: "8px",
      }}>
        Departemen
      </label>

      <div
        className="dept-scroll-tf"
        style={{
          maxHeight, overflowY: "auto",
          borderRadius: "10px", padding: "4px",
          border: "1px solid var(--border)",
        }}
      >

        {DEPARTMENTS.map((dept) => {
          const isSelected = selected.includes(dept)
          return (
            <button
              key={dept}
              onClick={() => onToggle(dept)}
              className={`dept-item-tf${isSelected ? " sel" : ""}`}
            >
              <span>{dept}</span>
              {isSelected && (
                <span style={{ display: "flex", flexShrink: 0 }}>
                  <Check size={14} />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}