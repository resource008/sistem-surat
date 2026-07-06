import { KeyRound } from "lucide-react"
import { USER_PERMISSION_LABELS } from "@/constants/user"
import type { User } from "@/domain/user/types"
import { PermissionBadge } from "./permission-badge"

type PermissionsPanelProps = {
  user: User
}

export function PermissionsPanel({ user }: PermissionsPanelProps) {
  return (
    <div className="mt-5 w-full overflow-hidden rounded-[20px] border border-border bg-transparent">
      <div className="flex h-16 items-center gap-3 border-b border-border px-8 max-sm:h-14 max-sm:px-5">
        <KeyRound size={18} className="text-muted-foreground" />
        <span className="text-[15px] font-semibold text-foreground">Hak Akses</span>
      </div>

      <div className="px-8 py-5 max-lg:px-6 max-sm:px-5">
        <div className="flex flex-col">
          {USER_PERMISSION_LABELS.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 border-b border-border/70 py-3 last:border-0"
            >
              <span className="text-sm text-muted-foreground">{label}</span>
              <PermissionBadge active={user.permissions?.[key] ?? false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
