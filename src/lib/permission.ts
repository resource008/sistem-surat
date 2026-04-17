export enum Role {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  PKL   = "PKL",
  GUEST = "GUEST",
}

export const permissions = {
  [Role.ADMIN]: {
    canView:   true,
    canCreate: true,
    canEdit:   true,
    canDelete: true,
  },
  [Role.STAFF]: {
    canView:   true,
    canCreate: true,
    canEdit:   true,
    canDelete: false,  // ← sesuaikan kebutuhan
  },
  [Role.PKL]: {
    canView:   true,
    canCreate: false,  // ← PKL hanya bisa lihat
    canEdit:   false,
    canDelete: false,
  },
  [Role.GUEST]: {
    canView:   false,
    canCreate: false,
    canEdit:   false,
    canDelete: false,
  },
}

export function getPermission(role: string) {
  return permissions[role as Role] ?? permissions[Role.GUEST]
}