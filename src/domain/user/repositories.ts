// ============================================================
// src/domain/user/repositories.ts
// Interface (kontrak) repository — diimplementasi di infrastructure
// ============================================================

import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  GetUsersQuery,
  PaginatedUsers,
} from "./types"

export interface UserRepository {
  findAll(query: GetUsersQuery): Promise<PaginatedUsers>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  create(input: CreateUserInput): Promise<User>
  update(id: string, input: UpdateUserInput): Promise<User>
  delete(id: string): Promise<void>
}