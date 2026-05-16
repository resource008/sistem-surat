// src/services/user-service.ts

import { UserRepository } from "@/infrastructure/repositories/user-repositories"
import type { CreateUserInput } from "@/app/validation/user"

const repository = new UserRepository()

export async function createUser(input: CreateUserInput) {
  const existingUsername = await repository.findByUsername(input.username)
  if (existingUsername) throw new Error("CONFLICT: Username sudah dipakai")

  const existingEmail = await repository.findByEmail(input.email)
  if (existingEmail) throw new Error("CONFLICT: Email sudah dipakai")

  return repository.create(input)
}