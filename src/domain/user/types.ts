// ============================================================
// src/domain/user/types.ts
// ============================================================

export type UserRole = "ADMIN" | "STAFF" | "PKL"

export interface UserPermissions {
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
  image:       string | null
  role:        UserRole
  createdAt:   Date
  updatedAt:   Date
  lastLogin:   Date | null
  status:      "Sedang Aktif" | "Tidak Aktif"
  permissions: UserPermissions | null
}

export interface CreateUserInput {
  name:     string
  email:    string
  username: string
  password: string
  role:     UserRole
}

export type UpdateUserInput = {
  name?:        string
  email?:       string
  username?:    string
  image?:       string
  role?:        UserRole
  password?:    string
  permissions?: Partial<UserPermissions>  // ← pastikan 'permissions' bukan 'permission'
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