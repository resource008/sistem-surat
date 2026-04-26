"use client"

import { DateField } from "./date-field"
import { DeptField } from "./dept-field"

interface FilterPanelProps {
  date: Date | undefined
  onSelectDate: (d: Date | undefined) => void
  selectedDepts: string[]
  onToggleDept: (dept: string) => void
  isMobile?: boolean
}

export function FilterPanel({
  date, onSelectDate,
  selectedDepts, onToggleDept,
  isMobile,
}: FilterPanelProps) {
  return (
    <div style={{ padding: "16px" }}>
      <DateField date={date} onSelect={onSelectDate} />
      <DeptField
        selected={selectedDepts}
        onToggle={onToggleDept}
        maxHeight={isMobile ? 240 : 200}
      />
    </div>
  )
}