import type { Role } from "@/types"

export function getPermission(role: Role) {
  switch (role) {
    case "ADMIN":
      return { canCreate: true,  canEdit: true,  canDelete: true,  canPrint: true  }
    case "STAFF":
      return { canCreate: true,  canEdit: true,  canDelete: false, canPrint: true  }
    case "PKL":
      return { canCreate: false, canEdit: false, canDelete: false, canPrint: false }
    default:
      return { canCreate: false, canEdit: false, canDelete: false, canPrint: false }
  }
}