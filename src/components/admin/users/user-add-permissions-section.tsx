import { USER_PERMISSION_GROUPS } from "@/constants/user"
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
  function updatePermission(key: keyof UserPermissions, value: boolean) {
    if (key === "canViewDataSurat" && !value) {
      onPermissionsChange({
        ...permissions,
        canViewDataSurat: false,
      })
      return
    }

    onPermissionsChange({
      ...permissions,
      canViewDataSurat: key === "canCreate" || key === "canEdit" || key === "canDelete"
        ? permissions.canViewDataSurat || value
        : permissions.canViewDataSurat,
      [key]: value,
    })
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-background">
      <div className="flex items-center gap-2.5 border-b border-border/50 px-6 py-4">
        <KeyRound size={16} className="text-muted-foreground" />
        <span className="text-sm font-semibold">Hak Akses</span>
      </div>
      <div className="px-6 py-5">
        <div className="flex w-full flex-col gap-4">
          {USER_PERMISSION_GROUPS.map((group, groupIndex) => (
            <div key={group.label ?? `group-${groupIndex}`} className="flex flex-col">
              {group.items.map(({ key, label, parent }) => {
                const disabled = group.label === "Data Surat"
                  && !parent
                  && !permissions.canViewDataSurat

                return (
                <div
                  key={key}
                  className={[
                    "flex items-center justify-between gap-5 border-b border-border/30 py-2.5 last:border-0",
                    parent ? "" : "pl-4",
                    disabled ? "opacity-55" : "",
                  ].join(" ")}
                >
                  <span className={parent ? "text-sm font-medium text-foreground" : "text-sm text-muted-foreground"}>
                    {label}
                  </span>
                  <PermissionToggle
                    value={permissions[key]}
                    disabled={disabled}
                    onChange={(value) => updatePermission(key, value)}
                  />
                </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
