import type { ISuratRepository, SuratResult, PaginatedResult } from "./repositories"
import type { CreateSuratPayload, UpdateSuratPayload, PIItem, SuratItem } from "./types"

export { applyTujuanToPIList, applyTujuanToSuratList } from "@/domain/surat/entities"

export async function getAllSurat(
  type:        string | null,
  ids:         number[] | null,
  pagination:  { page: number; limit: number } | undefined,
  repository:  ISuratRepository,
  date?:       string | null,
  depts?:      string[] | null,
): Promise<SuratResult[] | PaginatedResult<SuratResult>> {
  return repository.findAll(type, ids, pagination, date, depts)
}

export async function getSuratById(
  id:         number,
  dept:       string,
  repository: ISuratRepository,
): Promise<SuratResult | null> {
  return repository.findByIdAndDept(id, dept)
}

export async function createSurat(
  payload:    CreateSuratPayload,
  repository: ISuratRepository,
): Promise<SuratResult> {
  return repository.create(payload)
}

export async function updateSurat(
  id:         number,
  dept:       string,
  payload:    UpdateSuratPayload,
  repository: ISuratRepository,
): Promise<SuratResult> {
  return repository.update(id, dept, payload)
}

export async function deleteSurat(
  id:         number,
  dept:       string,
  repository: ISuratRepository,
): Promise<void> {
  return repository.delete(id, dept)
}

export function getLampiranNum(lampiran: string): string {
  return lampiran.replace(/\D/g, "")
}

export function formatLampiran(raw: string): string {
  const num = raw.replace(/\D/g, "")
  return num ? `${num} Set` : ""
}

interface ValidateSuratFormParams {
  deptId?:        string
  asalSurat:      string
  tanggalTerima?: string
  isPIDept:       boolean
  piList:         PIItem[]
  suratList:      SuratItem[]
}

export function validateSuratForm({
  deptId, asalSurat, tanggalTerima, isPIDept, piList, suratList,
}: ValidateSuratFormParams): string[] {
  const missing: string[] = []
  if (deptId !== undefined && !deptId)               missing.push("Departemen")
  if (!asalSurat)                                    missing.push("Asal Surat")
  if (tanggalTerima !== undefined && !tanggalTerima) missing.push("Tanggal Terima")
  if (isPIDept) {
    piList.forEach((p, i) => {
      if (!p.namaSupplier) missing.push(`Invoice ${i + 1}: Nama Supplier`)
      if (!p.noInvoice)    missing.push(`Invoice ${i + 1}: No. Invoice`)
    })
  } else {
    suratList.forEach((s, i) => {
      if (!s.perihal) missing.push(`Surat ${i + 1}: Perihal`)
    })
  }
  return missing
}

interface BuildCreatePayloadParams {
  deptId:        string
  asalSurat:     string
  tujuan:        string
  tanggalTerima: string
  isPIDept:      boolean
  piList:        PIItem[]
  suratList:     SuratItem[]
}

export function buildCreatePayload({
  deptId, asalSurat, tujuan, tanggalTerima, isPIDept, piList, suratList,
}: BuildCreatePayloadParams): CreateSuratPayload {
  return {
    deptId, asalSurat, tujuan, tanggalTerima, isPIDept,
    ...(isPIDept
      ? { piList:    piList.map(({ id: _id, ...rest }) => rest) }
      : { suratList: suratList.map(({ id: _id, ...rest }) => rest) }
    ),
  }
}

interface BuildUpdatePayloadParams {
  deptId:        string
  asalSurat:     string
  tujuan:        string
  tanggalTerima: string
  isPIDept:      boolean
  piList:        PIItem[]
  suratList:     SuratItem[]
}

export function buildUpdatePayload({
  deptId, asalSurat, tujuan, tanggalTerima, isPIDept, piList, suratList,
}: BuildUpdatePayloadParams): UpdateSuratPayload {
  return {
    deptId, asalSurat, tujuan, tanggalTerima,  // ← tambah deptId
    ...(isPIDept
      ? { piList:    piList.map(({ id: _id, ...rest }) => rest) }
      : { suratList: suratList.map(({ id: _id, ...rest }) => rest) }
    ),
  }
}