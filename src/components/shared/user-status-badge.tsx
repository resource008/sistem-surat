import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type UserStatusBadgeProps = {
  status?: string | null
  className?: string
}

export function UserStatusBadge({ status, className }: UserStatusBadgeProps) {
  const normalized = status?.trim().toLowerCase()
  const active = normalized === "online" || normalized === "sedang aktif"
  const label = active
    ? "Online"
    : normalized === "offline" || normalized === "tidak aktif" || !status
      ? "Offline"
      : status

  return (
    <Badge
      variant="outline"
      className={cn(
        active
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          : "border-slate-500/30 bg-slate-500/10 text-slate-400",
        className
      )}
    >
      {label}
    </Badge>
  )
}
