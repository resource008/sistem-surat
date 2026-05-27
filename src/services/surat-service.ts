// src/services/surat-service.ts

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

// ← Hanya satu fungsi fetchAllSurat, hapus yang lama
export function fetchAllSurat(
  type?: string | null,
  ids?: number[] | null,
  pagination?: { page: number; limit: number }
) {
  return getAllSurat(type ?? null, ids ?? null, pagination, repository)
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