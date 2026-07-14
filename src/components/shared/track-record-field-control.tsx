"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/shared/form-controls"
import { cn } from "@/lib/utils"
import type { TrackField } from "@/types"

type TrackRecordFieldControlProps = {
  className?: string
  disabled?: boolean
  field: TrackField
  inputId: string
  maxLength: number
  onChange: (value: string) => void
  value: string
}

function getDefaultSuffix(field: TrackField) {
  if (field.type === "date" || field.type === "category") return ""
  return field.defaultValue.trim()
}

function valueEndsWithSuffix(value: string, suffix: string) {
  return value.trim().toLowerCase().endsWith(suffix.toLowerCase())
}

export function TrackRecordFieldControl({
  className,
  disabled = false,
  field,
  inputId,
  maxLength,
  onChange,
  value,
}: TrackRecordFieldControlProps) {
  if (field.type === "date") {
    return (
      <DatePicker
        id={inputId}
        value={value}
        onChange={onChange}
        className={className}
        placeholder={field.defaultValue || "Pilih tanggal"}
        disabled={disabled}
        surface="light"
      />
    )
  }

  if (field.type === "category" && field.categoryOptions.length > 0) {
    return (
      <Select value={value || undefined} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id={inputId}
          className={cn("h-10 w-full rounded-lg border-neutral-200 bg-white text-sm text-neutral-900 shadow-none hover:bg-white focus-visible:ring-blue-200", className)}
        >
          <SelectValue placeholder={field.defaultValue || "Pilih kategori"} />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="rounded-lg bg-white p-1 text-black">
          {field.categoryOptions.map((option) => (
            <SelectItem
              key={`${field.id}-${option}`}
              value={option}
              className="rounded-md px-3 py-2 text-sm"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  const defaultSuffix = getDefaultSuffix(field)
  const showDefaultSuffix = Boolean(
    defaultSuffix
    && value.trim()
    && !valueEndsWithSuffix(value, defaultSuffix)
  )

  return (
    <div className="relative">
      <Input
        id={inputId}
        type="text"
        inputMode={field.type === "number" ? "decimal" : "text"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Isi data"
        disabled={disabled}
        maxLength={maxLength}
        className={cn(
          "h-10 rounded-lg border-input bg-background text-sm text-foreground shadow-sm placeholder:text-muted-foreground",
          showDefaultSuffix ? "pr-24" : "",
          className
        )}
      />
      {showDefaultSuffix ? (
        <span className="pointer-events-none absolute right-3 top-1/2 max-w-[40%] -translate-y-1/2 truncate text-sm font-medium text-muted-foreground">
          {defaultSuffix}
        </span>
      ) : null}
    </div>
  )
}
