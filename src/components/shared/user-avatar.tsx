import { getAvatarColor, getInitials } from "@/lib/avatar"
import { cn } from "@/lib/utils"

type UserAvatarProps = {
  name: string
  className?: string
}

export function UserAvatar({ name, className }: UserAvatarProps) {
  const displayName = name.trim() || "User"

  return (
    <div
      style={{ backgroundColor: getAvatarColor(displayName) }}
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
        className
      )}
    >
      {getInitials(displayName)}
    </div>
  )
}
