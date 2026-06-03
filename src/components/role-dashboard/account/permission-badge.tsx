type PermissionBadgeProps = {
  active: boolean
}

export function PermissionBadge({ active }: PermissionBadgeProps) {
  return (
    <span
      className={[
        "rounded-full border px-2.5 py-1 text-xs font-semibold select-none",
        active
          ? "border-emerald-500/30 text-emerald-500"
          : "border-border text-muted-foreground",
      ].join(" ")}
    >
      {active ? "Aktif" : "Nonaktif"}
    </span>
  )
}
