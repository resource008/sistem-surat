// ============================================================
// src/domain/user/types.ts
// ============================================================

export type UserRole = string
export type DashboardRole = "STAFF" | "PKL"

export interface UserPermissions {
  canViewDataSurat: boolean
  canCreate: boolean
  canEdit:   boolean
  canDelete: boolean
  canPrint:  boolean
  canTrack:  boolean
}

export interface User {
  id:          string
  name:        string
  email:       string
  username:    string
  role:        UserRole
  createdAt:   Date
  updatedAt:   Date
  lastLogin:   Date | null
  status:      "Online" | "Offline"
  permissions: UserPermissions | null
}

export interface CreateUserInput {
  name:         string
  email:        string
  username:     string
  password:     string
  role:         UserRole
  permissions?: Partial<UserPermissions>
}

export type UpdateUserInput = {
  name?:        string
  email?:       string
  username?:    string
  role?:        UserRole
  password?:    string
  permissions?: Partial<UserPermissions>
}

export interface GetUsersQuery {
  page:    number
  limit:   number
  search?: string
  role?:   UserRole
}

export interface PaginatedUsers {
  data: User[]
  meta: {
    total:      number
    page:       number
    limit:      number
    totalPages: number
  }
}
