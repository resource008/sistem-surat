"use client"

import { Input } from "@/components/ui/input"

type AccountFieldProps = {
  label: string
  value: string
  editable?: boolean
  type?: string
  onChange?: (value: string) => void
}

export function AccountField({
  label,
  value,
  editable,
  type = "text",
  onChange,
}: AccountFieldProps) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] font-medium text-muted-foreground">
      {label}
      {editable ? (
        <Input
          type={type}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          className="h-10 rounded-xl border-border bg-transparent px-3.5 text-[13px] font-semibold text-foreground shadow-none"
        />
      ) : (
        <div className="flex h-10 items-center rounded-xl border border-border bg-transparent px-3.5 text-[13px] font-semibold text-foreground">
          <span className="min-w-0 truncate">{value || "-"}</span>
        </div>
      )}
    </label>
  )
}
