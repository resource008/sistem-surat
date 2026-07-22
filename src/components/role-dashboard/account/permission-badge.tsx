type PermissionBadgeProps = {
  active: boolean
}

export function PermissionBadge({ active }: PermissionBadgeProps) {
  return (
    <span
      role="switch"
      aria-checked={active}
      aria-label={active ? "Akses aktif" : "Akses nonaktif"}
      className={[
        "relative inline-flex h-6 w-[42px] shrink-0 items-center rounded-full border px-1 select-none transition-colors",
        active
          ? "border-primary bg-primary"
          : "border-border bg-muted",
      ].join(" ")}
    >
      <span
        className={[
          "absolute left-2 text-[10px] font-semibold leading-none",
          active ? "text-primary-foreground" : "text-muted-foreground",
        ].join(" ")}
      >
        I
      </span>
      <span
        className={[
          "absolute right-2 text-[10px] font-semibold leading-none",
          active ? "text-primary-foreground/70" : "text-foreground",
        ].join(" ")}
      >
        O
      </span>
      <span
        className={[
          "relative z-10 size-[17px] rounded-full shadow-sm transition-transform",
          active
            ? "translate-x-[17px] bg-primary-foreground"
            : "translate-x-0 bg-background",
        ].join(" ")}
      />
    </span>
  )
}
