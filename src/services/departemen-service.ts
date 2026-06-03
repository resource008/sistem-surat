// src/services/departemen-service.ts

import { DepartemenRepository } from "@/infrastructure/repositories/departemen-repositories"

const repository = new DepartemenRepository()

export function fetchDepartemen() {
  return repository.findAllActive()
}