// src/domain/surat/repositories.ts
//
// Kontrak (interface) yang harus diimplementasikan oleh infrastructure layer.
// Domain tidak tahu soal Prisma — hanya tahu bentuk datanya.

import type { CreateSuratPayload, UpdateSuratPayload } from "./types"

export interface ISuratRepository {
  findAll(type: string | null, ids: number[] | null): Promise<unknown[]>
  findByIdAndDept(id: number, dept: string): Promise<unknown | null>
  create(payload: CreateSuratPayload): Promise<unknown>
  update(id: number, dept: string, payload: UpdateSuratPayload): Promise<unknown>
  delete(id: number, dept: string): Promise<void>
  getPreviewNomor(deptId: string): Promise<string>
}