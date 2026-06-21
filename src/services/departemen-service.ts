// src/services/departemen-service.ts

import { DepartemenRepository } from "@/infrastructure/repositories/departemen-repositories"
import type {
  CreateDepartemenInput,
  UpdateDepartemenInput,
} from "@/app/validation/departemen"

const repository = new DepartemenRepository()

export function fetchDepartemen() {
  return repository.findAllActive()
}

export function fetchDepartemenById(id: string) {
  return repository.findById(id)
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

export function hardDeleteDepartemen(id: string) {
  return repository.hardDelete(id)
}
