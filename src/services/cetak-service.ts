// src/services/cetak.service.ts

import { CetakRepository } from "@/infrastructure/repositories/cetak-repositories"

const repository = new CetakRepository()

export function fetchCetakAll(ids?: number[]) {
  return repository.findAll(ids)
}
