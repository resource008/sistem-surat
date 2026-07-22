"use client"

import { cn } from "@/lib/utils"

type PermissionToggleProps = {
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}

export function PermissionToggle({ value, onChange, disabled }: PermissionToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      disabled={disabled}
      aria-label={value ? "Akses aktif" : "Akses nonaktif"}
      onClick={() => onChange(!value)}
      className={cn(
        "relative inline-flex h-6 w-[42px] shrink-0 items-center rounded-full border px-1",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        value
          ? "border-primary bg-primary"
          : "border-border bg-muted",
        disabled && "cursor-not-allowed opacity-55"
      )}
    >
      <span className={cn(
        "absolute left-2 text-[10px] font-semibold leading-none",
        value ? "text-primary-foreground" : "text-muted-foreground"
      )}>
        I
      </span>
      <span className={cn(
        "absolute right-2 text-[10px] font-semibold leading-none",
        value ? "text-primary-foreground/70" : "text-foreground"
      )}>
        O
      </span>
      <span
        className={cn(
          "relative z-10 size-[17px] rounded-full shadow-sm transition-transform",
          value
            ? "translate-x-[17px] bg-primary-foreground"
            : "translate-x-0 bg-background"
        )}
      />
    </button>
  )
}
