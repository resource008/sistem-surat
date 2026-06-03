// ============================================================
// src/domain/user/use-cases.ts
// Business logic murni — tidak tahu tentang HTTP, Prisma, dll
// ============================================================

import { AppError }         from "@/lib/errors"
import type { UserRepository }  from "./repositories"
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  GetUsersQuery,
  PaginatedUsers,
} from "./types"

export class UserUseCases {
  constructor(private readonly repo: UserRepository) {}

  // ── GET ALL ──────────────────────────────────────────────

  async getAll(query: GetUsersQuery): Promise<PaginatedUsers> {
    return this.repo.findAll(query)
  }

  // ── GET BY ID ────────────────────────────────────────────

  async getById(id: string): Promise<User> {
    const user = await this.repo.findById(id)
    if (!user) throw new AppError(404, "User tidak ditemukan")
    return user
  }

  // ── CREATE ───────────────────────────────────────────────

  async create(input: CreateUserInput): Promise<User> {
    const [dupUsername, dupEmail] = await Promise.all([
      this.repo.findByUsername(input.username),
      this.repo.findByEmail(input.email),
    ])

    if (dupUsername) throw new AppError(400, "Username sudah dipakai")
    if (dupEmail)    throw new AppError(400, "Email sudah dipakai")

    return this.repo.create(input)
  }

  // ── UPDATE ───────────────────────────────────────────────

  async update(
    id:            string,
    input:         UpdateUserInput,
    currentUserId: string,
  ): Promise<User> {
    const existing = await this.repo.findById(id)
    if (!existing) throw new AppError(404, "User tidak ditemukan")

    // Cek duplikat username (hanya jika berubah)
    if (input.username && input.username !== existing.username) {
      const dup = await this.repo.findByUsername(input.username)
      if (dup) throw new AppError(400, "Username sudah dipakai")
    }

    // Cek duplikat email (hanya jika berubah)
    if (input.email && input.email !== existing.email) {
      const dup = await this.repo.findByEmail(input.email)
      if (dup) throw new AppError(400, "Email sudah dipakai")
    }

    // Admin tidak boleh menurunkan role dirinya sendiri
    if (input.role && currentUserId === id && input.role !== "ADMIN") {
      throw new AppError(400, "Admin tidak bisa mengubah role diri sendiri")
    }

    return this.repo.update(id, input)
  }

  // ── DELETE ───────────────────────────────────────────────

  async delete(id: string, currentUserId: string): Promise<void> {
    if (currentUserId === id) {
      throw new AppError(400, "Admin tidak bisa menghapus akun sendiri")
    }

    const existing = await this.repo.findById(id)
    if (!existing) throw new AppError(404, "User tidak ditemukan")

    return this.repo.delete(id)
  }
}