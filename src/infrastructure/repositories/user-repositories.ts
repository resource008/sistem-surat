import type { UserRepository } from "@/domain/user/repositories"
import type {
  CreateUserInput,
  GetUsersQuery,
  PaginatedUsers,
  UpdateUserInput,
  User,
  UserRole,
} from "@/domain/user/types"
import {
  createUser,
  deleteUser,
  updateUser,
} from "@/infrastructure/repositories/user/mutations"
import {
  countUsersByRole,
  findAllUsers,
  findUserByEmail,
  findUserById,
  findUserByUsername,
} from "@/infrastructure/repositories/user/reads"

export class PrismaUserRepository implements UserRepository {
  async findAll(query: GetUsersQuery): Promise<PaginatedUsers> {
    return findAllUsers(query)
  }

  async findById(id: string): Promise<User | null> {
    return findUserById(id)
  }

  async findByEmail(email: string): Promise<User | null> {
    return findUserByEmail(email)
  }

  async findByUsername(username: string): Promise<User | null> {
    return findUserByUsername(username)
  }

  async countByRole(role: UserRole): Promise<number> {
    return countUsersByRole(role)
  }

  async create(input: CreateUserInput): Promise<User> {
    return createUser(input)
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    return updateUser(id, input)
  }

  async delete(id: string): Promise<void> {
    await deleteUser(id)
  }
}
