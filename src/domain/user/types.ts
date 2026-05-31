// ============================================================
// src/domain/user/types.ts
// Tipe-tipe domain untuk User — tidak bergantung pada Prisma
// ============================================================

export type UserRole = "ADMIN" | "STAFF" | "PKL"

// User lengkap seperti yang disimpan di DB (tanpa password)
export interface User {
  id:        string
  name:      string
  email:     string
  username:  string
  role:      UserRole
  createdAt: Date
  updatedAt: Date
}

// Input untuk membuat user baru
export interface CreateUserInput {
  name:     string
  email:    string
  username: string
  password: string
  role:     UserRole
}

// Input untuk update — semua opsional kecuali minimal 1 harus ada
export interface UpdateUserInput {
  name?:     string
  email?:    string
  username?: string
  password?: string
  role?:     UserRole
}

// Query params untuk list user
export interface GetUsersQuery {
  page:    number
  limit:   number
  search?: string
  role?:   UserRole
}

// Response paginated
export interface PaginatedUsers {
  data: User[]
  meta: {
    total:      number
    page:       number
    limit:      number
    totalPages: number
  }
}