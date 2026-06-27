"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

type DepartmentOption = {
  id: string
  shortName: string
}

interface DeptFieldProps {
  selected: string[]
  onToggle: (dept: string) => void
  maxHeight?: number
}

export function DeptField({ selected, onToggle, maxHeight = 200 }: DeptFieldProps) {
  const [departments, setDepartments] = useState<DepartmentOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function loadDepartments() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/admin/dept")
        const json = await res.json().catch(() => null)
        if (!res.ok) throw new Error(json?.error ?? "Gagal mengambil departemen")
        if (!ignore) setDepartments(Array.isArray(json) ? json : [])
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Gagal mengambil departemen")
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadDepartments()
    return () => {
      ignore = true
    }
  }, [])

  function getSelectedValue(dept: DepartmentOption) {
    if (selected.includes(dept.id)) return dept.id
    if (selected.includes(dept.shortName)) return dept.shortName
    return dept.id
  }

  function isSelected(dept: DepartmentOption) {
    return selected.includes(dept.id) || selected.includes(dept.shortName)
  }

  function renderContent() {
    if (loading) {
      return (
        <div className="space-y-2 px-3 py-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="size-3 rounded" />
            </div>
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <div className="px-3 py-2 text-[12px] text-red-500">
          {error}
        </div>
      )
    }

    if (departments.length === 0) {
      return (
        <div className="px-3 py-2 text-[12px] text-muted-foreground">
          Belum ada departemen
        </div>
      )
    }

    return departments.map((dept) => {
      const checked = isSelected(dept)
      return (
        <button
          key={dept.id}
          onClick={() => onToggle(getSelectedValue(dept))}
          className={`dept-item-tf${checked ? " sel" : ""}`}
        >
          <span>{dept.shortName}</span>
          {checked && (
            <span style={{ display: "flex", flexShrink: 0 }}>
              <Check size={14} />
            </span>
          )}
        </button>
      )
    })
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
        {renderContent()}
      </div>
    </div>
  )
}
