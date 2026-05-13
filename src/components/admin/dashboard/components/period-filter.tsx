import { Button } from "@/components/ui/button"
import { PERIOD_OPTIONS } from "../constants"
import { Period } from "../types"

interface PeriodFilterProps {
  value: Period
  onChange: (v: Period) => void
}

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
      {PERIOD_OPTIONS.map((opt) => (
        <Button
          key={opt.value}
          size="sm"
          variant={value === opt.value ? "default" : "ghost"}
          className={`h-7 px-3 text-xs font-medium transition-all ${
            value === opt.value
              ? "shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  )
}