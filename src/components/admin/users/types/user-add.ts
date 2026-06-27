import type { UserPermissions, UserRole } from "@/domain/user/types"

export type UserAddRole = UserRole

export type UserAddFormState = {
  name: string
  email: string
  username: string
  password: string
  role: UserAddRole
}

export const EMPTY_USER_FORM: UserAddFormState = {
  name: "",
  email: "",
  username: "",
  password: "",
  role: "STAFF",
}

export const DISABLED_PERMISSIONS: UserPermissions = {
  canCreate: false,
  canEdit: false,
  canDelete: false,
  canPrint: false,
  canTrack: false,
}
