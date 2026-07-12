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

function getInputType(field: TrackField) {
  if (field.type === "number") return "number"
  return "text"
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
        value={value}
        onChange={onChange}
        className={className}
        placeholder={field.defaultValue || "Pilih tanggal"}
        disabled={disabled}
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

  return (
    <Input
      id={inputId}
      type={getInputType(field)}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={field.defaultValue || "Isi data"}
      disabled={disabled}
      maxLength={maxLength}
      className={cn("h-10 rounded-lg border-input bg-background text-sm text-foreground shadow-sm placeholder:text-muted-foreground", className)}
    />
  )
}
