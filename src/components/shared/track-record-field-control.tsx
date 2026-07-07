"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/shared/form-controls"
import type { TrackField } from "@/types"

type TrackRecordFieldControlProps = {
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
          className="h-10 w-full rounded-lg border-input bg-background text-sm text-foreground shadow-sm"
        >
          <SelectValue placeholder={field.defaultValue || "Pilih kategori"} />
        </SelectTrigger>
        <SelectContent align="start" position="popper">
          {field.categoryOptions.map((option) => (
            <SelectItem key={`${field.id}-${option}`} value={option}>
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
      className="h-10 rounded-lg border-input bg-background text-sm text-foreground shadow-sm placeholder:text-muted-foreground"
    />
  )
}
