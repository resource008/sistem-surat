// ============================================================
// src/services/user-service.ts
// Singleton service — menghubungkan use-cases dengan repository
// ============================================================

import { PrismaUserRepository } from "@/infrastructure/repositories/user-repositories"
import { UserUseCases }         from "@/domain/user/use-cases"

// Satu instance dipakai di seluruh aplikasi (singleton pola)
const userRepository = new PrismaUserRepository()
export const userService = new UserUseCases(userRepository)