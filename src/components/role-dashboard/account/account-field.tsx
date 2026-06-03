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
    <label className="flex flex-col gap-2 text-[14px] font-medium text-muted-foreground max-sm:text-[14px]">
      {label}
      {editable ? (
        <Input
          type={type}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          className="h-11 rounded-2xl border-border bg-transparent px-4 text-[14px] font-semibold text-foreground shadow-none max-sm:h-10 max-sm:text-[14px]"
        />
      ) : (
        <div className="flex h-11 items-center rounded-2xl border border-border bg-transparent px-4 text-[14px] font-semibold text-foreground max-sm:h-10 max-sm:text-[14px]">
          <span className="min-w-0 truncate">{value || "-"}</span>
        </div>
      )}
    </label>
  )
}
