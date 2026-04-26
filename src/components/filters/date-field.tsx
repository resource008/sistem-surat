"use client"

import { Calendar } from "@/components/ui/calendar"
import { id } from "date-fns/locale"

interface DateFieldProps {
  date:     Date | undefined
  onSelect: (d: Date | undefined) => void
}

export function DateField({ date, onSelect }: DateFieldProps) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 700,
        color: "var(--muted-foreground)", letterSpacing: "0.06em",
        textTransform: "uppercase", marginBottom: "8px",
      }}>
        Tanggal
      </label>
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          locale={id}
          className="w-full"
        />
      </div>
    </div>
  )
}