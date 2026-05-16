// src/domain/surat/use-cases.ts
//
// Orchestrasi logika bisnis surat.
// Dipanggil oleh services — tidak pernah langsung dari API route.

import type { ISuratRepository } from "./repositories"
import type { CreateSuratPayload, UpdateSuratPayload } from "./types"

export async function getSuratById(
  id:         number,
  dept:       string,
  repository: ISuratRepository,
) {
  return repository.findByIdAndDept(id, dept)
}

export async function getAllSurat(
  type:       string | null,
  ids:        number[] | null,
  repository: ISuratRepository,
) {
  return repository.findAll(type, ids)
}

export async function createSurat(
  payload:    CreateSuratPayload,
  repository: ISuratRepository,
) {
  return repository.create(payload)
}

export async function updateSurat(
  id:         number,
  dept:       string,
  payload:    UpdateSuratPayload,
  repository: ISuratRepository,
) {
  return repository.update(id, dept, payload)
}

export async function deleteSurat(
  id:         number,
  dept:       string,
  repository: ISuratRepository,
) {
  return repository.delete(id, dept)
}