import type { UserPermissions, UserRole } from "@/domain/user/types"

export type UserEditFormState = {
  name: string
  email: string
  username: string
  role: UserRole
  password: string
}

export const EMPTY_USER_EDIT_FORM: UserEditFormState = {
  name: "",
  email: "",
  username: "",
  role: "STAFF",
  password: "",
}

export const EMPTY_USER_PERMISSIONS: UserPermissions = {
  canViewDataSurat: false,
  canCreate: false,
  canEdit: false,
  canDelete: false,
  canPrint: false,
  canTrack: false,
}
