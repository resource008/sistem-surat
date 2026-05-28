import { getAllSurat, getSuratById, createSurat, updateSurat, deleteSurat } from "@/domain/surat/use-cases"
import { SuratRepository }   from "@/infrastructure/repositories/surat-repositories"
import type { SuratResult, PaginatedResult } from "@/domain/surat/repositories"
import type { CreateSuratPayload, UpdateSuratPayload } from "@/domain/surat/types"

const repository = new SuratRepository()

export function fetchAllSurat(
  type?:       string | null,
  ids?:        number[] | null,
  pagination?: { page: number; limit: number },
  date?:       string | null,
  depts?:      string[] | null,
): Promise<SuratResult[] | PaginatedResult<SuratResult>> {
  return getAllSurat(type ?? null, ids ?? null, pagination, repository, date, depts)
}

export function fetchSuratById(
  id:   number,
  dept: string,
): Promise<SuratResult | null> {
  return getSuratById(id, dept, repository)
}

export function saveSurat(payload: CreateSuratPayload): Promise<SuratResult> {
  return createSurat(payload, repository)
}

export function editSurat(
  id:      number,
  dept:    string,
  payload: UpdateSuratPayload,
): Promise<SuratResult> {
  return updateSurat(id, dept, payload, repository)
}

export function removeSurat(id: number, dept: string): Promise<void> {
  return deleteSurat(id, dept, repository)
}

export function fetchPreviewNomor(deptId: string): Promise<string> {
  return repository.getPreviewNomor(deptId)
}