import type { Role } from "@/types"
import type { UserPermissions } from "@/domain/user/types"

// Default permission saat user baru dibuat
export function getDefaultPermission(role: Role): UserPermissions {
  switch (role) {
    case "ADMIN":
      return { canCreate: true,  canEdit: true,  canDelete: true,  canPrint: true,  canTrack: true  }
    case "STAFF":
      return { canCreate: true,  canEdit: true,  canDelete: false, canPrint: true,  canTrack: false }
    case "PKL":
      return { canCreate: false, canEdit: false, canDelete: false, canPrint: false, canTrack: false }
    default:
      return { canCreate: false, canEdit: false, canDelete: false, canPrint: false, canTrack: false }
  }
}