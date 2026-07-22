import type {
  ISuratRepository,
  PaginatedResult,
  SuratResult,
} from "@/domain/surat/repositories"
import type {
  CreateSuratPayload,
  UpdateSuratPayload,
} from "@/domain/surat/types"
import {
  createSuratMutation,
  deleteSuratMutation,
  updateSuratMutation,
} from "@/infrastructure/repositories/surat/mutations"
import { getPreviewNomorForDepartment } from "@/infrastructure/repositories/surat/numbering"
import {
  findAllSurat,
  findSuratByIdAndDept,
} from "@/infrastructure/repositories/surat/reads"

export class SuratRepository implements ISuratRepository {
  async findAll(
    type:        string | null,
    ids:         number[] | null,
    pagination?: { page: number; limit: number },
    date?:       string | null,
    depts?:      string[] | null,
    search?:     string | null,
    column?:     string | null,
  ): Promise<SuratResult[] | PaginatedResult<SuratResult>> {
    return findAllSurat(ids, pagination, date, depts, search, column)
  }

  async findByIdAndDept(id: number, dept: string): Promise<SuratResult | null> {
    return findSuratByIdAndDept(id, dept)
  }

  async create(payload: CreateSuratPayload): Promise<SuratResult> {
    return createSuratMutation(payload)
  }

  async update(id: number, dept: string, payload: UpdateSuratPayload): Promise<SuratResult> {
    return updateSuratMutation(id, dept, payload)
  }

  async delete(id: number, dept: string): Promise<void> {
    await deleteSuratMutation(id, dept)
  }

  async getPreviewNomor(deptId: string, tanggalTerima?: Date): Promise<string> {
    return getPreviewNomorForDepartment(deptId, tanggalTerima)
  }
}
