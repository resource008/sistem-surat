import type { UserPermissions } from "@/domain/user/types"

// Default permission saat user baru dibuat
export function getDefaultPermission(role: string): UserPermissions {
  switch (role) {
    case "ADMIN":
      return { canViewDataSurat: true,  canCreate: true,  canEdit: true,  canDelete: true,  canPrint: true,  canTrack: true  }
    case "STAFF":
      return { canViewDataSurat: true,  canCreate: true,  canEdit: true,  canDelete: false, canPrint: true,  canTrack: false }
    case "PKL":
      return { canViewDataSurat: false, canCreate: false, canEdit: false, canDelete: false, canPrint: false, canTrack: false }
    default:
      return { canViewDataSurat: false, canCreate: false, canEdit: false, canDelete: false, canPrint: false, canTrack: false }
  }
}
