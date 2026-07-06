import { USER_PERMISSION_LABELS } from "@/constants/user"
import type { UserPermissions } from "@/domain/user/types"
import { KeyRound } from "lucide-react"
import { PermissionToggle } from "./permission-toggle"

type UserAddPermissionsSectionProps = {
  permissions: UserPermissions
  onPermissionsChange: (permissions: UserPermissions) => void
}

export function UserAddPermissionsSection({
  permissions,
  onPermissionsChange,
}: UserAddPermissionsSectionProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-background">
      <div className="flex items-center gap-2.5 border-b border-border/50 px-6 py-4">
        <KeyRound size={16} className="text-muted-foreground" />
        <span className="text-sm font-semibold">Hak Akses</span>
      </div>
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {USER_PERMISSION_LABELS.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between border-b border-border/30 py-2 last:border-0 sm:[&:nth-last-child(2)]:border-0"
            >
              <span className="text-sm text-muted-foreground">{label}</span>
              <PermissionToggle
                value={permissions[key]}
                onChange={(value) => {
                  onPermissionsChange({ ...permissions, [key]: value })
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
