// src/services/surat-service.ts
//
// Jembatan antara API routes dan domain use-cases.
// API routes hanya boleh import dari sini — tidak langsung ke repository.

import {
  getAllSurat,
  getSuratById,
  createSurat,
  updateSurat,
  deleteSurat,
} from "@/domain/surat/use-cases"
import { SuratRepository } from "@/infrastructure/repositories/surat-repositories"
import type { CreateSuratPayload, UpdateSuratPayload } from "@/domain/surat/types"

const repository = new SuratRepository()

export function fetchAllSurat(type: string | null, ids: number[] | null) {
  return getAllSurat(type, ids, repository)
}

export function fetchSuratById(id: number, dept: string) {
  return getSuratById(id, dept, repository)
}

export function saveSurat(payload: CreateSuratPayload) {
  return createSurat(payload, repository)
}

export function editSurat(id: number, dept: string, payload: UpdateSuratPayload) {
  return updateSurat(id, dept, payload, repository)
}

export function removeSurat(id: number, dept: string) {
  return deleteSurat(id, dept, repository)
}

export function fetchPreviewNomor(deptId: string) {
  return repository.getPreviewNomor(deptId)
}