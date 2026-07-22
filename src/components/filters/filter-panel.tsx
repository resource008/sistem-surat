"use client"

import { DateField } from "./date-field"
import { DeptField } from "./dept-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { DataSuratSearchColumn } from "@/components/surat/data-surat/topbar-search"

interface FilterPanelProps {
  date: Date | undefined
  onSelectDate: (d: Date | undefined) => void
  selectedDepts: string[]
  onToggleDept: (dept: string) => void
  searchColumns?: DataSuratSearchColumn[]
  selectedSearchColumn?: string
  onSelectSearchColumn?: (column: string) => void
  hideDepartments?: boolean
  hideDate?: boolean
  isMobile?: boolean
}

export function FilterPanel({
  date, onSelectDate,
  selectedDepts, onToggleDept,
  searchColumns = [],
  selectedSearchColumn,
  onSelectSearchColumn,
  hideDepartments,
  hideDate,
  isMobile,
}: FilterPanelProps) {
  return (
    <div style={{ padding: "16px" }}>
      {searchColumns.length > 0 && onSelectSearchColumn && (
        <div className="mb-4">
          <label className="mb-2 block text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
            Kolom Pencarian
          </label>
          <Select
            value={selectedSearchColumn}
            onValueChange={onSelectSearchColumn}
          >
            <SelectTrigger className="h-10 w-full border-border/70 bg-background px-3">
              <SelectValue placeholder="Pilih kolom" />
            </SelectTrigger>
            <SelectContent
              align="start"
              position="popper"
              className="z-[1002] w-[var(--radix-select-trigger-width)] rounded-lg border border-border bg-popover p-0 shadow-md"
            >
              {searchColumns.map((column) => (
                <SelectItem
                  key={column.id}
                  value={column.id}
                  className="min-h-8 rounded-none px-2 py-1.5 text-sm focus:bg-blue-50 focus:text-foreground data-[state=checked]:text-foreground dark:focus:bg-slate-800 dark:focus:text-white dark:data-[state=checked]:text-white [&_svg]:text-current"
                >
                  {column.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {!hideDate && <DateField date={date} onSelect={onSelectDate} />}
      {!hideDepartments && (
        <DeptField
          selected={selectedDepts}
          onToggle={onToggleDept}
          maxHeight={isMobile ? 240 : 200}
        />
      )}
    </div>
  )
}
