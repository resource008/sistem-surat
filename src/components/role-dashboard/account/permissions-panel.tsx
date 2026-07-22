import { KeyRound } from "lucide-react"
import { USER_PERMISSION_GROUPS } from "@/constants/user"
import type { User } from "@/domain/user/types"
import { PermissionBadge } from "./permission-badge"

type PermissionsPanelProps = {
  user: User
}

export function PermissionsPanel({ user }: PermissionsPanelProps) {
  return (
    <div className="mt-4 w-full overflow-hidden rounded-xl border border-border bg-transparent">
      <div className="flex h-12 items-center gap-2.5 border-b border-border px-5 max-sm:px-4">
        <KeyRound size={16} className="text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">Hak Akses</span>
      </div>

      <div className="px-5 py-3 max-sm:px-4">
        <div className="flex flex-col gap-3">
          {USER_PERMISSION_GROUPS.map((group, groupIndex) => (
            <div key={group.label ?? `group-${groupIndex}`} className="flex flex-col">
              {group.items.map(({ key, label, parent }) => (
                <div
                  key={key}
                  className={[
                    "flex items-center justify-between gap-4 border-b border-border/70 py-2.5 last:border-0",
                    parent ? "" : "pl-4",
                  ].join(" ")}
                >
                  <span className={parent ? "text-[13px] font-medium text-foreground" : "text-[13px] text-muted-foreground"}>
                    {label}
                  </span>
                  <PermissionBadge active={user.permissions?.[key] ?? false} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
