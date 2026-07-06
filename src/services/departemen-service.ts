// src/services/departemen-service.ts

import { DepartemenRepository } from "@/infrastructure/repositories/departemen-repositories"
import type {
  CreateDepartemenInput,
  UpdateDepartemenInput,
} from "@/app/validation/departemen"

const repository = new DepartemenRepository()

export function fetchDepartemen({ includeInactive = false } = {}) {
  return repository.findAll({ includeInactive })
}

export function fetchDepartemenById(id: string, { includeInactive = false } = {}) {
  return repository.findById(id, { includeInactive })
}

export function createDepartemen(input: CreateDepartemenInput) {
  return repository.create(input)
}

export function updateDepartemen(id: string, input: UpdateDepartemenInput) {
  return repository.update(id, input)
}

export function deleteDepartemen(id: string) {
  return repository.delete(id)
}

export function showDepartemen(id: string) {
  return repository.show(id)
}

export function hardDeleteDepartemen(id: string) {
  return repository.hardDelete(id)
}
